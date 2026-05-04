document.addEventListener('DOMContentLoaded', () => {
    
    const historyLength = 200;
    let lastTime = performance.now();

    // Utility for toggle buttons
    function setupToggleBtn(btn, stateObj, key, callback) {
        if(!btn) return;
        btn.addEventListener('click', () => {
            stateObj[key] = !stateObj[key];
            btn.style.background = stateObj[key] ? 'rgba(34, 197, 94, 0.15)' : '';
            btn.style.borderColor = stateObj[key] ? 'rgba(34, 197, 94, 0.4)' : '';
            btn.style.color = stateObj[key] ? '#22c55e' : '';
            if(callback) callback();
        });
    }

    function setupMomentaryBtn(btn, stateObj, key, callback) {
        if(!btn) return;
        btn.addEventListener('mousedown', () => { stateObj[key] = true; if(callback) callback(); });
        btn.addEventListener('mouseup', () => { stateObj[key] = false; if(callback) callback(); });
        btn.addEventListener('mouseleave', () => { stateObj[key] = false; if(callback) callback(); });
    }

    // --- TP (Pulse Timer) Logic ---
    const tpState = { in: false, lastIn: false, q: false, et: 0, pt: 3000, active: false };
    const tpPtInput = document.getElementById('tp-pt');
    const tpInBtn = document.getElementById('tp-in-btn');
    const tpEtDisplay = document.getElementById('tp-et-display');
    const tpQLed = document.getElementById('tp-q-led');
    const tpInContact = document.getElementById('tp-in-contact');
    const tpQCoil = document.getElementById('tp-q-coil');
    const tpPtOnline = document.getElementById('tp-pt-online');
    const tpEtOnline = document.getElementById('tp-et-online');

    if(tpPtInput) tpPtInput.addEventListener('change', (e) => { tpState.pt = parseInt(e.target.value) || 1000; });
    setupToggleBtn(tpInBtn, tpState, 'in');

    function updateTP(dt) {
        // TP Logic: generate pulse on rising edge
        if (tpState.in && !tpState.lastIn && !tpState.active && tpState.et === 0) {
            tpState.active = true;
            tpState.q = true;
            tpState.et = 0;
        }

        if (tpState.active) {
            tpState.et += dt;
            if (tpState.et >= tpState.pt) {
                tpState.et = tpState.pt;
                tpState.q = false;
                tpState.active = false;
            }
        } else if (!tpState.in && !tpState.active) {
            tpState.et = 0;
            tpState.q = false;
        }

        tpState.lastIn = tpState.in;

        // UI Updates
        tpEtDisplay.textContent = Math.floor(tpState.et) + " ms";
        tpPtOnline.textContent = "T#" + tpState.pt + "ms";
        tpEtOnline.textContent = "T#" + Math.floor(tpState.et) + "ms";

        tpState.q ? tpQLed.classList.add('active') : tpQLed.classList.remove('active');
        tpState.q ? tpQCoil.classList.add('active') : tpQCoil.classList.remove('active');
        tpState.in ? tpInContact.classList.add('active') : tpInContact.classList.remove('active');
    }

    // --- TON (On-Delay Timer) Logic ---
    const tonState = { in: false, q: false, et: 0, pt: 3000 };
    const tonPtInput = document.getElementById('ton-pt');
    const tonInBtn = document.getElementById('ton-in-btn');
    const tonEtDisplay = document.getElementById('ton-et-display');
    const tonQLed = document.getElementById('ton-q-led');
    const tonInContact = document.getElementById('ton-in-contact');
    const tonQCoil = document.getElementById('ton-q-coil');
    const tonPtOnline = document.getElementById('ton-pt-online');
    const tonEtOnline = document.getElementById('ton-et-online');

    if(tonPtInput) tonPtInput.addEventListener('change', (e) => { tonState.pt = parseInt(e.target.value) || 1000; });
    setupToggleBtn(tonInBtn, tonState, 'in');

    function updateTON(dt) {
        if (tonState.in) {
            if (tonState.et < tonState.pt) {
                tonState.et += dt;
            }
            if (tonState.et >= tonState.pt) {
                tonState.et = tonState.pt;
                tonState.q = true;
            }
        } else {
            tonState.et = 0;
            tonState.q = false;
        }

        tonEtDisplay.textContent = Math.floor(tonState.et) + " ms";
        tonPtOnline.textContent = "T#" + tonState.pt + "ms";
        tonEtOnline.textContent = "T#" + Math.floor(tonState.et) + "ms";

        tonState.q ? tonQLed.classList.add('active') : tonQLed.classList.remove('active');
        tonState.q ? tonQCoil.classList.add('active') : tonQCoil.classList.remove('active');
        tonState.in ? tonInContact.classList.add('active') : tonInContact.classList.remove('active');
    }
    // --- TOF (Off-Delay Timer) Logic ---
    const tofState = { in: false, q: false, et: 0, pt: 3000 };
    const tofPtInput = document.getElementById('tof-pt');
    const tofInBtn = document.getElementById('tof-in-btn');
    const tofEtDisplay = document.getElementById('tof-et-display');
    const tofQLed = document.getElementById('tof-q-led');
    const tofInContact = document.getElementById('tof-in-contact');
    const tofQCoil = document.getElementById('tof-q-coil');
    const tofPtOnline = document.getElementById('tof-pt-online');
    const tofEtOnline = document.getElementById('tof-et-online');

    if(tofPtInput) tofPtInput.addEventListener('change', (e) => { tofState.pt = parseInt(e.target.value) || 1000; });
    setupToggleBtn(tofInBtn, tofState, 'in');

    function updateTOF(dt) {
        if (tofState.in) {
            tofState.et = 0;
            tofState.q = true;
        } else {
            if (tofState.q) {
                if (tofState.et < tofState.pt) {
                    tofState.et += dt;
                }
                if (tofState.et >= tofState.pt) {
                    tofState.et = tofState.pt;
                    tofState.q = false;
                }
            }
        }

        tofEtDisplay.textContent = Math.floor(tofState.et) + " ms";
        tofPtOnline.textContent = "T#" + tofState.pt + "ms";
        tofEtOnline.textContent = "T#" + Math.floor(tofState.et) + "ms";

        tofState.q ? tofQLed.classList.add('active') : tofQLed.classList.remove('active');
        tofState.q ? tofQCoil.classList.add('active') : tofQCoil.classList.remove('active');
        tofState.in ? tofInContact.classList.add('active') : tofInContact.classList.remove('active');
    }

    // --- TONR (Accumulator Timer) Logic ---
    const tonrState = { in: false, r: false, q: false, et: 0, pt: 3000 };
    const tonrPtInput = document.getElementById('tonr-pt');
    const tonrInBtn = document.getElementById('tonr-in-btn');
    const tonrRBtn = document.getElementById('tonr-r-btn');
    const tonrEtDisplay = document.getElementById('tonr-et-display');
    const tonrQLed = document.getElementById('tonr-q-led');
    const tonrInContact = document.getElementById('tonr-in-contact');
    const tonrRContact = document.getElementById('tonr-r-contact');
    const tonrQCoil = document.getElementById('tonr-q-coil');
    const tonrPtOnline = document.getElementById('tonr-pt-online');
    const tonrEtOnline = document.getElementById('tonr-et-online');

    if(tonrPtInput) tonrPtInput.addEventListener('change', (e) => { tonrState.pt = parseInt(e.target.value) || 1000; });
    setupToggleBtn(tonrInBtn, tonrState, 'in');
    setupMomentaryBtn(tonrRBtn, tonrState, 'r');

    function updateTONR(dt) {
        if (tonrState.r) {
            tonrState.et = 0;
            tonrState.q = false;
        } else if (tonrState.in) {
            if (tonrState.et < tonrState.pt) {
                tonrState.et += dt;
            }
            if (tonrState.et >= tonrState.pt) {
                tonrState.et = tonrState.pt;
                tonrState.q = true;
            }
        }

        tonrEtDisplay.textContent = Math.floor(tonrState.et) + " ms";
        tonrPtOnline.textContent = "T#" + tonrState.pt + "ms";
        tonrEtOnline.textContent = "T#" + Math.floor(tonrState.et) + "ms";

        tonrState.q ? tonrQLed.classList.add('active') : tonrQLed.classList.remove('active');
        tonrState.q ? tonrQCoil.classList.add('active') : tonrQCoil.classList.remove('active');
        tonrState.in ? tonrInContact.classList.add('active') : tonrInContact.classList.remove('active');
        tonrState.r ? tonrRContact.classList.add('active') : tonrRContact.classList.remove('active');
    }

    // --- Timing Diagrams ---
    function setupCanvasAndHistory(idPrefix, signalKeys, initialVals) {
        const canvas = document.getElementById(idPrefix + '-timing-canvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        const history = {};
        signalKeys.forEach(k => history[k] = []);
        for(let i=0; i<historyLength; i++) {
            signalKeys.forEach((k, idx) => history[k].push(initialVals[idx]));
        }
        
        let isFrozen = false;
        const freezeBtn = document.getElementById(idPrefix + '-freeze-btn');
        if (freezeBtn) {
            freezeBtn.addEventListener('click', () => {
                isFrozen = !isFrozen;
                freezeBtn.innerHTML = isFrozen ? '▶ Resume Graph' : '⏸ Freeze Graph';
                freezeBtn.style.background = isFrozen ? 'rgba(239, 68, 68, 0.15)' : '';
                freezeBtn.style.borderColor = isFrozen ? 'rgba(239, 68, 68, 0.4)' : '';
                freezeBtn.style.color = isFrozen ? '#ef4444' : '';
            });
        }
        return { canvas, ctx, history, getFrozen: () => isFrozen };
    }

    const tpGraph = setupCanvasAndHistory('tp', ['in', 'q', 'et'], [false, false, 0]);
    const tonGraph = setupCanvasAndHistory('ton', ['in', 'q', 'et'], [false, false, 0]);
    const tofGraph = setupCanvasAndHistory('tof', ['in', 'q', 'et'], [false, false, 0]);
    const tonrGraph = setupCanvasAndHistory('tonr', ['in', 'r', 'q', 'et'], [false, false, false, 0]);

    function drawChart(ctx, canvas, history, signals) {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const width = canvas.width;
        const height = canvas.height;
        const step = width / historyLength;
        const margin = 20;
        const signalHeight = (height - margin * 2) / signals.length;

        // Grid
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
            
            ctx.fillStyle = '#7a8fa6';
            ctx.font = '12px "JetBrains Mono", monospace';
            ctx.fillText(sig.label, 5, yTop + 5);

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
                    const maxVal = sig.maxVal || 10000; 
                    const minVal = 0;
                    const range = maxVal - minVal;
                    const normalized = range === 0 ? 0 : (val - minVal) / range;
                    y = yBase - (normalized * (signalHeight * 0.6));
                    
                    if (i === historyLength - 1) {
                        ctx.fillStyle = sig.color;
                        ctx.fillText(Math.floor(val), x - 25, y - 5);
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
                        const maxVal = sig.maxVal || 10000;
                        const minVal = 0;
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

    function gameLoop(timestamp) {
        const dt = timestamp - lastTime;
        lastTime = timestamp;

        // Ensure dt is reasonable (e.g. if tab was inactive)
        const safeDt = dt > 100 ? 16 : dt;

        updateTP(safeDt);
        updateTON(safeDt);
        updateTOF(safeDt);
        updateTONR(safeDt);

        if (!tpGraph.getFrozen()) {
            for (let key in tpGraph.history) tpGraph.history[key].shift();
            tpGraph.history.in.push(tpState.in);
            tpGraph.history.q.push(tpState.q);
            tpGraph.history.et.push(tpState.et);
        }

        if (!tonGraph.getFrozen()) {
            for (let key in tonGraph.history) tonGraph.history[key].shift();
            tonGraph.history.in.push(tonState.in);
            tonGraph.history.q.push(tonState.q);
            tonGraph.history.et.push(tonState.et);
        }

        if (!tofGraph.getFrozen()) {
            for (let key in tofGraph.history) tofGraph.history[key].shift();
            tofGraph.history.in.push(tofState.in);
            tofGraph.history.q.push(tofState.q);
            tofGraph.history.et.push(tofState.et);
        }

        if (!tonrGraph.getFrozen()) {
            for (let key in tonrGraph.history) tonrGraph.history[key].shift();
            tonrGraph.history.in.push(tonrState.in);
            tonrGraph.history.r.push(tonrState.r);
            tonrGraph.history.q.push(tonrState.q);
            tonrGraph.history.et.push(tonrState.et);
        }

        drawChart(tpGraph.ctx, tpGraph.canvas, tpGraph.history, [
            { key: 'in', label: '%I0.0 (IN)', color: '#00b4d8' },
            { key: 'et', label: '%MD10 (ET)', color: '#f59e0b', maxVal: tpState.pt },
            { key: 'q', label: '%Q0.0 (Q)', color: '#22c55e' }
        ]);

        drawChart(tonGraph.ctx, tonGraph.canvas, tonGraph.history, [
            { key: 'in', label: '%I0.1 (IN)', color: '#00b4d8' },
            { key: 'et', label: '%MD14 (ET)', color: '#f59e0b', maxVal: tonState.pt },
            { key: 'q', label: '%Q0.1 (Q)', color: '#22c55e' }
        ]);

        drawChart(tofGraph.ctx, tofGraph.canvas, tofGraph.history, [
            { key: 'in', label: '%I0.2 (IN)', color: '#00b4d8' },
            { key: 'et', label: '%MD18 (ET)', color: '#f59e0b', maxVal: tofState.pt },
            { key: 'q', label: '%Q0.2 (Q)', color: '#22c55e' }
        ]);

        drawChart(tonrGraph.ctx, tonrGraph.canvas, tonrGraph.history, [
            { key: 'in', label: '%I0.3 (IN)', color: '#00b4d8' },
            { key: 'r', label: '%I0.4 (R)', color: '#ef4444' },
            { key: 'et', label: '%MD22 (ET)', color: '#f59e0b', maxVal: tonrState.pt },
            { key: 'q', label: '%Q0.3 (Q)', color: '#22c55e' }
        ]);

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
});
