// INC/DEC Logic
let incDecVal = 0;
const incDecDisplay = document.getElementById('incdec-val');
const ladInc = document.getElementById('ladder-inc-contact');
const ladDec = document.getElementById('ladder-dec-contact');

function triggerIncDec(op) {
    if (op === 'INC') {
        incDecVal++;
        ladInc.classList.add('active');
        setTimeout(() => ladInc.classList.remove('active'), 200);
    } else if (op === 'DEC') {
        incDecVal--;
        ladDec.classList.add('active');
        setTimeout(() => ladDec.classList.remove('active'), 200);
    }
    incDecDisplay.textContent = incDecVal;
}

// LIMIT Logic
const limitMinSlider = document.getElementById('limit-min');
const limitMaxSlider = document.getElementById('limit-max');
const limitInSlider = document.getElementById('limit-in');
const limitMinValDisplay = document.getElementById('limit-min-val');
const limitMaxValDisplay = document.getElementById('limit-max-val');
const limitInValDisplay = document.getElementById('limit-in-val');
const limitOutDisplay = document.getElementById('limit-out');

function updateLimit() {
    let min = parseInt(limitMinSlider.value);
    let max = parseInt(limitMaxSlider.value);
    let inVal = parseInt(limitInSlider.value);

    // Ensure logic handles min > max without breaking completely
    let actualMin = Math.min(min, max);
    let actualMax = Math.max(min, max);

    limitMinValDisplay.textContent = min;
    limitMaxValDisplay.textContent = max;
    limitInValDisplay.textContent = inVal;

    let outVal = inVal;
    if (inVal < actualMin) outVal = actualMin;
    if (inVal > actualMax) outVal = actualMax;

    limitOutDisplay.textContent = outVal;
}

limitMinSlider.addEventListener('input', updateLimit);
limitMaxSlider.addEventListener('input', updateLimit);
limitInSlider.addEventListener('input', updateLimit);
updateLimit();

// MIN/MAX Logic
const minmaxOp = document.getElementById('minmax-op');
const minmaxIn1Slider = document.getElementById('minmax-in1');
const minmaxIn2Slider = document.getElementById('minmax-in2');
const minmaxIn1Display = document.getElementById('minmax-in1-val');
const minmaxIn2Display = document.getElementById('minmax-in2-val');
const minmaxOutDisplay = document.getElementById('minmax-out');
const ladMinMaxTitle = document.getElementById('ladder-minmax-title');

function updateMinMax() {
    let in1 = parseInt(minmaxIn1Slider.value);
    let in2 = parseInt(minmaxIn2Slider.value);
    let op = minmaxOp.value;

    minmaxIn1Display.textContent = in1;
    minmaxIn2Display.textContent = in2;

    let outVal = 0;
    if (op === 'MIN') {
        outVal = Math.min(in1, in2);
    } else {
        outVal = Math.max(in1, in2);
    }

    minmaxOutDisplay.textContent = outVal;
    ladMinMaxTitle.textContent = op;
}

minmaxOp.addEventListener('change', updateMinMax);
minmaxIn1Slider.addEventListener('input', updateMinMax);
minmaxIn2Slider.addEventListener('input', updateMinMax);
updateMinMax();
