import { useState } from 'react';
import './app.css';
import TwibbonEditor from './TwibbonEditor.jsx';
import CaptionCard from './CaptionCard.jsx';

// Frame twibbon (ada di folder public)
const FRAME_URL = "/frame-diesnatalis.png";
const LOGO_URL = "/logo-diesnatalis.png";

// Ukuran canvas mengikuti ukuran asli frame (1080 x 1440) supaya tidak gepeng
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1440;

// --- DATA LOMBA & CAPTION ---
const COMPETITIONS = [
  {
    id: 'nurfa',
    icon: '📖',
    name: 'NURFA',
    tagline: 'Musabaqah Tilawatil Qur\'an',
    text: `📖 LET YOUR VOICE LEAVE A TRACE. ✨\n🌙 NURFA 2026 🌙\n\nPerkenalkan Saya [Nama Lengkap] dari [Asal Sekolah], siap menjadi bagian dari NURFA 2026 dan melantunkan ayat suci Al-Qur'an dengan penuh penghayatan dan keindahan. 🤍\n\n✨ Mari jadikan setiap lantunan sebagai bagian dari perjalanan dan tinggalkan jejak kebaikan melalui setiap ayat yang dibaca.\n\n🏁 RUN YOUR RACE. 📖 LEAVE YOUR TRACE.\n\n#NURFA2026 #SkomdaDiesnatalis7 #RunTheRaceLeaveYourTrace #SMKTelkomSidoarjo`
  },
  {
    id: 'stellar',
    icon: '🧠',
    name: 'STELLAR',
    tagline: 'Olimpiade Matematika & IPA',
    text: `🧠 READY TO CHALLENGE YOUR MIND? 🌟\n\nHalo! Aku [Nama] dari [Sekolah/Instansi], dan aku siap mengikuti STELLAR — Olimpiade Matematika & IPA dalam rangka SKOMDA DIESNATALIS 7! Saatnya menguji pengetahuan, logika, dan kemampuan berpikirmu dalam menghadapi berbagai tantangan.\n\n⚡ Bersiap untuk bersaing, pecahkan setiap soal, dan tunjukkan kemampuan terbaikmu. Karena setiap tantangan adalah langkah untuk membuktikan seberapa jauh kamu bisa melangkah!\n\nThink. Solve. Shine. ✨\n\n🏁 Run Your Race, Leave Your Trace.\n\n#STELLAR #SkomdaDiesnatalis7 #RunTheRaceLeaveYourTrace #SMKTelkomSidoarjo`
  },
  {
    id: 'smc',
    icon: '🎮',
    name: 'SMC',
    tagline: 'Skomda Mobile Legend Competition S4',
    text: `🎮 I'M READY FOR SMC SEASON 4! 👋\n\nHalo! [Nama] dari [Asal Sekolah/Instansi], siap turun ke battlefield dan ikut meramaikan SMC — Skomda Mobile Legend Competition Season 4 dalam rangka SKOMDA DIESNATALIS 7! 🔥🏆\n\nEsport is our battlefield, teamwork is our weapon, and victory is the goal! 🔥\n\n🏁 RUN YOUR RACE. 🔥 LEAVE YOUR TRACE.\n\n#SMC #SkomdaMobileLegend #SkomdaDiesnatalis7 #RunYourRaceLeaveYourTrace #SMKTelkomSidoarjo`
  },
  {
    id: 'techup',
    icon: '💻',
    name: 'TECH UP',
    tagline: 'Olimpiade TIK',
    text: `💻 READY TO ENTER THE DIGITAL RACE? ⚡\n\nHalo! Aku [Nama] dari [Sekolah/Instansi], dan aku siap berkompetisi di TECH UP — Olimpiade TIK dalam rangka SKOMDA Dies Natalis 7! 🚀\n\nDunia digital terus berkembang, dan sekarang saatnya menguji seberapa jauh kemampuanmu. Tantang logikamu, perluas pengetahuanmu, dan tunjukkan kemampuanmu dalam menghadapi berbagai tantangan TIK!\n\n💡 Buktikan bahwa kamu bukan hanya mengikuti perkembangan teknologi, tapi juga siap menjadi bagian dari masa depannya.\n\nThink smart. Go beyond. Leave your trace. 🔥\n\n🏁 Run the Race, Leave Your Trace.\n\n#TechUp #OlimpiadeTIK #SkomdaDiesnatalis7 #RunTheRaceLeaveYourTrace #SMKTelkomSidoarjo`
  },
  {
    id: 'sync',
    icon: '🎬',
    name: 'SYNC',
    tagline: 'Skomda Youth Narative Cinema',
    text: `🎬 LIGHTS, CAMERA, LEAVE YOUR TRACE! ✨\n\nHalo! Aku [Nama] dari [Sekolah/Instansi], dan aku siap berkompetisi di SYNC — Skomda Youth Narative Cinema dalam rangka SKOMDA Dies Natalis 7! 🎞️\n\nSaatnya menuangkan ide dan cerita ke dalam gambar bergerak, mengasah kreativitas, dan menunjukkan sudut pandang lewat karya sinema terbaik!\n\n💡 Buktikan bahwa kamu siap menjadi bagian dari perjalanan ini.\n\nCreate boldly. Tell your story. Leave your trace. 🔥\n\n🏁 Run the Race, Leave Your Trace.\n\n#SYNC #SkomdaYouthNarativeCinema #SkomdaDiesnatalis7 #RunTheRaceLeaveYourTrace #SMKTelkomSidoarjo`
  },
];

const App = () => {
  const [selectedComp, setSelectedComp] = useState(null);

  // --- LAYAR PILIHAN LOMBA (tampil sebelum masuk ke editor) ---
  if (!selectedComp) {
    return (
      <div className="app-container">
        <div className="main-wrapper" style={{ justifyContent: 'center' }}>
          <div className="card twibbon-card" style={{ maxWidth: 500 }}>
            <span className="step-badge">Langkah 1 dari 3</span>
            <img src={LOGO_URL} alt="Dies Natalis ke-7 SMK Telkom Sidoarjo" className="header-logo" />
            <h1>Twibbon Dies Natalis ke-7 SMK Telkom Sidoarjo</h1>
            <p className="subtitle">Pilih lomba yang kamu ikuti untuk menyesuaikan caption 👇</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
              {COMPETITIONS.map((comp) => (
                <button
                  key={comp.id}
                  className="btn btn-download"
                  style={{
                    background: 'var(--teal-dies)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 12,
                    textAlign: 'left',
                    padding: '14px 18px'
                  }}
                  onClick={() => setSelectedComp(comp.id)}
                >
                  <span style={{ fontSize: '1.4rem' }}>{comp.icon}</span>
                  <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
                    <span style={{ fontWeight: 700 }}>{comp.name}</span>
                    <span style={{ fontWeight: 400, fontSize: '0.8rem', opacity: 0.9 }}>{comp.tagline}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeComp = COMPETITIONS.find(c => c.id === selectedComp) || COMPETITIONS[0];

  return (
    <div className="app-container">
      <div className="main-wrapper">

        {/* KARTU EDITOR */}
        <div className="card twibbon-card">
          <span className="step-badge">Langkah 2 dari 3</span>
          <img src={LOGO_URL} alt="Dies Natalis ke-7 SMK Telkom Sidoarjo" className="header-logo" />
          <h1>Twibbon Dies Natalis ke-7 SMK Telkom Sidoarjo</h1>
          <p className="subtitle" style={{ marginBottom: 6 }}>
            Lomba: <b>{activeComp.name}</b>
          </p>
          <button className="btn-ganti-lomba" onClick={() => setSelectedComp(null)}>
            🔁 Ganti Lomba
          </button>
          <p className="subtitle">Cubit (Pinch) / Scroll untuk Zoom bebas, Geser untuk atur posisi.</p>

          <TwibbonEditor
            frameUrl={FRAME_URL}
            canvasWidth={CANVAS_WIDTH}
            canvasHeight={CANVAS_HEIGHT}
            downloadFileName={`TWIBBON-DIESNATALIS-7-${activeComp.name}`}
          />
        </div>

        {/* KARTU CAPTION */}
        <CaptionCard
          stepBadge="Langkah 3 dari 3"
          title={`Caption — ${activeComp.name}`}
          captionText={activeComp.text}
        />

      </div>
    </div>
  );
};

export default App;
