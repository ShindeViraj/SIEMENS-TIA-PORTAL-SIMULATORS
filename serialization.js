document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements for Serialize
    const serInJson = document.getElementById('ser-in-json');
    const serPos = document.getElementById('ser-pos');
    const serPosVal = document.getElementById('ser-pos-val');
    const serError = document.getElementById('ser-error');
    const serOutArray = document.getElementById('ser-out-array');
    const serRetVal = document.getElementById('ser-ret-val');

    // DOM Elements for Deserialize
    const deserInHex = document.getElementById('deser-in-hex');
    const deserPos = document.getElementById('deser-pos');
    const deserPosVal = document.getElementById('deser-pos-val');
    const deserError = document.getElementById('deser-error');
    const deserOutJson = document.getElementById('deser-out-json');
    const deserRetVal = document.getElementById('deser-ret-val');

    /**
     * Converts a string to an array of hex values.
     */
    function stringToHexArray(str) {
        let hexArr = [];
        for (let i = 0; i < str.length; i++) {
            let hex = str.charCodeAt(i).toString(16).toUpperCase();
            if (hex.length < 2) hex = '0' + hex;
            // Map non-printable or space to special characters for better visualization
            let displayChar = str[i] === ' ' ? '␣' : (str.charCodeAt(i) < 32 ? '·' : str[i]);
            hexArr.push({ hex: hex, char: displayChar });
        }
        return hexArr;
    }

    /**
     * Converts an array of hex string values to a normal string.
     */
    function hexArrayToString(hexArr) {
        let str = '';
        for (let i = 0; i < hexArr.length; i++) {
            let code = parseInt(hexArr[i], 16);
            if (!isNaN(code)) {
                str += String.fromCharCode(code);
            }
        }
        return str;
    }

    /**
     * S7-1200 Serialize Logic
     * Simulates converting a UDT to a Byte Array.
     * We convert JSON into its stringified byte equivalent.
     */
    function updateSerialize() {
        const jsonText = serInJson.value;
        const offset = parseInt(serPos.value, 10);
        serPosVal.textContent = offset;

        let obj;
        try {
            // Test if it's valid JSON
            obj = JSON.parse(jsonText);
            serError.style.display = 'none';
        } catch (e) {
            serError.style.display = 'block';
            serOutArray.innerHTML = '';
            serRetVal.textContent = "8150 (Data empty/invalid)";
            serRetVal.style.color = "#ff5555";
            return;
        }

        // Generate minimal JSON string representation for byte array
        const minJson = JSON.stringify(obj);
        let hexArray = stringToHexArray(minJson);

        // Apply Offset (POS): Prepend empty bytes for the offset
        let finalHexArray = new Array(offset).fill({ hex: '00', char: '∅' }).concat(hexArray);

        // Render HTML
        serOutArray.innerHTML = finalHexArray.map(item => `
            <div class="hex-byte-group">
                <div class="hex-val">${item.hex}</div>
                <div class="char-val">${item.char}</div>
            </div>`).join('');
        serRetVal.textContent = "0000 (No Error)";
        serRetVal.style.color = "#00ffcc";
        
        // Flash effect
        serOutArray.classList.add('active-led');
        setTimeout(() => serOutArray.classList.remove('active-led'), 100);
    }

    /**
     * S7-1200 Deserialize Logic
     * Simulates converting a Byte Array back to a UDT.
     */
    function updateDeserialize() {
        const hexText = deserInHex.value.trim();
        const offset = parseInt(deserPos.value, 10);
        deserPosVal.textContent = offset;

        if (hexText === "") {
            deserOutJson.value = "";
            deserError.style.display = 'none';
            deserRetVal.textContent = "8250 (Dest Variant empty)";
            deserRetVal.style.color = "#ff5555";
            return;
        }

        // Clean up hex string and split
        const cleanedHex = hexText.replace(/[^A-Fa-f0-9 ]/g, '').split(/\s+/).filter(h => h.length > 0);
        
        if (cleanedHex.length === 0 || cleanedHex.some(h => h.length > 2)) {
            deserError.style.display = 'block';
            deserOutJson.value = "";
            deserRetVal.textContent = "8151 (Source array error)";
            deserRetVal.style.color = "#ff5555";
            return;
        } else {
            deserError.style.display = 'none';
        }

        // Apply offset (skip bytes)
        if (offset >= cleanedHex.length) {
            deserOutJson.value = "";
            deserRetVal.textContent = "8382 (POS outside limits)";
            deserRetVal.style.color = "#ff5555";
            return;
        }

        const targetHexArray = cleanedHex.slice(offset);
        const jsonStr = hexArrayToString(targetHexArray);

        try {
            // Attempt to parse back to UDT format
            const obj = JSON.parse(jsonStr);
            deserOutJson.value = JSON.stringify(obj, null, 2);
            deserRetVal.textContent = "0000 (No Error)";
            deserRetVal.style.color = "#00ffcc";
        } catch (e) {
            deserOutJson.value = "Raw Decode:\n" + jsonStr;
            deserRetVal.textContent = "8254 (Invalid dest data type)";
            deserRetVal.style.color = "#ffaa00"; // Warning color since raw decode is shown
        }

        // Flash effect
        deserOutJson.classList.add('active-led');
        setTimeout(() => deserOutJson.classList.remove('active-led'), 100);
    }

    // Attach Event Listeners
    serInJson.addEventListener('input', updateSerialize);
    serPos.addEventListener('input', updateSerialize);
    
    deserInHex.addEventListener('input', updateDeserialize);
    deserPos.addEventListener('input', updateDeserialize);

    // Initial evaluation
    updateSerialize();
    updateDeserialize();
});
