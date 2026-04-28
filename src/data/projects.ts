export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  imageContain?: boolean;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "SSUPORT",
    description:
      "Integrated Special Scholarship Platform of Soongsil University",
    tags: [],
    liveUrl: "https://ssuport.kr/",
    imageUrl: "/project1.svg",
    imageContain: true,
  },
  {
    id: "2",
    title: "Soongsil University Student Council",
    description: "Official Website",
    tags: [],
    liveUrl: "https://stu.ssu.ac.kr/",
    imageUrl: "/project2.webp",
  },
  {
    id: "3",
    title: "grabPT",
    description:
      "A matching platform for personal training (PT) clients and professionals",
    tags: [],
    imageUrl: "/project3.png",
    imageContain: true,
  },
];
