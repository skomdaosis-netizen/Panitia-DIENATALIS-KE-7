import { useState } from 'react';

// Ubah teks caption (dengan \n) menjadi elemen React yang rapi, serta
// menebalkan placeholder [Nama Lengkap] maupun teks *ditandai-bintang*
// (gaya bold ala Instagram) supaya enak dibaca di dalam kartu.
export const renderCaption = (text) => {
  const paragraphs = text.split('\n\n');
  return paragraphs.map((para, pIdx) => {
    const lines = para.split('\n');
    return (
      <p key={pIdx} style={{ margin: '0 0 14px 0' }}>
        {lines.map((line, lIdx) => {
          const parts = line.split(/(\[[^\]]+\]|\*[^*]+\*)/g);
          return (
            <span key={lIdx}>
              {parts.map((part, i) => {
                if (part.startsWith('[') && part.endsWith(']')) {
                  return <b key={i}>{part}</b>;
                }
                if (part.startsWith('*') && part.endsWith('*') && part.length > 1) {
                  return <b key={i}>{part.slice(1, -1)}</b>;
                }
                return part;
              })}
              {lIdx < lines.length - 1 && <br />}
            </span>
          );
        })}
      </p>
    );
  });
};

/**
 * Kartu caption: menampilkan teks caption yang sudah diformat rapi,
 * plus tombol salin (menyalin teks ASLI apa adanya, termasuk tanda
 * bintang/kurung siku, supaya hasil paste ke Instagram tetap sesuai).
 */
const CaptionCard = ({ stepBadge, title, captionText }) => {
  const [copySuccess, setCopySuccess] = useState("Salin Caption");

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(captionText);
      setCopySuccess("Berhasil Disalin!");
      setTimeout(() => setCopySuccess("Salin Caption"), 3000);
    } catch (err) {
      setCopySuccess("Gagal Menyalin");
    }
  };

  return (
    <div className="card caption-card">
      {stepBadge && <span className="step-badge">{stepBadge}</span>}
      <h2>📋 {title}</h2>
      <div className="caption-box">
        {renderCaption(captionText)}
      </div>
      <button
        className={`btn btn-copy ${copySuccess.includes("Berhasil") ? 'success' : ''}`}
        onClick={handleCopyCaption}
      >
        {copySuccess}
      </button>
    </div>
  );
};

export default CaptionCard;
