// Data Operations Simulation Logic
// Math and Compare blocks

// Graphing Constants
const CHART_HISTORY = 100;
const CHART_SPEED = 2; // points per frame

class AnalogChart {
    constructor(canvasId, linesConfig, yMin = -100, yMax = 100) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.history = [];
        this.linesConfig = linesConfig; // Array of objects: { id: 'in1', color: '#ff0055', isDigital: false }
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
                    // Analog mapping
                    const range = this.yMax - this.yMin;
                    const normalized = (val - this.yMin) / range;
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
        ctx.fillText("0", 5, height / 2 + 4);

        // Draw Legends
        let legendX = 30;
        this.linesConfig.forEach(lineCfg => {
            ctx.fillStyle = lineCfg.color;
            ctx.fillRect(legendX, 5, 10, 10);
            ctx.fillStyle = '#ccc';
            ctx.fillText(lineCfg.id.toUpperCase(), legendX + 15, 14);
            legendX += 60;
        });
    }
}

// --- Math Module ---
const mathOpSelect = document.getElementById('math-op');
const mathIn1 = document.getElementById('math-in1');
const mathIn2 = document.getElementById('math-in2');
const mathIn1Val = document.getElementById('math-in1-val');
const mathIn2Val = document.getElementById('math-in2-val');
const mathOut = document.getElementById('math-out');
const mathEquation = document.getElementById('math-equation');

const mathChart = new AnalogChart('math-canvas', [
    { id: 'in1', color: '#00ffcc', isDigital: false },
    { id: 'in2', color: '#ff00aa', isDigital: false },
    { id: 'out', color: '#ffcc00', isDigital: false }
], -200, 200);

let mathState = { in1: 0, in2: 0, out: 0, op: 'ADD' };

function updateMathLogic() {
    mathState.op = mathOpSelect.value;
    
    // Update the ladder block title dynamically
    const ladderMathTitle = document.getElementById('ladder-math-title');
    if (ladderMathTitle) ladderMathTitle.textContent = mathState.op;

    mathState.in1 = parseFloat(mathIn1.value);
    mathState.in2 = parseFloat(mathIn2.value);
    
    mathIn1Val.textContent = mathState.in1;
    mathIn2Val.textContent = mathState.in2;

    switch(mathState.op) {
        case 'ADD': mathState.out = mathState.in1 + mathState.in2; break;
        case 'SUB': mathState.out = mathState.in1 - mathState.in2; break;
        case 'MUL': mathState.out = mathState.in1 * mathState.in2; break;
        case 'DIV': 
            mathState.out = mathState.in2 !== 0 ? (mathState.in1 / mathState.in2).toFixed(2) : 'ERR (Div/0)';
            break;
    }

    if (mathState.out !== 'ERR (Div/0)') {
        // limit logic just for graphing scale
        let outVal = parseFloat(mathState.out);
        mathOut.textContent = outVal;
        
        let opSymbol = '+';
        if(mathState.op === 'SUB') opSymbol = '-';
        if(mathState.op === 'MUL') opSymbol = '*';
        if(mathState.op === 'DIV') opSymbol = '/';
        
        mathEquation.textContent = `${mathState.in1} ${opSymbol} ${mathState.in2} = ${outVal}`;
        
        mathChart.addData({
            in1: mathState.in1,
            in2: mathState.in2,
            out: outVal
        });
    } else {
        mathOut.textContent = mathState.out;
        mathEquation.textContent = `${mathState.in1} / 0 = ERR`;
        mathChart.addData({
            in1: mathState.in1,
            in2: mathState.in2,
            out: 0
        });
    }
}


// --- Comparator Module ---
const cmpIn = document.getElementById('cmp-in');
const cmpThresh = document.getElementById('cmp-thresh');
const cmpMin = document.getElementById('cmp-min');
const cmpMax = document.getElementById('cmp-max');
const cmpInVal = document.getElementById('cmp-in-val');
const cmpThreshVal = document.getElementById('cmp-thresh-val');
const cmpLed = document.getElementById('cmp-led');
const rangeLed = document.getElementById('range-led');

const cmpChart = new AnalogChart('cmp-canvas', [
    { id: 'in', color: '#00aaff', isDigital: false },
    { id: 'thresh', color: '#555555', isDigital: false },
    { id: 'cmpOut', color: '#ffcc00', isDigital: true },
    { id: 'rangeOut', color: '#00ffcc', isDigital: true }
], 0, 100);

let cmpState = { in: 0, thresh: 50, min: 20, max: 80, cmpOut: false, rangeOut: false };

function updateCmpLogic() {
    cmpState.in = parseFloat(cmpIn.value);
    cmpState.thresh = parseFloat(cmpThresh.value);
    cmpState.min = parseFloat(cmpMin.value) || 0;
    cmpState.max = parseFloat(cmpMax.value) || 100;

    cmpInVal.textContent = cmpState.in;
    cmpThreshVal.textContent = cmpState.thresh;

    // Logic
    cmpState.cmpOut = cmpState.in >= cmpState.thresh;
    cmpState.rangeOut = (cmpState.in >= cmpState.min && cmpState.in <= cmpState.max);

    // Update UI
    cmpLed.classList.toggle('active', cmpState.cmpOut);
    rangeLed.classList.toggle('active', cmpState.rangeOut);

    cmpChart.addData({
        in: cmpState.in,
        thresh: cmpState.thresh,
        cmpOut: cmpState.cmpOut,
        rangeOut: cmpState.rangeOut
    });
}


// Animation Loop
let frameCount = 0;
function animate() {
    frameCount++;
    if (frameCount % CHART_SPEED === 0) {
        updateMathLogic();
        mathChart.draw();
        
        updateCmpLogic();
        cmpChart.draw();
    }
    requestAnimationFrame(animate);
}

// Start simulation
animate();
