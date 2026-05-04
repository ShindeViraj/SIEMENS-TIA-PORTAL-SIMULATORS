document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements for EXPT
    const exptIn1 = document.getElementById('expt-in1');
    const exptIn1Val = document.getElementById('expt-in1-val');
    const exptIn2 = document.getElementById('expt-in2');
    const exptIn2Val = document.getElementById('expt-in2-val');
    const exptOut = document.getElementById('expt-out');

    // DOM Elements for FRAC
    const fracIn = document.getElementById('frac-in');
    const fracInVal = document.getElementById('frac-in-val');
    const fracOut = document.getElementById('frac-out');

    /**
     * S7-1200 EXPT Logic
     * Rule: Calculates IN1 ^ IN2
     * Exception: If IN1 is negative and IN2 is fractional, JS Math.pow returns NaN, 
     * which accurately represents the PLC real number invalid computation behavior.
     */
    function updateExpt() {
        const in1 = parseFloat(exptIn1.value);
        const in2 = parseFloat(exptIn2.value);
        exptIn1Val.textContent = in1.toFixed(3);
        exptIn2Val.textContent = in2.toFixed(3);

        let out = Math.pow(in1, in2);
        
        // Match Siemens display style for errors
        if (isNaN(out)) {
            exptOut.textContent = "NaN";
        } else if (!isFinite(out)) {
            exptOut.textContent = out > 0 ? "+INF" : "-INF";
        } else {
            exptOut.textContent = out.toFixed(3);
        }
        
        // Add visual flash indicating processing
        exptOut.classList.add('active-led');
        setTimeout(() => exptOut.classList.remove('active-led'), 100);
    }

    /**
     * S7-1200 FRAC Logic
     * Rule: Calculates the fractional part. Output = IN - TRUNC(IN).
     * Works for negative values too (e.g., -3.14 -> -0.14)
     */
    function updateFrac() {
        const inVal = parseFloat(fracIn.value);
        fracInVal.textContent = inVal.toFixed(3);

        const out = inVal - Math.trunc(inVal);

        if (isNaN(out)) {
            fracOut.textContent = "NaN";
        } else if (!isFinite(out)) {
            fracOut.textContent = "+NaN"; // As per Siemens spec for FRAC on +/- INF
        } else {
            fracOut.textContent = out.toFixed(3);
        }

        // Add visual flash
        fracOut.classList.add('active-led');
        setTimeout(() => fracOut.classList.remove('active-led'), 100);
    }

    // Attach Event Listeners
    exptIn1.addEventListener('input', updateExpt);
    exptIn2.addEventListener('input', updateExpt);
    fracIn.addEventListener('input', updateFrac);

    // Initial evaluation
    updateExpt();
    updateFrac();
});
