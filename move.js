// MOVE Logic
const moveEnBtn = document.getElementById('move-en');
const moveIn = document.getElementById('move-in');
const moveOut = document.getElementById('move-out');
const ladderMoveEn = document.getElementById('ladder-move-en');

let moveState = { en: false, val: 0 };

moveEnBtn.addEventListener('click', () => {
    moveState.en = !moveState.en;
    moveEnBtn.textContent = moveState.en ? 'ON' : 'OFF';
    moveEnBtn.className = moveState.en ? 'momentary-btn active' : 'momentary-btn';
    ladderMoveEn.classList.toggle('active', moveState.en);
    updateMoveLogic();
});

moveIn.addEventListener('input', updateMoveLogic);

function updateMoveLogic() {
    if (moveState.en) {
        moveState.val = parseInt(moveIn.value) || 0;
        moveOut.textContent = moveState.val;
    } else {
        // Output holds its value when EN drops in a normal MOVE
    }
}

// Shift Logic
const shiftOp = document.getElementById('shift-op');
const shiftIn = document.getElementById('shift-in');
const shiftN = document.getElementById('shift-n');
const shiftInBin = document.getElementById('shift-in-bin');
const shiftOutBin = document.getElementById('shift-out-bin');
const shiftOutDec = document.getElementById('shift-out-dec');
const ladderShiftTitle = document.getElementById('ladder-shift-title');

function to16BitBinary(num) {
    let bin = (num >>> 0).toString(2);
    return bin.padStart(16, '0').slice(-16);
}

function updateShiftLogic() {
    const op = shiftOp.value;
    const inVal = parseInt(shiftIn.value) || 0;
    const n = parseInt(shiftN.value) || 0;
    
    ladderShiftTitle.textContent = op;

    let outVal = 0;
    if (op === 'SHL') {
        outVal = (inVal << n) & 0xFFFF; // 16-bit clamp
    } else {
        outVal = (inVal >>> n) & 0xFFFF; // Logical shift right
    }

    shiftInBin.textContent = to16BitBinary(inVal);
    shiftOutBin.textContent = to16BitBinary(outVal);
    shiftOutDec.textContent = outVal;
}

shiftOp.addEventListener('change', updateShiftLogic);
shiftIn.addEventListener('input', updateShiftLogic);
shiftN.addEventListener('input', updateShiftLogic);

updateMoveLogic();
updateShiftLogic();
