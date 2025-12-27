import TextPressure from './components/TextPressure';
import TextType from './components/TextType';
import YouTubePlayer from './components/YouTubePlayer';
import itsSupportCard from './images/itssupportcard.png';
import sapLogo from './images/sap.png';

function App() {
  const youtubeVideoIds = [
    'QwByM5-vwlM',
    'bH6ZvLhUx5o',
    'P18g4rKns6Q'
  ];

  return (
    <div className='flex flex-col items-center justify-between min-h-screen bg-slate-300 py-8 px-4'>
      <div className='flex flex-col items-center justify-start flex-1 w-full'>
        <div style={{ position: 'relative', height: '100px' }}>
          <TextPressure
            text="CLAP MIN!"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#000000"
            strokeColor="#ff0000"
            minFontSize={100}
          />
        </div>
        <TextType
          text={['Welcome My SPACE! This site is currently under development.','In the meantime, enjoy some music! 🎵']}
          typingSpeed={120}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
          className='text-2xl font-extrabold px-4 mb-8 h-[100px] mt-[20px]'
        />

        <div className="mt-1 w-full">
          <YouTubePlayer videoIds={youtubeVideoIds} />
        </div>

        <div className="mt-8 w-full max-w-sm mx-auto bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-300/50">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-gray-800">Park Sumin</h3>
            <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
              <span>Web Software Developer / ERP Developer</span>
              <img src={sapLogo} alt="SAP" className="w-7 h-4 inline-block" />
            </p>
            <div className="pt-2 space-y-1 text-xs text-gray-700">
              <p>
                <span className="font-medium">GitHub:</span>{' '}
                <a
                  href="https://github.com/ssumai-kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors underline"
                >
                  github.com/ssumai-kr
                </a>
              </p>
              <p>
                <span className="font-medium">Contact:</span>{' '}
                <a
                  href="mailto:fhsjdvs@gmail.com"
                  className="hover:text-gray-900 transition-colors underline"
                >
                  fhsjdvs@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full max-w-sm mx-auto">
          <img
            src={itsSupportCard}
            alt="IT Support Card"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      <footer className="w-full mt-12 pt-8 border-t border-gray-400/30">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-700 font-medium">
            © 2025 clapmin. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Contact: <a href="mailto:fhsjdvs@gmail.com" className="hover:text-gray-900 transition-colors underline">fhsjdvs@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
