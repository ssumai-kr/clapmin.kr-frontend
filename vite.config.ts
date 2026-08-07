import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Dev-only: serve `api/chat.ts` (a Vercel Edge Function) at /api/chat so
 * `npm run dev` exercises the real endpoint. In production Vercel runs the
 * function itself, so this plugin never applies to a build.
 */
function apiDevServer(): Plugin {
  return {
    name: "api-dev-server",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/api/chat", async (req, res) => {
        try {
          const mod = await server.ssrLoadModule("/api/chat.ts");
          const handler = mod.default as (r: Request) => Promise<Response>;

          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);

          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) {
            if (typeof v === "string") headers.set(k, v);
          }

          const response = await handler(
            new Request(`http://localhost${req.originalUrl ?? req.url ?? "/"}`, {
              method: req.method ?? "GET",
              headers,
              body: chunks.length ? Buffer.concat(chunks) : undefined,
            }),
          );

          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));

          if (response.body) {
            const reader = response.body.getReader();
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
          }
          res.end();
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: String(err) }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // "" prefix = load unprefixed vars too. Only the server-side key is copied
  // into process.env for the dev middleware; it is never exposed to the client
  // (no `define`, and Vite only ships VITE_-prefixed vars to the browser).
  const env = loadEnv(mode, process.cwd(), "");
  if (env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;

  return {
    plugins: [react(), apiDevServer()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
