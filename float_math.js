document.addEventListener('DOMContentLoaded', () => {
    // --- SQR & SQRT ---
    const sqrSqrtInSlider = document.getElementById('sqr-sqrt-in');
    const sqrSqrtInVal = document.getElementById('sqr-sqrt-in-val');
    const sqrOutDisplay = document.getElementById('sqr-out');
    const sqrtOutDisplay = document.getElementById('sqrt-out');

    function updateSqrSqrt() {
        const inVal = parseFloat(sqrSqrtInSlider.value);
        
        sqrSqrtInVal.textContent = inVal.toFixed(1);
        
        // SQR calculation
        const sqrOut = Math.pow(inVal, 2);
        sqrOutDisplay.textContent = Math.round(sqrOut * 100) / 100;
        sqrOutDisplay.style.color = '#ffaa00'; // Default valid color
        
        // SQRT calculation
        if (inVal < 0) {
            // Siemens behavior: returns NaN when negative
            sqrtOutDisplay.textContent = 'NaN';
            sqrtOutDisplay.style.color = '#ff4444'; // Error color
        } else {
            const sqrtOut = Math.sqrt(inVal);
            sqrtOutDisplay.textContent = Math.round(sqrtOut * 1000) / 1000;
            sqrtOutDisplay.style.color = '#ff00aa'; // Valid color
        }
    }

    sqrSqrtInSlider.addEventListener('input', updateSqrSqrt);


    // --- LN & EXP ---
    const lnExpInSlider = document.getElementById('ln-exp-in');
    const lnExpInVal = document.getElementById('ln-exp-in-val');
    const lnOutDisplay = document.getElementById('ln-out');
    const expOutDisplay = document.getElementById('exp-out');

    function updateLnExp() {
        const inVal = parseFloat(lnExpInSlider.value);
        
        lnExpInVal.textContent = inVal.toFixed(1);
        
        // LN calculation
        if (inVal <= 0) {
            lnOutDisplay.textContent = 'NaN';
            lnOutDisplay.style.color = '#ff4444'; // Error color
        } else {
            const lnOut = Math.log(inVal);
            lnOutDisplay.textContent = Math.round(lnOut * 1000) / 1000;
            lnOutDisplay.style.color = '#00ffcc'; // Valid color
        }

        // EXP calculation
        const expOut = Math.exp(inVal);
        // Display exponential value with limit bounds to prevent overflow visually
        if (!isFinite(expOut)) {
            expOutDisplay.textContent = '+INF';
            expOutDisplay.style.color = '#ff4444'; // Overflow color
        } else {
            // Use scientific notation if it gets too large
            if (expOut > 1000000 || expOut < 0.001 && expOut !== 0) {
                expOutDisplay.textContent = expOut.toExponential(3);
            } else {
                expOutDisplay.textContent = Math.round(expOut * 1000) / 1000;
            }
            expOutDisplay.style.color = '#ff00aa'; // Valid color
        }
    }

    lnExpInSlider.addEventListener('input', updateLnExp);

    // Initial updates
    updateSqrSqrt();
    updateLnExp();
});
