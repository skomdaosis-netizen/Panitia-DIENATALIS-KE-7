import { useState, useRef, useEffect } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';

// Batas zoom: min sangat kecil (bebas zoom out), max sangat besar
const MIN_SCALE = 0.05;
const MAX_SCALE = 10;

// Hitung initial scale supaya foto langsung "cover" canvas (tidak ada area kosong)
const calcInitialScale = (img, canvasWidth, canvasHeight) => {
  if (!img) return 1;
  const { width: iw, height: ih } = img;
  const scaleW = canvasWidth / iw;
  const scaleH = canvasHeight / ih;
  return Math.max(scaleW, scaleH);
};

/**
 * Kartu editor foto: upload, geser, zoom, putar, lalu download hasil twibbon.
 * Dipakai ulang oleh halaman lomba (app.jsx) dan halaman panitia (panitia.jsx)
 * supaya logikanya tidak perlu ditulis dua kali.
 */
const TwibbonEditor = ({ frameUrl, canvasWidth, canvasHeight, downloadFileName }) => {
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [initialScale, setInitialScale] = useState(1); // dipakai tombol Reset
  const [rotate, setRotate] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [toast, setToast] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const editorRef = useRef(null);
  const lastPinchDist = useRef(null);
  const wrapperRef = useRef(null);
  const toastTimerRef = useRef(null);

  const showToast = (msg, duration = 3000) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(""), duration);
  };

  // --- LOGIC DROPZONE ---
  const onDrop = (acceptedFiles, fileRejections) => {
    setUploadError("");

    if (fileRejections && fileRejections.length > 0) {
      const reason = fileRejections[0]?.errors?.[0]?.code;
      if (reason === 'file-too-large') {
        setUploadError("Ukuran file terlalu besar. Maksimal 15MB ya.");
      } else if (reason === 'file-invalid-type') {
        setUploadError("Format file tidak didukung. Gunakan JPG atau PNG.");
      } else {
        setUploadError("File tidak bisa dipakai, coba foto lain ya.");
      }
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const initScale = calcInitialScale(img, canvasWidth, canvasHeight);
        setScale(initScale);
        setInitialScale(initScale);
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        setUploadError("Foto gagal dibaca. Coba gunakan file JPG/PNG lain.");
        URL.revokeObjectURL(url);
      };
      img.src = url;
      setImage(file);
      setRotate(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 15 * 1024 * 1024, // 15MB
    multiple: false,
    noClick: !!image
  });

  // --- RESET POSISI & ZOOM (tanpa perlu upload ulang) ---
  const handleReset = () => {
    setScale(initialScale);
    setRotate(0);
    // react-avatar-editor tidak punya API reset posisi drag secara langsung,
    // jadi kita re-mount komponennya lewat key agar posisi geser ikut kembali ke tengah.
    setResetKey((k) => k + 1);
  };

  // --- LOGIC ZOOM (MOUSE SCROLL) ---
  // Dipasang manual lewat addEventListener (bukan prop onWheel React) karena
  // browser modern sering memasang wheel listener sebagai "passive" secara
  // default, sehingga e.preventDefault() gagal jalan. Dengan { passive: false }
  // di bawah ini, preventDefault() bisa berjalan normal dan zoom scroll berfungsi.
  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    if (!wrapperEl || !image) return;

    const onWheel = (e) => {
      e.preventDefault();
      const zoomSensitivity = 0.08;
      const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
      const factor = 1 + delta;
      setScale((prevScale) => Math.min(Math.max(prevScale * factor, MIN_SCALE), MAX_SCALE));
    };

    wrapperEl.addEventListener('wheel', onWheel, { passive: false });
    return () => wrapperEl.removeEventListener('wheel', onWheel);
  }, [image]);

  // --- LOGIC ZOOM (PINCH / CUBIT DI HP) ---
  const getDistance = (touch1, touch2) => {
    return Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
  };

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    if (!wrapperEl || !image) return;

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        lastPinchDist.current = getDistance(e.touches[0], e.touches[1]);
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 2 && lastPinchDist.current) {
        e.preventDefault();
        const dist = getDistance(e.touches[0], e.touches[1]);
        const zoomFactor = dist / lastPinchDist.current;
        setScale((prevScale) => Math.min(Math.max(prevScale * zoomFactor, MIN_SCALE), MAX_SCALE));
        lastPinchDist.current = dist;
      }
    };

    const onTouchEnd = () => {
      lastPinchDist.current = null;
    };

    wrapperEl.addEventListener('touchstart', onTouchStart, { passive: false });
    wrapperEl.addEventListener('touchmove', onTouchMove, { passive: false });
    wrapperEl.addEventListener('touchend', onTouchEnd);

    return () => {
      wrapperEl.removeEventListener('touchstart', onTouchStart);
      wrapperEl.removeEventListener('touchmove', onTouchMove);
      wrapperEl.removeEventListener('touchend', onTouchEnd);
    };
  }, [image]);

  // --- DOWNLOAD LOGIC ---
  const handleDownload = () => {
    if (!editorRef.current) return;

    const canvas = editorRef.current.getImageScaledToCanvas();
    const ctx = canvas.getContext('2d');

    const frameImg = new Image();
    frameImg.src = frameUrl;
    frameImg.crossOrigin = "anonymous";

    frameImg.onload = () => {
      try {
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `${downloadFileName}.png`;
        link.href = dataUrl;
        link.click();
        showToast("Berhasil diunduh! Cek folder Download kamu 📥");
      } catch (err) {
        showToast("Gagal mengunduh, coba lagi ya.");
      }
    };

    frameImg.onerror = () => {
      showToast("Gagal memuat frame, coba refresh halaman.");
    };
  };

  // Konversi scale ke persentase untuk tampilan slider yang intuitif (skala log
  // supaya pergerakan slider terasa linear meski rentang zoom sangat lebar)
  const scaleToSlider = (s) => {
    const clamped = Math.min(Math.max(s, MIN_SCALE), MAX_SCALE);
    return Math.round(
      ((Math.log(clamped) - Math.log(MIN_SCALE)) / (Math.log(MAX_SCALE) - Math.log(MIN_SCALE))) * 100
    );
  };
  const sliderToScale = (v) => {
    return Math.exp(
      Math.log(MIN_SCALE) + (v / 100) * (Math.log(MAX_SCALE) - Math.log(MIN_SCALE))
    );
  };

  return (
    <>
      {!image ? (
        <>
          <div {...getRootProps()} className={`dropzone-area ${isDragActive ? 'dropzone-active' : ''}`}>
            <input {...getInputProps()} />
            <span className="icon-upload">☁️</span>
            <p>Klik atau Tarik Foto ke Sini</p>
            <small style={{ color: '#999', fontSize: '0.75rem' }}>JPG, PNG, atau WEBP · maks 15MB</small>
          </div>
          {uploadError && <p className="upload-error">⚠️ {uploadError}</p>}
        </>
      ) : (
        <div className="editor-container">
          {/* AREA INTERAKSI */}
          <div ref={wrapperRef} className="twibbon-wrapper">
            <AvatarEditor
              key={resetKey}
              ref={editorRef}
              image={image}
              width={canvasWidth}
              height={canvasHeight}
              border={0}
              scale={scale}
              rotate={rotate}
              style={{ background: '#fff', cursor: 'move' }}
            />
            <img src={frameUrl} alt="Frame" className="frame-overlay" />
          </div>

          {/* SLIDER CONTROLS */}
          <div className="controls">
            <div className="slider-group">
              <span className="slider-label">🔍 Zoom ({Math.round(scale * 100)}%)</span>
              <input
                type="range"
                onChange={(e) => setScale(sliderToScale(parseFloat(e.target.value)))}
                min="0" max="100" step="1"
                value={scaleToSlider(scale)}
              />
            </div>

            {showAdvanced && (
              <div className="slider-group">
                <span className="slider-label">🔄 Putar</span>
                <input
                  type="range"
                  onChange={(e) => setRotate(parseFloat(e.target.value))}
                  min="-180" max="180" step="1" value={rotate}
                />
              </div>
            )}

            <button className="btn-link-toggle" onClick={() => setShowAdvanced((v) => !v)} type="button">
              {showAdvanced ? '▲ Sembunyikan pengaturan putar' : '▼ Pengaturan lanjutan (putar foto)'}
            </button>

            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button className="btn btn-ganti" style={{ flex: 1 }} onClick={handleReset}>
                ↺ Reset
              </button>
              <button className="btn btn-ganti" style={{ flex: 1 }} onClick={() => setImage(null)}>
                📂 Ganti Foto
              </button>
            </div>
          </div>

          <button className="btn btn-download" onClick={handleDownload}>
            DOWNLOAD DISINI
          </button>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
};

export default TwibbonEditor;
