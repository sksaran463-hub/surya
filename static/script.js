/* ============================================================
   ANPR Vision – script.js
   Handles: detect page upload + API call
   ============================================================ */

const API_BASE = 'http://127.0.0.1:5000';

/* ============================================================
   DETECT PAGE
   ============================================================ */
(function initDetect() {
    // Only run on detect page
    const dropZone = document.getElementById('dropZone');
    if (!dropZone) return;

    const fileInput = document.getElementById('fileInput');
    const dropInner = document.getElementById('dropInner');
    const previewCont = document.getElementById('previewContainer');
    const previewImg = document.getElementById('previewImg');
    const previewVid = document.getElementById('previewVid');
    const previewInfo = document.getElementById('previewInfo');
    const clearBtn = document.getElementById('clearBtn');
    const detectBtn = document.getElementById('detectBtn');
    const btnText = detectBtn.querySelector('.btn-text');
    const btnIcon = detectBtn.querySelector('.btn-icon');
    const btnSpinner = document.getElementById('btnSpinner');
    const resultCard = document.getElementById('resultCard');
    const errorCard = document.getElementById('errorCard');
    const errorMsg = document.getElementById('errorMsg');
    const errorRetryBtn = document.getElementById('errorRetryBtn');
    const newScanBtn = document.getElementById('newScanBtn');

    let selectedFile = null;

    /* ----- Drag & Drop ----- */
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files[0]) handleFile(fileInput.files[0]);
    });

    /* ----- Handle File ----- */
    function handleFile(file) {
        const allowed = ['image/jpeg', 'image/png', 'video/mp4', 'video/x-msvideo', 'video/avi'];
        const isImg = file.type.startsWith('image/');
        const isVid = file.type.startsWith('video/');

        if (!isImg && !isVid) {
            showError('Unsupported file type. Please upload JPG, PNG, MP4, or AVI.');
            return;
        }

        selectedFile = file;
        dropInner.style.display = 'none';
        previewCont.style.display = 'flex';

        const url = URL.createObjectURL(file);

        if (isImg) {
            previewImg.src = url;
            previewImg.style.display = 'block';
            previewVid.style.display = 'none';
        } else {
            previewVid.src = url;
            previewVid.style.display = 'block';
            previewImg.style.display = 'none';
        }

        previewInfo.textContent = `${file.name}  ·  ${formatSize(file.size)}`;
        detectBtn.disabled = false;

        // Hide old results
        resultCard.style.display = 'none';
        errorCard.style.display = 'none';
    }

    /* ----- Clear ----- */
    clearBtn.addEventListener('click', resetUpload);

    function resetUpload() {
        selectedFile = null;
        fileInput.value = '';
        previewImg.src = '';
        previewVid.src = '';
        previewImg.style.display = 'none';
        previewVid.style.display = 'none';
        previewCont.style.display = 'none';
        dropInner.style.display = 'flex';
        detectBtn.disabled = true;
        resultCard.style.display = 'none';
        errorCard.style.display = 'none';
    }

    newScanBtn.addEventListener('click', resetUpload);
    errorRetryBtn.addEventListener('click', resetUpload);

    /* ----- Detect ----- */
    detectBtn.addEventListener('click', async () => {
        if (!selectedFile) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await fetch(`${API_BASE}/detect`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Server error (${res.status})`);
            }

            const data = await res.json();
            showResult(data);

        } catch (err) {
            showError(err.message || 'Connection failed. Is the Flask server running?');
        } finally {
            setLoading(false);
        }
    });

    /* ----- Show Result ----- */
    function showResult(data) {
        const plate = data.plate_number || 'Not Detected';
        const conf = data.confidence != null ? data.confidence : null;
        const outFile = data.output_file || null;

        // Plate
        document.getElementById('plateNumber').textContent = plate;

        // Confidence
        const confPct = conf != null ? Math.round(conf * 100) : 0;
        document.getElementById('confValue').textContent = conf != null ? conf.toFixed(2) : '—';
        document.getElementById('confPct').textContent = confPct + '%';
        document.getElementById('timestampValue').textContent = new Date().toLocaleTimeString();

        // Animate bar
        setTimeout(() => {
            document.getElementById('confBar').style.width = confPct + '%';
        }, 100);

        // Badge
        const badge = document.getElementById('confBadge');
        if (confPct >= 70) { badge.textContent = '✅ High Confidence'; badge.className = 'result-badge high'; }
        else if (confPct >= 40) { badge.textContent = '⚠️ Medium'; badge.className = 'result-badge med'; }
        else { badge.textContent = '❌ Low Confidence'; badge.className = 'result-badge low'; }

        // Output image/video
        const resultImg = document.getElementById('resultImg');
        const resultVid = document.getElementById('resultVid');
        resultImg.style.display = 'none';
        resultVid.style.display = 'none';

        if (outFile) {
            const fileUrl = `${API_BASE}/${outFile.replace(/\\/g, '/').replace(/^static\//, 'static/')}`;
            if (outFile.match(/\.(jpg|jpeg|png)$/i)) {
                resultImg.src = fileUrl;
                resultImg.style.display = 'block';
            } else {
                resultVid.src = fileUrl;
                resultVid.style.display = 'block';
            }
        }

        resultCard.style.display = 'block';
        errorCard.style.display = 'none';

        // Smooth scroll
        setTimeout(() => {
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    /* ----- Show Error ----- */
    function showError(msg) {
        errorMsg.textContent = msg;
        errorCard.style.display = 'block';
        resultCard.style.display = 'none';
        errorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /* ----- Loading State ----- */
    function setLoading(on) {
        detectBtn.disabled = on;
        btnSpinner.style.display = on ? 'block' : 'none';
        btnText.textContent = on ? 'Analysing…' : 'Detect Number Plate';
        btnIcon.textContent = on ? '' : '🚗';
    }

    /* ----- Helpers ----- */
    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
})();
