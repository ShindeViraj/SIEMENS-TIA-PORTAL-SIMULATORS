document.addEventListener('DOMContentLoaded', () => {
    
    const historyLength = 200;

    // --- CTU (Counter Up) Logic ---
    const ctuState = { cv: 0, q: false, cuInput: false, lastCuInput: false, rInput: false, pv: 5 };
    const ctuPvInput = document.getElementById('ctu-pv');
    const ctuCuBtn = document.getElementById('ctu-cu-btn');
    const ctuRBtn = document.getElementById('ctu-r-btn');
    const ctuCvDisplay = document.getElementById('ctu-cv-display');
    const ctuQLed = document.getElementById('ctu-q-led');
    const ctuCuContact = document.getElementById('ctu-cu-contact');
    const ctuQCoil = document.getElementById('ctu-q-coil');
    const ctuPvOnline = document.getElementById('ctu-pv-online');
    const ctuCvOnline = document.getElementById('ctu-cv-online');

    ctuPvInput.addEventListener('change', (e) => { ctuState.pv = parseInt(e.target.value) || 1; updateCtuLogic(); });

    ctuCuBtn.addEventListener('mousedown', () => { ctuState.cuInput = true; updateCtuLogic(); });
    ctuCuBtn.addEventListener('mouseup', () => { ctuState.cuInput = false; updateCtuLogic(); });
    ctuCuBtn.addEventListener('mouseleave', () => { ctuState.cuInput = false; updateCtuLogic(); });

    ctuRBtn.addEventListener('mousedown', () => { ctuState.rInput = true; updateCtuLogic(); });
    ctuRBtn.addEventListener('mouseup', () => { ctuState.rInput = false; updateCtuLogic(); });
    ctuRBtn.addEventListener('mouseleave', () => { ctuState.rInput = false; updateCtuLogic(); });

    function updateCtuLogic() {
        // Reset has absolute priority — resets CV to 0, does NOT touch PV
        if (ctuState.rInput) {
            ctuState.cv = 0;
        } else if (ctuState.cuInput && !ctuState.lastCuInput) {
            // Rising edge on CU: count up
            if (ctuState.cv < 32767) ctuState.cv++;
        }
        ctuState.q = ctuState.cv >= ctuState.pv;
        ctuState.lastCuInput = ctuState.cuInput;

        ctuCvDisplay.textContent = ctuState.cv;
        ctuPvOnline.textContent = "= " + ctuState.pv;
        ctuCvOnline.textContent = "= " + ctuState.cv;
        
        ctuState.q ? ctuQLed.classList.add('active') : ctuQLed.classList.remove('active');
        ctuState.q ? ctuQCoil.classList.add('active') : ctuQCoil.classList.remove('active');
        ctuState.cuInput ? ctuCuContact.classList.add('active') : ctuCuContact.classList.remove('active');
    }

    // --- CTD (Counter Down) Logic ---
    const ctdState = { cv: 0, q: true, cdInput: false, lastCdInput: false, ldInput: false, lastLdInput: false, pv: 5 };
    const ctdPvInput = document.getElementById('ctd-pv');
    const ctdCdBtn = document.getElementById('ctd-cd-btn');
    const ctdLdBtn = document.getElementById('ctd-ld-btn');
    const ctdCvDisplay = document.getElementById('ctd-cv-display');
    const ctdQLed = document.getElementById('ctd-q-led');
    const ctdCdContact = document.getElementById('ctd-cd-contact');
    const ctdQCoil = document.getElementById('ctd-q-coil');
    const ctdPvOnline = document.getElementById('ctd-pv-online');
    const ctdCvOnline = document.getElementById('ctd-cv-online');

    ctdPvInput.addEventListener('change', (e) => {
        ctdState.pv = parseInt(e.target.value) || 1;
        updateCtdLogic();
    });

    ctdCdBtn.addEventListener('mousedown', () => { ctdState.cdInput = true; updateCtdLogic(); });
    ctdCdBtn.addEventListener('mouseup', () => { ctdState.cdInput = false; updateCtdLogic(); });
    ctdCdBtn.addEventListener('mouseleave', () => { ctdState.cdInput = false; updateCtdLogic(); });

    ctdLdBtn.addEventListener('mousedown', () => { ctdState.ldInput = true; updateCtdLogic(); });
    ctdLdBtn.addEventListener('mouseup', () => { ctdState.ldInput = false; updateCtdLogic(); });
    ctdLdBtn.addEventListener('mouseleave', () => { ctdState.ldInput = false; updateCtdLogic(); });

    function updateCtdLogic() {
        // LD rising edge: loads CV with PV (does NOT reset PV)
        if (ctdState.ldInput && !ctdState.lastLdInput) {
            ctdState.cv = ctdState.pv;
        } else if (ctdState.cdInput && !ctdState.lastCdInput) {
            // Rising edge on CD: count down
            if (ctdState.cv > -32768) ctdState.cv--;
        }
        ctdState.q = ctdState.cv <= 0;
        ctdState.lastCdInput = ctdState.cdInput;
        ctdState.lastLdInput = ctdState.ldInput;

        ctdCvDisplay.textContent = ctdState.cv;
        ctdPvOnline.textContent = "= " + ctdState.pv;
        ctdCvOnline.textContent = "= " + ctdState.cv;
        
        ctdState.q ? ctdQLed.classList.add('active') : ctdQLed.classList.remove('active');
        ctdState.q ? ctdQCoil.classList.add('active') : ctdQCoil.classList.remove('active');
        ctdState.cdInput ? ctdCdContact.classList.add('active') : ctdCdContact.classList.remove('active');
    }

    // --- CTUD Logic ---
    const ctudState = { cv: 0, qu: false, qd: true, cuInput: false, lastCuInput: false, cdInput: false, lastCdInput: false, rInput: false, ldInput: false, lastLdInput: false, pv: 4 };
    const ctudPvInput = document.getElementById('ctud-pv');
    const ctudCuBtn = document.getElementById('ctud-cu-btn');
    const ctudCdBtn = document.getElementById('ctud-cd-btn');
    const ctudRBtn = document.getElementById('ctud-r-btn');
    const ctudLdBtn = document.getElementById('ctud-ld-btn');
    const ctudCvDisplay = document.getElementById('ctud-cv-display');
    const ctudQuLed = document.getElementById('ctud-qu-led');
    const ctudQdLed = document.getElementById('ctud-qd-led');
    const ctudCuContact = document.getElementById('ctud-cu-contact');
    const ctudCdContact = document.getElementById('ctud-cd-contact');
    const ctudQuCoil = document.getElementById('ctud-qu-coil');
    const ctudQdCoil = document.getElementById('ctud-qd-coil');
    const ctudPvOnline = document.getElementById('ctud-pv-online');
    const ctudCvOnline = document.getElementById('ctud-cv-online');

    if (ctudPvInput) {
        ctudPvInput.addEventListener('change', (e) => { ctudState.pv = parseInt(e.target.value) || 1; updateCtudLogic(); });
        
        const addMomentary = (btn, key) => {
            btn.addEventListener('mousedown', () => { ctudState[key] = true; updateCtudLogic(); });
            btn.addEventListener('mouseup', () => { ctudState[key] = false; updateCtudLogic(); });
            btn.addEventListener('mouseleave', () => { ctudState[key] = false; updateCtudLogic(); });
        };
        addMomentary(ctudCuBtn, 'cuInput'); addMomentary(ctudCdBtn, 'cdInput'); addMomentary(ctudRBtn, 'rInput'); addMomentary(ctudLdBtn, 'ldInput');
    }

    function updateCtudLogic() {
        // Reset has absolute priority — resets CV to 0, does NOT touch PV
        if (ctudState.rInput) {
            ctudState.cv = 0;
        } else if (ctudState.ldInput && !ctudState.lastLdInput) {
            // LD rising edge: loads CV with PV
            ctudState.cv = ctudState.pv;
        } else {
            if (ctudState.cuInput && !ctudState.lastCuInput) { if (ctudState.cv < 32767) ctudState.cv++; }
            if (ctudState.cdInput && !ctudState.lastCdInput) { if (ctudState.cv > -32768) ctudState.cv--; }
        }
        
        ctudState.qu = ctudState.cv >= ctudState.pv;
        ctudState.qd = ctudState.cv <= 0;
        ctudState.lastCuInput = ctudState.cuInput;
        ctudState.lastCdInput = ctudState.cdInput;
        ctudState.lastLdInput = ctudState.ldInput;

        if (ctudCvDisplay) {
            ctudCvDisplay.textContent = ctudState.cv;
            ctudPvOnline.textContent = "= " + ctudState.pv;
            ctudCvOnline.textContent = "= " + ctudState.cv;
            
            ctudState.qu ? ctudQuLed.classList.add('active') : ctudQuLed.classList.remove('active');
            ctudState.qu ? ctudQuCoil.classList.add('active') : ctudQuCoil.classList.remove('active');
            
            ctudState.qd ? ctudQdLed.classList.add('active') : ctudQdLed.classList.remove('active');
            ctudState.qd ? ctudQdCoil.classList.add('active') : ctudQdCoil.classList.remove('active');

            ctudState.cuInput ? ctudCuContact.classList.add('active') : ctudCuContact.classList.remove('active');
            ctudState.cdInput ? ctudCdContact.classList.add('active') : ctudCdContact.classList.remove('active');
        }
    }


    // --- Timing Diagrams (Canvas Rendering) ---
    const ctuCanvas = document.getElementById('ctu-timing-canvas');
    const ctuCtx = ctuCanvas ? ctuCanvas.getContext('2d') : null;
    const ctuHistory = { cu: [], r: [], cv: [], q: [] };
    
    const ctdCanvas = document.getElementById('ctd-timing-canvas');
    const ctdCtx = ctdCanvas ? ctdCanvas.getContext('2d') : null;
    const ctdHistory = { cd: [], ld: [], cv: [], q: [] };

    const ctudCanvas = document.getElementById('ctud-timing-canvas');
    const ctudCtx = ctudCanvas ? ctudCanvas.getContext('2d') : null;
    const ctudHistory = { cu: [], cd: [], r: [], ld: [], cv: [], qu: [], qd: [] };

    for(let i=0; i<historyLength; i++) {
        ctuHistory.cu.push(false); ctuHistory.r.push(false); ctuHistory.cv.push(0); ctuHistory.q.push(false);
        ctdHistory.cd.push(false); ctdHistory.ld.push(false); ctdHistory.cv.push(0); ctdHistory.q.push(true);
        ctudHistory.cu.push(false); ctudHistory.cd.push(false); ctudHistory.r.push(false); ctudHistory.ld.push(false); ctudHistory.cv.push(0); ctudHistory.qu.push(false); ctudHistory.qd.push(true);
    }

    let isCtuFrozen = false;
    const ctuFreezeBtn = document.getElementById('ctu-freeze-btn');
    if (ctuFreezeBtn) {
        ctuFreezeBtn.addEventListener('click', () => {
            isCtuFrozen = !isCtuFrozen;
            ctuFreezeBtn.innerHTML = isCtuFrozen ? '▶ Resume Graph' : '⏸ Freeze Graph';
            ctuFreezeBtn.style.background = isCtuFrozen ? 'rgba(239, 68, 68, 0.15)' : '';
            ctuFreezeBtn.style.borderColor = isCtuFrozen ? 'rgba(239, 68, 68, 0.4)' : '';
            ctuFreezeBtn.style.color = isCtuFrozen ? '#ef4444' : '';
        });
    }

    let isCtdFrozen = false;
    const ctdFreezeBtn = document.getElementById('ctd-freeze-btn');
    if (ctdFreezeBtn) {
        ctdFreezeBtn.addEventListener('click', () => {
            isCtdFrozen = !isCtdFrozen;
            ctdFreezeBtn.innerHTML = isCtdFrozen ? '▶ Resume Graph' : '⏸ Freeze Graph';
            ctdFreezeBtn.style.background = isCtdFrozen ? 'rgba(239, 68, 68, 0.15)' : '';
            ctdFreezeBtn.style.borderColor = isCtdFrozen ? 'rgba(239, 68, 68, 0.4)' : '';
            ctdFreezeBtn.style.color = isCtdFrozen ? '#ef4444' : '';
        });
    }

    let isCtudFrozen = false;
    const ctudFreezeBtn = document.getElementById('ctud-freeze-btn');
    if (ctudFreezeBtn) {
        ctudFreezeBtn.addEventListener('click', () => {
            isCtudFrozen = !isCtudFrozen;
            ctudFreezeBtn.innerHTML = isCtudFrozen ? '▶ Resume Graph' : '⏸ Freeze Graph';
            ctudFreezeBtn.style.background = isCtudFrozen ? 'rgba(239, 68, 68, 0.15)' : '';
            ctudFreezeBtn.style.borderColor = isCtudFrozen ? 'rgba(239, 68, 68, 0.4)' : '';
            ctudFreezeBtn.style.color = isCtudFrozen ? '#ef4444' : '';
        });
    }

    function drawChart(ctx, canvas, history, signals) {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const width = canvas.width;
        const height = canvas.height;
        const step = width / historyLength;
        const margin = 20;
        const signalHeight = (height - margin * 2) / signals.length;

        // Grid lines
        ctx.strokeStyle = 'rgba(42, 58, 78, 0.5)';
        ctx.lineWidth = 1;
        for(let i=0; i<width; i+=step*10) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        signals.forEach((sig, index) => {
            const yBase = margin + index * signalHeight + signalHeight - 10;
            const yTop = yBase - (signalHeight * 0.6);
            
            // Signal label
            ctx.fillStyle = '#7a8fa6';
            ctx.font = '12px "JetBrains Mono", monospace';
            ctx.fillText(sig.label, 5, yTop + 5);

            // Signal line
            ctx.strokeStyle = sig.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for(let i=0; i<historyLength; i++) {
                const x = i * step;
                const val = history[sig.key][i];
                let y;

                if (typeof val === 'boolean') {
                    y = val ? yTop : yBase;
                } else {
                    const maxVal = Math.max(10, Math.max(...history[sig.key]));
                    const minVal = Math.min(0, Math.min(...history[sig.key]));
                    const range = maxVal - minVal;
                    const normalized = range === 0 ? 0 : (val - minVal) / range;
                    y = yBase - (normalized * (signalHeight * 0.6));
                    
                    if (i === historyLength - 1) {
                        ctx.fillStyle = sig.color;
                        ctx.fillText(val, x - 15, y - 5);
                    }
                }

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    const prevVal = history[sig.key][i-1];
                    let prevY;
                    if (typeof prevVal === 'boolean') {
                        prevY = prevVal ? yTop : yBase;
                    } else {
                        const maxVal = Math.max(10, Math.max(...history[sig.key]));
                        const minVal = Math.min(0, Math.min(...history[sig.key]));
                        const range = maxVal - minVal;
                        const normalized = range === 0 ? 0 : (prevVal - minVal) / range;
                        prevY = yBase - (normalized * (signalHeight * 0.6));
                    }
                    ctx.lineTo(x, prevY);
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        });
    }

    function gameLoop() {
        if (!isCtuFrozen) {
            for (let key in ctuHistory) ctuHistory[key].shift();
            ctuHistory.cu.push(ctuState.cuInput); ctuHistory.r.push(ctuState.rInput); ctuHistory.cv.push(ctuState.cv); ctuHistory.q.push(ctuState.q);
        }
        if (!isCtdFrozen) {
            for (let key in ctdHistory) ctdHistory[key].shift();
            ctdHistory.cd.push(ctdState.cdInput); ctdHistory.ld.push(ctdState.ldInput); ctdHistory.cv.push(ctdState.cv); ctdHistory.q.push(ctdState.q);
        }
        if (!isCtudFrozen) {
            for (let key in ctudHistory) ctudHistory[key].shift();
            ctudHistory.cu.push(ctudState.cuInput); ctudHistory.cd.push(ctudState.cdInput); ctudHistory.r.push(ctudState.rInput); 
            ctudHistory.ld.push(ctudState.ldInput); ctudHistory.cv.push(ctudState.cv); ctudHistory.qu.push(ctudState.qu); ctudHistory.qd.push(ctudState.qd);
        }

        drawChart(ctuCtx, ctuCanvas, ctuHistory, [
            { key: 'cu', label: '%I0.0 (CU)', color: '#00b4d8' },
            { key: 'r', label: '%I0.1 (R)', color: '#ef4444' },
            { key: 'cv', label: '%MW12 (CV)', color: '#f59e0b' },
            { key: 'q', label: '%Q0.0 (Q)', color: '#22c55e' }
        ]);

        drawChart(ctdCtx, ctdCanvas, ctdHistory, [
            { key: 'cd', label: '%I0.2 (CD)', color: '#00b4d8' },
            { key: 'ld', label: '%I0.3 (LD)', color: '#f59e0b' },
            { key: 'cv', label: '%MW16 (CV)', color: '#a855f7' },
            { key: 'q', label: '%Q0.1 (Q)', color: '#22c55e' }
        ]);

        if(ctudCtx) {
            drawChart(ctudCtx, ctudCanvas, ctudHistory, [
                { key: 'cu', label: '%I0.4 (CU)', color: '#00b4d8' },
                { key: 'cd', label: '%I0.5 (CD)', color: '#3b82f6' },
                { key: 'r', label: '%I0.6 (R)', color: '#ef4444' },
                { key: 'ld', label: '%I0.7 (LD)', color: '#f59e0b' },
                { key: 'cv', label: '%MW20 (CV)', color: '#a855f7' },
                { key: 'qu', label: '%Q0.2 (QU)', color: '#22c55e' },
                { key: 'qd', label: '%Q0.3 (QD)', color: '#00d4aa' }
            ]);
        }

        requestAnimationFrame(gameLoop);
    }

    updateCtuLogic();
    updateCtdLogic();
    if(ctudPvInput) updateCtudLogic();
    
    gameLoop();
});
