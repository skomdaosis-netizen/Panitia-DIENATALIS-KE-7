import './app.css';
import TwibbonEditor from './TwibbonEditor.jsx';
import CaptionCard from './CaptionCard.jsx';

// Frame twibbon khusus panitia (ada di folder public)
const FRAME_URL = "/frame-panitia.png";
const LOGO_URL = "/logo-diesnatalis.png";

// Ukuran canvas mengikuti ukuran asli frame panitia (3072 x 4096)
const CANVAS_WIDTH = 3072;
const CANVAS_HEIGHT = 4096;

// Caption tetap untuk panitia (tidak bergantung pada pilihan lomba)
const CAPTION_TEXT = `🏁 *I'M READY TO RUN THE RACE!* 🔥\n\nHalo! Aku [Nama] dari [Sie/Divisi], dan aku siap menjadi bagian dari perjalanan SKOMDA DIESNATALIS 7! 🎉\nBukan hanya sebagai panitia, tapi sebagai bagian dari orang-orang yang akan bekerja, berproses, dan menciptakan cerita di balik perayaan Dies Natalis ke-7 SMK Telkom Sidoarjo.\n\nDengan semangat:\n✨ "Run the Race, Leave Your Trace" ✨\n\nSetiap persiapan, setiap tantangan, dan setiap langkah yang kami jalani akan menjadi bagian dari jejak yang kita tinggalkan bersama.\n\nLet's work together, make it happen, and create a celebration worth remembering! 🚀\n\n🏁 RUN YOUR RACE.\n✨ LEAVE YOUR TRACE.\nI'M READY TO MAKE THIS DIESNATALIS UNFORGETTABLE. 🔥\n\n@smktelkomsda\n@osis.smktelkomsda\n@mpk.smktelkomsda\n\n#SkomdaDiesnatalis7 #RunTheRaceLeaveYourTrace #Diesnatalis7 #SMKTelkomSidoarjo #PanitiaDiesnat7`;

const PanitiaApp = () => {
  return (
    <div className="app-container">
      <div className="main-wrapper">

        {/* KARTU EDITOR */}
        <div className="card twibbon-card">
          <img src={LOGO_URL} alt="Dies Natalis ke-7 SMK Telkom Sidoarjo" className="header-logo" />
          <h1>Twibbon Panitia Dies Natalis ke-7</h1>
          <p className="subtitle">SMK Telkom Sidoarjo — khusus untuk panitia SKOMDA Diesnatalis 7</p>
          <p className="subtitle">Cubit (Pinch) / Scroll untuk Zoom bebas, Geser untuk atur posisi.</p>

          <TwibbonEditor
            frameUrl={FRAME_URL}
            canvasWidth={CANVAS_WIDTH}
            canvasHeight={CANVAS_HEIGHT}
            downloadFileName="TWIBBON-DIESNATALIS-7-PANITIA"
          />
        </div>

        {/* KARTU CAPTION */}
        <CaptionCard
          title="Caption — Panitia"
          captionText={CAPTION_TEXT}
        />

      </div>
    </div>
  );
};

export default PanitiaApp;
