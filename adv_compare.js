document.addEventListener('DOMContentLoaded', () => {
    // --- OUT_RANGE Logic ---
    const outRangeVal = document.getElementById('outrange-val');
    const outRangeValDisplay = document.getElementById('outrange-val-display');
    const outRangeMin = document.getElementById('outrange-min');
    const outRangeMax = document.getElementById('outrange-max');
    const outRangeLed = document.getElementById('outrange-led');
    const ladderOutRangeCoil = document.getElementById('ladder-outrange-coil');

    function updateOutRange() {
        const val = parseFloat(outRangeVal.value);
        const min = parseFloat(outRangeMin.value);
        const max = parseFloat(outRangeMax.value);

        outRangeValDisplay.textContent = val;

        let isOutRange = false;
        if (!isNaN(min) && !isNaN(max)) {
            // OUT_RANGE is TRUE if VAL < MIN or VAL > MAX
            isOutRange = (val < min) || (val > max);
        }

        if (isOutRange) {
            outRangeLed.classList.add('active');
            ladderOutRangeCoil.classList.add('active');
        } else {
            outRangeLed.classList.remove('active');
            ladderOutRangeCoil.classList.remove('active');
        }
    }

    outRangeVal.addEventListener('input', updateOutRange);
    outRangeMin.addEventListener('input', updateOutRange);
    outRangeMax.addEventListener('input', updateOutRange);
    updateOutRange(); // Init

    // --- OK / NOT_OK Logic ---
    const validityInput = document.getElementById('validity-input');
    const okLed = document.getElementById('ok-led');
    const notOkLed = document.getElementById('notok-led');
    const ladderOkCoil = document.getElementById('ladder-ok-coil');
    const ladderNotOkCoil = document.getElementById('ladder-notok-coil');

    function updateValidity() {
        const selected = validityInput.value;
        let isOk = true;

        if (selected === 'NaN' || selected === 'Infinity' || selected === '-Infinity' || selected === 'denormalized') {
            isOk = false;
        }

        if (isOk) {
            okLed.classList.add('active');
            ladderOkCoil.classList.add('active');
            notOkLed.classList.remove('active');
            ladderNotOkCoil.classList.remove('active');
        } else {
            okLed.classList.remove('active');
            ladderOkCoil.classList.remove('active');
            notOkLed.classList.add('active');
            ladderNotOkCoil.classList.add('active');
        }
    }

    validityInput.addEventListener('change', updateValidity);
    updateValidity(); // Init

    // --- Variant Null / Array Check Logic ---
    const variantInput = document.getElementById('variant-input');
    const isNullLed = document.getElementById('isnull-led');
    const isArrayLed = document.getElementById('isarray-led');
    const ladderIsNullCoil = document.getElementById('ladder-isnull-coil');
    const ladderIsArrayCoil = document.getElementById('ladder-isarray-coil');

    function updateVariant() {
        const selected = variantInput.value;
        
        let isNull = false;
        let isArray = false;

        if (selected === 'null') {
            isNull = true;
        } else if (selected === 'array') {
            isArray = true;
        }

        // IS_NULL
        if (isNull) {
            isNullLed.classList.add('active');
            ladderIsNullCoil.classList.add('active');
        } else {
            isNullLed.classList.remove('active');
            ladderIsNullCoil.classList.remove('active');
        }

        // IS_ARRAY
        if (isArray) {
            isArrayLed.classList.add('active');
            ladderIsArrayCoil.classList.add('active');
        } else {
            isArrayLed.classList.remove('active');
            ladderIsArrayCoil.classList.remove('active');
        }
    }

    variantInput.addEventListener('change', updateVariant);
    updateVariant(); // Init
});
