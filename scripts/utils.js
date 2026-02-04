/**
 * Multiply two binary polynomials over GF(2).
 * Works for multi-term × multi-term inputs.
 */
export function multiplyBinaryPolynomials(aBin, bBin) {
    // Convert binary string to list of exponents
    const toExponents = (bin) => {
        const exps = [];
        const bits = bin.split('').reverse();
        for (let i = 0; i < bits.length; i++) {
            if (bits[i] === '1') exps.push(i);
        }
        return exps;
    };

    const aExps = toExponents(aBin);
    const bExps = toExponents(bBin);

    // Map exponent → coefficient (0 or 1)
    const coeffs = new Map();

    for (const a of aExps) {
        for (const b of bExps) {
            const exp = a + b;
            coeffs.set(exp, (coeffs.get(exp) || 0) ^ 1);
        }
    }

    // Convert back to polynomial string
    const terms = [...coeffs.entries()]
        .filter(([, v]) => v === 1)
        .map(([k]) => k)
        .sort((a, b) => b - a)
        .map(exp => {
            if (exp === 0) return "1";
            if (exp === 1) return "X";
            return `X^${exp}`;
        });

    return terms.length ? terms.join(" + ") : "0";
}

/**
 * Reduce a polynomial string using AES irreducible polynomial
 * x^8 + x^4 + x^3 + x + 1  (0x11B)
 *
 * @param {string} polyStr - e.g. "X^8 + X^7 + X^6 + 1"
 * @returns {string} reduced polynomial string
 */
export function reduceAESPolynomial(polyStr) {
    const REDUCTION = [4, 3, 1, 0]; // x^4 + x^3 + x + 1

    // --- parse polynomial string → exponent set ---
    const terms = new Set();

    polyStr.split(" + ").forEach(term => {
        term = term.trim();
        if (term === "1") terms.add(0);
        else if (term === "X") terms.add(1);
        else if (term.startsWith("X^")) {
            terms.add(parseInt(term.slice(2), 10));
        }
    });

    // --- reduce while highest exponent ≥ 8 ---
    while (terms.size && Math.max(...terms) >= 8) {
        const k = Math.max(...terms);
        terms.delete(k);

        for (const r of REDUCTION) {
            const e = k - 8 + r;
            terms.has(e) ? terms.delete(e) : terms.add(e);
        }
    }

    // --- convert back to polynomial string ---
    return [...terms]
        .sort((a, b) => b - a)
        .map(e => e === 0 ? "1" : e === 1 ? "X" : `X^${e}`)
        .join(" + ") || "0";
}
/**
 * Convert a polynomial string to an 8-bit binary string (AES)
 *
 * @param {string} polyStr - e.g. "X^7 + X^4 + X + 1"
 * @returns {string} binary string (e.g. "10010011")
 */
export function polynomialToBinary(polyStr) {
    let value = 0;

    if (polyStr === "0") {
        return "00000000";
    }

    polyStr.split(" + ").forEach(term => {
        term = term.trim();

        if (term === "1") {
            value |= 1;
        } else if (term === "X") {
            value |= (1 << 1);
        } else if (term.startsWith("X^")) {
            const exp = parseInt(term.slice(2), 10);
            if (exp < 8) {
                value |= (1 << exp);
            }
        }
    });

    return value.toString(2).padStart(8, "0");
}
export function hexToPolynomial(hexStr) {
    // Parse hex string to integer (0–255)
    const value = parseInt(hexStr, 16);
    if (value === 0) return "0";
    const terms = [];
    // Check each bit from MSB (bit 7) to LSB (bit 0)
    for (let bit = 7; bit >= 0; bit--) {
        if (value & (1 << bit)) {
            if (bit === 0) {
                terms.push("1");
            } else if (bit === 1) {
                terms.push("X");
            } else {
                terms.push(`X^${bit}`);
            }
        }
    }
    return terms.join(" + ");
}
export function svgArrowHead(svg) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("refX", "0");
    marker.setAttribute("refY", "3.5");
    marker.setAttribute("orient", "auto");
    const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    markerPath.setAttribute("d", "M0,0 L0,7 L10,3.5 z");
    markerPath.setAttribute("fill", "black");
    marker.appendChild(markerPath);
    defs.appendChild(marker);
    svg.appendChild(defs);
}