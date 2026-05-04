// SR / RS Flip Flop Logic
const srSetBtn = document.getElementById('sr-set');
const srResetBtn = document.getElementById('sr-reset');
const srLed = document.getElementById('sr-led');
const rsLed = document.getElementById('rs-led');

const ladSrS = document.getElementById('ladder-sr-s');
const ladSrR = document.getElementById('ladder-sr-r');
const ladSrCoil = document.getElementById('ladder-sr-coil');

const ladRsS = document.getElementById('ladder-rs-s');
const ladRsR = document.getElementById('ladder-rs-r');
const ladRsCoil = document.getElementById('ladder-rs-coil');

let s = false;
let r = false;

let srOut = false;
let rsOut = false;

function updateSR(setVal, resetVal) {
    if (setVal !== null) s = setVal;
    if (resetVal !== null) r = resetVal;

    // SR priority is Reset
    if (r) {
        srOut = false;
    } else if (s) {
        srOut = true;
    }

    // RS priority is Set
    if (s) {
        rsOut = true;
    } else if (r) {
        rsOut = false;
    }

    // Update UI
    srLed.classList.toggle('active', srOut);
    rsLed.classList.toggle('active', rsOut);

    ladSrS.classList.toggle('active', s);
    ladSrR.classList.toggle('active', r);
    ladSrCoil.classList.toggle('active', srOut);

    ladRsS.classList.toggle('active', s);
    ladRsR.classList.toggle('active', r);
    ladRsCoil.classList.toggle('active', rsOut);
}

// Edge Detection Logic
const edgeTrigger = document.getElementById('edge-trigger');
const clockLed = document.getElementById('clock-led');
const pTrigCountDisplay = document.getElementById('ptrig-count');
const nTrigCountDisplay = document.getElementById('ntrig-count');

const ladEdgeIn = document.getElementById('ladder-edge-in');
const ladEdgeInN = document.getElementById('ladder-edge-in-n');
const ladPtrig = document.getElementById('ladder-ptrig');
const ladNtrig = document.getElementById('ladder-ntrig');

let edgeState = false;
let prevEdgeState = false;
let pCount = 0;
let nCount = 0;

function updateEdge(val) {
    prevEdgeState = edgeState;
    edgeState = val;

    let pPulse = false;
    let nPulse = false;

    if (edgeState && !prevEdgeState) {
        pCount++;
        pTrigCountDisplay.textContent = pCount;
        pPulse = true;
    }

    if (!edgeState && prevEdgeState) {
        nCount++;
        nTrigCountDisplay.textContent = nCount;
        nPulse = true;
    }

    // Clock LED
    clockLed.classList.toggle('active', edgeState);

    // Ladder Visuals
    ladEdgeIn.classList.toggle('active', edgeState);
    ladEdgeInN.classList.toggle('active', edgeState);
    
    // Briefly highlight the pulse
    if (pPulse) {
        ladPtrig.classList.add('active');
        setTimeout(() => ladPtrig.classList.remove('active'), 200);
    }
    if (nPulse) {
        ladNtrig.classList.add('active');
        setTimeout(() => ladNtrig.classList.remove('active'), 200);
    }
}

// Auto 1Hz clock
setInterval(() => {
    // Only if user isn't holding the manual trigger
    if (!edgeTrigger.classList.contains('active')) {
        updateEdge(!edgeState);
    }
}, 1000);
