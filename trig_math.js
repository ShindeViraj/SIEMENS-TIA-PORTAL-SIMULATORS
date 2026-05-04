document.addEventListener('DOMContentLoaded', () => {
    // --- SIN & ASIN ---
    const sinInSlider = document.getElementById('sin-in');
    const sinInVal = document.getElementById('sin-in-val');
    const asinInSlider = document.getElementById('asin-in');
    const asinInVal = document.getElementById('asin-in-val');
    
    const sinOutDisplay = document.getElementById('sin-out');
    const asinOutDisplay = document.getElementById('asin-out');

    function updateSin() {
        const inVal = parseFloat(sinInSlider.value);
        sinInVal.textContent = inVal.toFixed(2);
        
        const outVal = Math.sin(inVal);
        sinOutDisplay.textContent = outVal.toFixed(3);
    }

    function updateAsin() {
        const inVal = parseFloat(asinInSlider.value);
        asinInVal.textContent = inVal.toFixed(2);
        
        if (inVal < -1.0 || inVal > 1.0) {
            asinOutDisplay.textContent = 'NaN';
            asinOutDisplay.style.color = '#ff4444'; // Error color
        } else {
            const outVal = Math.asin(inVal);
            asinOutDisplay.textContent = outVal.toFixed(3);
            asinOutDisplay.style.color = '#ff00aa'; // Valid color
        }
    }

    sinInSlider.addEventListener('input', updateSin);
    asinInSlider.addEventListener('input', updateAsin);


    // --- COS & ACOS ---
    const cosInSlider = document.getElementById('cos-in');
    const cosInVal = document.getElementById('cos-in-val');
    const acosInSlider = document.getElementById('acos-in');
    const acosInVal = document.getElementById('acos-in-val');
    
    const cosOutDisplay = document.getElementById('cos-out');
    const acosOutDisplay = document.getElementById('acos-out');

    function updateCos() {
        const inVal = parseFloat(cosInSlider.value);
        cosInVal.textContent = inVal.toFixed(2);
        
        const outVal = Math.cos(inVal);
        cosOutDisplay.textContent = outVal.toFixed(3);
    }

    function updateAcos() {
        const inVal = parseFloat(acosInSlider.value);
        acosInVal.textContent = inVal.toFixed(2);
        
        if (inVal < -1.0 || inVal > 1.0) {
            acosOutDisplay.textContent = 'NaN';
            acosOutDisplay.style.color = '#ff4444'; // Error color
        } else {
            const outVal = Math.acos(inVal);
            acosOutDisplay.textContent = outVal.toFixed(3);
            acosOutDisplay.style.color = '#ff00aa'; // Valid color
        }
    }

    cosInSlider.addEventListener('input', updateCos);
    acosInSlider.addEventListener('input', updateAcos);


    // --- TAN & ATAN ---
    const tanInSlider = document.getElementById('tan-in');
    const tanInVal = document.getElementById('tan-in-val');
    const atanInSlider = document.getElementById('atan-in');
    const atanInVal = document.getElementById('atan-in-val');
    
    const tanOutDisplay = document.getElementById('tan-out');
    const atanOutDisplay = document.getElementById('atan-out');

    function updateTan() {
        const inVal = parseFloat(tanInSlider.value);
        tanInVal.textContent = inVal.toFixed(2);
        
        const outVal = Math.tan(inVal);
        tanOutDisplay.textContent = outVal.toFixed(3);
    }

    function updateAtan() {
        const inVal = parseFloat(atanInSlider.value);
        atanInVal.textContent = inVal.toFixed(2);
        
        const outVal = Math.atan(inVal);
        atanOutDisplay.textContent = outVal.toFixed(3);
    }

    tanInSlider.addEventListener('input', updateTan);
    atanInSlider.addEventListener('input', updateAtan);

    // Initial updates
    updateSin();
    updateAsin();
    updateCos();
    updateAcos();
    updateTan();
    updateAtan();
});
