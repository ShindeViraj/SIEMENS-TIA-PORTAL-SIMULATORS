// Analog Scaling Logic
// NORM_X and SCALE_X blocks

const CHART_HISTORY = 100;
const CHART_SPEED = 2;

class AnalogChart {
    constructor(canvasId, linesConfig, yMin = 0, yMax = 150) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.history = [];
        this.linesConfig = linesConfig;
        this.yMin = yMin;
        this.yMax = yMax;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth - 40;
        this.canvas.height = 200;
    }

    addData(dataObj) {
        this.history.push(dataObj);
        if (this.history.length > CHART_HISTORY) {
            this.history.shift();
        }
    }

    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, width, height);

        // Grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= 4; i++) {
            const y = height * (i / 4);
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();

        if (this.history.length < 2) return;

        const stepX = width / (CHART_HISTORY - 1);

        this.linesConfig.forEach(lineCfg => {
            ctx.strokeStyle = lineCfg.color;
            ctx.lineWidth = lineCfg.isDigital ? 2 : 3;
            ctx.beginPath();

            for (let i = 0; i < this.history.length; i++) {
                const x = i * stepX;
                const val = this.history[i][lineCfg.id];
                
                let y;
                if (lineCfg.isDigital) {
                    y = val ? height * 0.1 : height * 0.9;
                } else {
                    const range = this.yMax - this.yMin;
                    let normalized = (val - this.yMin) / range;
                    // Clamp for visual bounds
                    if(normalized > 1) normalized = 1;
                    if(normalized < 0) normalized = 0;
                    y = height - (normalized * height);
                }

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });

        // Draw Labels & Legends
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = '#888';
        ctx.fillText(this.yMax.toString(), 5, 12);
        ctx.fillText(this.yMin.toString(), 5, height - 5);
        ctx.fillText(((this.yMax + this.yMin) / 2).toString(), 5, height / 2 + 4);

        let legendX = 30;
        this.linesConfig.forEach(lineCfg => {
            ctx.fillStyle = lineCfg.color;
            ctx.fillRect(legendX, 5, 10, 10);
            ctx.fillStyle = '#ccc';
            ctx.fillText(lineCfg.id.toUpperCase(), legendX + 15, 14);
            legendX += 80;
        });
    }
}

// --- Scaling Module ---
const rawInput = document.getElementById('raw-input');
const rawValDisplay = document.getElementById('raw-val');

const normMinInput = document.getElementById('norm-min');
const normMaxInput = document.getElementById('norm-max');
const scaleMinInput = document.getElementById('scale-min');
const scaleMaxInput = document.getElementById('scale-max');

const normOutDisplay = document.getElementById('norm-out');
const scaleOutDisplay = document.getElementById('scale-out');
const gaugeFill = document.getElementById('gauge-fill');

const scaleChart = new AnalogChart('scale-canvas', [
    { id: 'scaled_output', color: '#00ffcc', isDigital: false },
    { id: 'raw_percent', color: '#ff00aa', isDigital: false }
], 0, 150); // initial limits

let scaleState = { 
    raw: 0, 
    normMin: 0, 
    normMax: 27648,
    scaleMin: 0,
    scaleMax: 150,
    normOut: 0,
    scaleOut: 0
};

function updateScaleLogic() {
    scaleState.raw = parseFloat(rawInput.value);
    scaleState.normMin = parseFloat(normMinInput.value) || 0;
    scaleState.normMax = parseFloat(normMaxInput.value) || 1;
    scaleState.scaleMin = parseFloat(scaleMinInput.value) || 0;
    scaleState.scaleMax = parseFloat(scaleMaxInput.value) || 1;

    rawValDisplay.textContent = scaleState.raw;

    // NORM_X Math
    let normRange = scaleState.normMax - scaleState.normMin;
    if (normRange === 0) normRange = 1; // prevent div/0
    
    scaleState.normOut = (scaleState.raw - scaleState.normMin) / normRange;
    
    // Clamp to 0-1 as standard behavior for some NORM_X implementations
    if (scaleState.normOut > 1.0) scaleState.normOut = 1.0;
    if (scaleState.normOut < 0.0) scaleState.normOut = 0.0;

    // SCALE_X Math
    let scaleRange = scaleState.scaleMax - scaleState.scaleMin;
    scaleState.scaleOut = (scaleState.normOut * scaleRange) + scaleState.scaleMin;

    // Update UI
    normOutDisplay.textContent = scaleState.normOut.toFixed(4);
    scaleOutDisplay.textContent = scaleState.scaleOut.toFixed(2);
    
    // Gauge visual
    gaugeFill.style.height = `${(scaleState.normOut * 100).toFixed(1)}%`;

    // Dynamic graph bounds
    scaleChart.yMin = scaleState.scaleMin;
    scaleChart.yMax = scaleState.scaleMax;

    // For graphing 'raw_percent', we just scale it to match the graph's visual range
    let rawPercentScaled = (scaleState.raw / 27648) * scaleRange + scaleState.scaleMin;

    scaleChart.addData({
        scaled_output: scaleState.scaleOut,
        raw_percent: rawPercentScaled
    });
}

// Animation Loop
let frameCount = 0;
function animate() {
    frameCount++;
    if (frameCount % CHART_SPEED === 0) {
        updateScaleLogic();
        scaleChart.draw();
    }
    requestAnimationFrame(animate);
}

// Start simulation
animate();
