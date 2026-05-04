document.addEventListener('DOMContentLoaded', () => {
    // --- MOD ---
    const modIn1Slider = document.getElementById('mod-in1');
    const modIn2Slider = document.getElementById('mod-in2');
    const modIn1Val = document.getElementById('mod-in1-val');
    const modIn2Val = document.getElementById('mod-in2-val');
    const modOutDisplay = document.getElementById('mod-out');

    function updateMod() {
        const in1 = parseInt(modIn1Slider.value, 10);
        const in2 = parseInt(modIn2Slider.value, 10);
        
        modIn1Val.textContent = in1;
        modIn2Val.textContent = in2;

        let out = 0;
        if (in2 !== 0) {
            out = in1 % in2;
        } else {
            out = 0; // Avoid division by zero, standard fallback
        }

        modOutDisplay.textContent = out;
    }

    modIn1Slider.addEventListener('input', updateMod);
    modIn2Slider.addEventListener('input', updateMod);


    // --- NEG & ABS ---
    const negAbsInSlider = document.getElementById('neg-abs-in');
    const negAbsInVal = document.getElementById('neg-abs-in-val');
    const negOutDisplay = document.getElementById('neg-out');
    const absOutDisplay = document.getElementById('abs-out');

    function updateNegAbs() {
        const inVal = parseInt(negAbsInSlider.value, 10);
        
        negAbsInVal.textContent = inVal;
        
        const negOut = -inVal;
        const absOut = Math.abs(inVal);

        negOutDisplay.textContent = negOut;
        absOutDisplay.textContent = absOut;
    }

    negAbsInSlider.addEventListener('input', updateNegAbs);


    // --- CALCULATE ---
    const calcExpressionInput = document.getElementById('calc-expression');
    const calcIn1Slider = document.getElementById('calc-in1');
    const calcIn2Slider = document.getElementById('calc-in2');
    const calcIn3Slider = document.getElementById('calc-in3');
    
    const calcIn1Val = document.getElementById('calc-in1-val');
    const calcIn2Val = document.getElementById('calc-in2-val');
    const calcIn3Val = document.getElementById('calc-in3-val');
    
    const calcOutDisplay = document.getElementById('calc-out');

    function updateCalculate() {
        const in1 = parseInt(calcIn1Slider.value, 10);
        const in2 = parseInt(calcIn2Slider.value, 10);
        const in3 = parseInt(calcIn3Slider.value, 10);
        
        calcIn1Val.textContent = in1;
        calcIn2Val.textContent = in2;
        calcIn3Val.textContent = in3;

        const expr = calcExpressionInput.value.toUpperCase();
        
        // Basic parser for IN1, IN2, IN3 math evaluation
        try {
            // Replace IN1, IN2, IN3 with their actual values
            // Note: using eval carefully here strictly for the simulator math expressions
            const sanitizedExpr = expr
                .replace(/IN1/g, `(${in1})`)
                .replace(/IN2/g, `(${in2})`)
                .replace(/IN3/g, `(${in3})`)
                .replace(/[^0-9+\-*/(). ]/g, ''); // Remove anything that isn't a math symbol or number to secure eval

            let result = 0;
            if (sanitizedExpr.trim() !== '') {
                result = eval(sanitizedExpr);
            }
            
            // Handle NaNs or Infinities gracefully
            if (!isFinite(result)) {
                result = 'ERROR';
            } else {
                result = Math.round(result * 100) / 100; // Round to 2 decimal places if needed
            }

            calcOutDisplay.textContent = result;
            calcOutDisplay.style.color = result === 'ERROR' ? '#ff4444' : '#ff00aa';

        } catch (e) {
            calcOutDisplay.textContent = 'ERR';
            calcOutDisplay.style.color = '#ff4444';
        }
    }

    calcIn1Slider.addEventListener('input', updateCalculate);
    calcIn2Slider.addEventListener('input', updateCalculate);
    calcIn3Slider.addEventListener('input', updateCalculate);
    calcExpressionInput.addEventListener('input', updateCalculate);

    // Initial updates
    updateMod();
    updateNegAbs();
    updateCalculate();
});
