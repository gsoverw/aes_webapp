import { gFunctionValues, tempValues, expandedKey, u8aToHexSpaced, pt, key, iniBlock, allAfterSubBytes } from "./newAESLogic.js"
import { boxSize, offset, sboxAxisHx, sboxAxisHy,
         sboxTargetH, sboxAxisVx, sboxAxisVy, sboxTargetV
        } from "./animations.js"

import { SBOX_FRAME_1, SBOX_FRAME_3 } from "./animations.js";

const w3 = ["09", "cf", "4f", "3c"]
const afterRotWord = ["cf", "4f", "3c", "09"]
const afterSbox = ["8a", "84", "eb", "01"]
const afterRcon = ["8b", "84", "eb", "01"]

const sBox = [
    ['63', '7c', '77', '7b', 'f2', '6b', '6f', 'c5', '30', '01', '67', '2b', 'fe', 'd7', 'ab', '76'],
    ['ca', '82', 'c9', '7d', 'fa', '59', '47', 'f0', 'ad', 'd4', 'a2', 'af', '9c', 'a4', '72', 'c0'],
    ['b7', 'fd', '93', '26', '36', '3f', 'f7', 'cc', '34', 'a5', 'e5', 'f1', '71', 'd8', '31', '15'],
    ['04', 'c7', '23', 'c3', '18', '96', '05', '9a', '07', '12', '80', 'e2', 'eb', '27', 'b2', '75'],
    ['09', '83', '2c', '1a', '1b', '6e', '5a', 'a0', '52', '3b', 'd6', 'b3', '29', 'e3', '2f', '84'],
    ['53', 'd1', '00', 'ed', '20', 'fc', 'b1', '5b', '6a', 'cb', 'be', '39', '4a', '4c', '58', 'cf'],
    ['d0', 'ef', 'aa', 'fb', '43', '4d', '33', '85', '45', 'f9', '02', '7f', '50', '3c', '9f', 'a8'],
    ['51', 'a3', '40', '8f', '92', '9d', '38', 'f5', 'bc', 'b6', 'da', '21', '10', 'ff', 'f3', 'd2'],
    ['cd', '0c', '13', 'ec', '5f', '97', '44', '17', 'c4', 'a7', '7e', '3d', '64', '5d', '19', '73'],
    ['60', '81', '4f', 'dc', '22', '2a', '90', '88', '46', 'ee', 'b8', '14', 'de', '5e', '0b', 'db'],
    ['e0', '32', '3a', '0a', '49', '06', '24', '5c', 'c2', 'd3', 'ac', '62', '91', '95', 'e4', '79'],
    ['e7', 'c8', '37', '6d', '8d', 'd5', '4e', 'a9', '6c', '56', 'f4', 'ea', '65', '7a', 'ae', '08'],
    ['ba', '78', '25', '2e', '1c', 'a6', 'b4', 'c6', 'e8', 'dd', '74', '1f', '4b', 'bd', '8b', '8a'],
    ['70', '3e', 'b5', '66', '48', '03', 'f6', '0e', '61', '35', '57', 'b9', '86', 'c1', '1d', '9e'],
    ['e1', 'f8', '98', '11', '69', 'd9', '8e', '94', '9b', '1e', '87', 'e9', 'ce', '55', '28', 'df'],
    ['8c', 'a1', '89', '0d', 'bf', 'e6', '42', '68', '41', '99', '2d', '0f', 'b0', '54', 'bb', '16']
];

export const rCon = [
    ['00','00','00','00'],
    ['01','00','00','00'],
    ['02','00','00','00'],
    ['04','00','00','00'],
    ['08','00','00','00'],
    ['10','00','00','00'],
    ['20','00','00','00'],
    ['40','00','00','00'],
    ['80','00','00','00'],
    ['1B','00','00','00'],
    ['36','00','00','00']
];

const sBoxLabels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"]

let highlightBoxSize = boxSize + 10;

export function drawSBox(frameID) {
    const canvas = document.getElementById(frameID);
    const ctx = canvas.getContext('2d');    
    
    for(let i = 0; i < 16; i++) {
        ctx.fillStyle = "rgb(128 128 128)"
        ctx.fillRect(100 + (offset * i), 25, boxSize, boxSize);
        ctx.fillStyle = "rgb(128 128 128)"
        ctx.fillRect(25, 100 + (offset * i), boxSize, boxSize);

        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(sBoxLabels[i], 100 + ((offset * i) + (boxSize / 2)), 25 + (boxSize / 2));
        ctx.fillText(sBoxLabels[i], 25 + (boxSize / 2), 100 + ((offset * i) + (boxSize / 2)));
    }

    for(let i = 0; i < 16; i++) {
        for(let j = 0; j < 16; j++) {
            ctx.fillStyle = "rgb(128 128 128)"
            ctx.fillRect(100 + (offset * j), 100 + (offset * i), boxSize, boxSize);

            ctx.fillStyle = "black";
            ctx.font = "18px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(sBox[i][j], 100 + ((offset * j) + (boxSize / 2)), 100 + ((offset * i) + (boxSize / 2)));
        }
    }
}

//draw a square where you can pick the size
export function drawSquare(w, h, text, fontSize, xpos, ypos, frameID, clear = false) {
    const canvas = document.getElementById(frameID);
    const ctx = canvas.getContext('2d');

    if(clear) ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#e6e6e6"
    ctx.fillRect(xpos, ypos, w, h);
    ctx.fillStyle = "black";
    ctx.font = `${fontSize}px Arial`;;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, xpos + (w / 2), ypos + (h / 2));
}
export function drawArrayBlock(arr, kVal, frameID, iskVal = true, direction = "rowWise", spacing = 40, staringX = 0, staringY = 0) {
    const canvas = document.getElementById(frameID);
    const ctx = canvas.getContext('2d');

    if(iskVal === true) {
        let kStart = staringX + 25;
        ctx.fillStyle = "black";
        ctx.font = "20px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("k" + kVal + " =", kStart, 70)

        for(let i = 0; i < 4; i++) {
            ctx.fillStyle = "black";
            ctx.font = "18px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("w" + (i + (kVal * 4)), staringX + 75, 15 + (spacing * i));

            for(let j = 0; j < 4; j++) {
                if(direction === "rowWise") drawSquare(30, 30, arr[(i * 4) + j], 18, staringX + (105 + (40 * j)), staringY + (spacing * i), frameID, false)
            }
        }
    } else {
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                if(direction === "rowWise") drawSquare(30, 30, arr[(i * 4) + j], 18, staringX + (spacing * j), staringY + (spacing * i), frameID, false)
            }
        }
    }
}

export function drawArrow(startX, startY, endingX, endingY, noHead = false, headDirection, frameID) {
    const canvas = document.getElementById(frameID);
    const ctx = canvas.getContext('2d');
    const headW = 8;
    const headH = 10;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endingX, endingY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    if(noHead) return;

    switch (headDirection) {
        case "up":
            ctx.moveTo(endingX, endingY);
            ctx.lineTo(endingX - (headW / 2), endingY + headH);
            ctx.lineTo(endingX + (headW / 2), endingY + headH);
            ctx.fill();
            break;
        case "down":
            ctx.moveTo(endingX, endingY);
            ctx.lineTo(endingX - (headW / 2), endingY - headH);
            ctx.lineTo(endingX + (headW / 2), endingY - headH);
            ctx.fill();
            break;   
        case "right":
            ctx.moveTo(endingX, endingY);
            ctx.lineTo(endingX - headH, endingY + (headW / 2));
            ctx.lineTo(endingX - headH, endingY - (headW / 2));
            ctx.fill();
            break; 
        case "left":
            ctx.moveTo(endingX, endingY);
            ctx.lineTo(endingX + headH, endingY - (headW / 2));
            ctx.lineTo(endingX + headH, endingY + (headW / 2));
            ctx.fill();
            break; 
        default:
            break;
    }
}

export function drawXorCircle(xCord, yCord, raii, frameID) {
    const canvas = document.getElementById(frameID);
    const ctx = canvas.getContext('2d');

    //Circle
    ctx.beginPath();
    ctx.arc(xCord, yCord, raii, 0, 2 * Math.PI)
    ctx.stroke();

    //Plus
    ctx.beginPath();
    ctx.moveTo(xCord - raii, yCord);
    ctx.lineTo(xCord + raii, yCord);
    ctx.moveTo(xCord, yCord - raii);
    ctx.lineTo(xCord, yCord + raii);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
}

export function drawHAxisBox() {
    const canvas = document.getElementById(SBOX_FRAME_1);
    const ctx = canvas.getContext('2d');           

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red"
    ctx.fillRect(sboxAxisHx, sboxAxisHy, highlightBoxSize, highlightBoxSize) 
}

export function drawVAxisBox() {
    const canvas = document.getElementById(SBOX_FRAME_1);
    const ctx = canvas.getContext('2d');   

    ctx.fillStyle = "red"
    ctx.fillRect(sboxAxisVx, sboxAxisVy, highlightBoxSize, highlightBoxSize)
}

export function drawResult() {
    const canvas = document.getElementById(SBOX_FRAME_3);
    const ctx = canvas.getContext('2d');   

    ctx.fillStyle = "green"
    ctx.fillRect(sboxTargetH, sboxTargetV, highlightBoxSize, highlightBoxSize)
}
export function sboxExampleArr(arr, frameID) {
    for(let i = 0; i < 4; i++) {
        drawSquare(40, 40, arr[i], 18, 0, 0, frameID + i)
    }
}
export function sboxExampleArrow(frameID) {
    for(let i = 0; i < 4; i++) {
        drawArrow(20, 0, 20, 100, false, "down", frameID + i)
    }
}
export function sboxExampleSbox(frameID) {
    for(let i = 0; i < 4; i++) {
        drawSquare(80, 40, "sbox", 20, 0, 0, frameID + i)
    }
}

export function drawSboxExample() {
    sboxExampleArr(afterRotWord, "sboxw");
    sboxExampleArrow("sboxArrow");
    sboxExampleSbox("sboxHover");
    sboxExampleArrow("sboxArrowA");
    sboxExampleArr(afterSbox, "sboxR")
}

export function keySchedule() {

    //Draws [w0] - [w7]
    let wval = 4;
    for(let i = 0; i < 4; i++) {
        drawSquare(30, 30, "w" + i, 18, 25, 0 + (60 * i), "keyScheduleCanvas");
        drawSquare(30, 30, "w" + wval, 18, 140 + (90 * i), 540, "keyScheduleCanvas");
        wval += 1;
    }
    drawSquare(80, 30, "rotWord", 18, 0, 270, "keyScheduleCanvas");
    drawSquare(80, 30, "sbox", 18, 0, 360, "keyScheduleCanvas");
    drawSquare(80, 30, "rCon", 18, 0, 450, "keyScheduleCanvas");

    drawXorCircle(155, 465, 15, "keyScheduleCanvas");
    drawArrow(80, 465, 140, 465, false, "right", "keyScheduleCanvas");

    for(let i = 0; i < 4; i++) {
        drawXorCircle(155 + (90 * i), 465, 15, "keyScheduleCanvas");
    }
    for(let i = 0; i < 4; i++) {
        drawArrow(55, 15 + (60 * i), 155 + (90 * i), 15 + (60 * i), true, "right", "keyScheduleCanvas");
        drawArrow(155 + (90 * i), 15 + (60 * i), 155 + (90 * i), 450, false, "down", "keyScheduleCanvas");
        drawArrow(155 + (90 * i), 480, 155 + (90 * i), 540, false, "down", "keyScheduleCanvas");
    }
    for(let i = 0; i < 3; i++) {
        drawArrow(40, 210 + (90 * i), 40, 270 + (90 * i), false, "down", "keyScheduleCanvas");
        drawArrow(170 + (90 * i), 555, 200 + (90 * i), 555, true, "right", "keyScheduleCanvas")
        drawArrow(200 + (90 * i), 465, 230 + (90 * i), 465, false, "right", "keyScheduleCanvas")
        drawArrow(200 + (90 * i), 555, 200 + (90 * i), 465,  true, "right", "keyScheduleCanvas")
    } 
}

export function drawRcon(frameID) {
    const canvas = document.getElementById(frameID);
    const ctx = canvas.getContext('2d');

    //Draw text
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Round #", 40, 40);
    ctx.fillText("rCi", 40, 90);

    for(let i = 0; i < 2; i++) {
        for(let j = 0; j < 11; j++) {
            drawSquare(30, 30, j, 18, 100 + (50 * j), 25, frameID, false)
            if(i === 1) {
            drawSquare(30, 30, rCon[j][0], 18, 100 + (50 * j), 75, frameID, false)
        }
        }
    }
}

export function drawxOR(arr1, arr2, arr3, legendArr, frameID) {
    const canvas = document.getElementById(frameID);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = "black";
    ctx.font = "20px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(legendArr[0] + " =", 30, 15);
    ctx.fillText(legendArr[1] + " =", 30, 165);
    ctx.fillText(legendArr[2] + " =", 30, 240);

    for(let i = 0; i < 4; i++) {
        drawSquare(30, 30, arr1[i], 18, 91 + (100 * i), 0, frameID)
        drawSquare(30, 30, arr2[i], 18, 90 + (100 * i), 150, frameID)

        drawXorCircle(106, 90, 15, frameID);
        drawXorCircle(106 + (100 * i), 90, 15, frameID);

        drawArrow(106 + (100 * i), 30, 106 + (100 * i), 75, false, "down", frameID);
        drawArrow(106 + (100 * i), 150, 106 + (100 * i), 105, false, "up", frameID);
        drawArrow(106 + (100 * i), 90, 151 + (100 * i), 90, true, "right", frameID);
        drawArrow(151 + (100 * i), 90, 151 + (100 * i), 225, false, "down", frameID);

        drawSquare(30, 30, arr3[i], 18, 136 + (100 * i), 225, frameID);
    }
}

export function sliderArrows(frameID) {
    drawArrow(20, 240, 65, 240, true, "right", frameID);
    drawArrow(65, 240, 65, 15, true, "up", frameID);
    drawArrow(65, 15, 115, 15, false, "right", frameID);
}


function drawvArrow(frameID, startingX, startingY, length, direction) {
    //top line
    drawArrow(startingX, startingY, startingX + 10, startingY, true, "right", frameID);
    //bottom line
    drawArrow(startingX, startingY + length, startingX + 10, startingY + length, true, "right", frameID)
    //middle line
    drawArrow(startingX + 10, startingY, startingX + 10, startingY + length, true, "down", frameID)
    //right line
    drawArrow(startingX + 10, startingY + (length / 2), startingX + 20, startingY + (length / 2), true, "down", frameID)
}

export function drawFullKeyExpansion(spacing = 0, frameID) {
    const canvas = document.getElementById(frameID);
    const ctx = canvas.getContext('2d');
    let currentWord; 
    let swCount = 1;
    let gCount = 2 

    for(let i = 0; i < 40; i++) {
        ctx.fillStyle = "black";
        ctx.font = "16px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${i + 4}`, 65, 50 + (spacing * i));
        ctx.fillText(`w[${i + 4}]`, 1150, 50 + (spacing * i));
        ctx.fillText("=", 1100, 50 + (spacing * i));

        //Writes temp values
        ctx.fillText(`${tempValues[i]}`, 160, 50 + (spacing * i));

        //Writes the vales from the g()
        //Need to find a better way to get the subword and g() values
        //This count method seems awkward
        if(i < 10) {
            ctx.fillText(`${gFunctionValues[i * 3]}`, 285, 50 + ((spacing + 90) * i));
            ctx.fillText(rCon[i + 1].join(''), 595, 50 + ((spacing + 90) * i));
            ctx.fillText(`${gFunctionValues[i + swCount]}`, 445, 50 + ((spacing + 90) * i))
            swCount += 2
            ctx.fillText(`${gFunctionValues[i + gCount]}`, 725, 50 + ((spacing + 90) * i))
            gCount += 2
        }
        currentWord = u8aToHexSpaced(expandedKey.subarray(i * 4, (i * 4) + 4))
        ctx.fillText(`${currentWord}`, 865, 50 + (spacing * i));
        ctx.fillText(`${tempValues[i + 1]}`, 1025, 50 + (spacing * i));
    }

    for(let i = 0; i < 10; i++) {
        const lineSpacing = 120
        if(i === 0) drawArrow(20, 15, 1185, 15, true, "right", frameID)
        drawArrow(20, 35 + (lineSpacing * i), 1185, 35 + (lineSpacing * i), true, "right", frameID)

        drawArrow(1190, 50 + (lineSpacing * i), 1200, 50 + (lineSpacing * i), true, "right", frameID)
        drawArrow(1190, 140 + (lineSpacing * i), 1200, 140 + (lineSpacing * i), true, "right", frameID)
        drawArrow(1200, 95 + (lineSpacing * i), 1210, 95 + (lineSpacing * i), true, "right", frameID)
        drawArrow(1200, 50 + (lineSpacing * i), 1200, 140 + (lineSpacing * i), true, "right", frameID)
        ctx.font = "20px monospace";
        ctx.fillText(`k${i + 1}`, 1230, 95 + (lineSpacing * i));
    }
}

export function drawInitialTransformation(frameID) {
    const canvas = document.getElementById(frameID);
    const ctx = canvas.getContext('2d');

    //P block
    drawArrayBlock(u8aToHexSpaced(pt), 0, frameID, false, "rowWise", 40)
    drawXorCircle(250, 75, 15, frameID)
    drawXorCircle(250, 75, 15, frameID)
    //k0 block
    drawArrayBlock(u8aToHexSpaced(key), 0, frameID, false, "rowWise", 40, 350)

    ctx.fillStyle = "black";
    ctx.font = "italic 20px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("P", 75, 200);
    ctx.fillText("k0", 425, 200);
    ctx.fillText("stateArray", 775, 200);

    drawvArrow(frameID, 600, 15, 120, "right")
    drawArrayBlock(u8aToHexSpaced(iniBlock), 0, frameID, false, "rowWise", 40, 700)
}
export function drawAesBlock(block, parentContainer) {
    const container = document.getElementById(parentContainer);
    container.innerHTML = "";

    for (let row = 0; row < 4; row++) {
        const rowEl = document.createElement("div");
        rowEl.className = `aes-row row-${row}`;
        rowEl.dataset.row = row;

        for (let col = 0; col < 4; col++) {
            const index = row * 4 + col;
            const cell = document.createElement("div");
            cell.className = "aes-cell";
            cell.dataset.index = index;
            cell.dataset.col = col;
            cell.dataset.row = row;
            cell.textContent = u8aToHexSpaced(block)[index];
            rowEl.appendChild(cell);
        }
        container.appendChild(rowEl);
        if(block.length < 5) break; //only one row
    }
}

export function drawMixColumnsMathHeader(cell) {
    const container = document.getElementById("mix-columns-visual-math-header");
    const containerMath = document.getElementById("mix-columns-visual-math");
    const targetBlock = document.getElementById("mix-columns-visual-block1");
    const cellRow = cell.dataset.row;
    const cellCol = cell.dataset.col;

    const targetCols = targetBlock.querySelectorAll(`.aes-cell[data-col='${cellCol}']`);

    container.innerHTML = "";

    const fixedMatrix = [
        ["02", "03", "01", "01"],
        ["01", "02", "03", "01"],
        ["01", "01", "02", "03"],
        ["03", "01", "01", "02"]
    ];

    function hexToPolynomial(hexStr) {
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

    for(let i = 0; i < 4; i++) {
        const term = document.createElement("div");
        term.className = "mix-columns-math-term";
        term.textContent = `{${targetCols[i].textContent}} * {${fixedMatrix[cellRow][i]}}`;
        container.appendChild(term);

        if(i === 3) break;  
        const xOR = document.createElement("div");
        xOR.className = "mix-columns-math-xor";
        xOR.textContent = "⊕";
        container.appendChild(xOR);
    }

    for(let i = 0; i < 4; i++) {
        const termMath = document.createElement("div");
        const termMathP = document.createElement("p");
        termMath.className = "mix-columns-math-term-math";
        termMath.textContent = `${targetCols[i].textContent} = ${parseInt(targetCols[i].textContent, 16).toString(2).padStart(8, '0')} = ${hexToPolynomial(targetCols[i].textContent)}`;
        termMathP.textContent = `${fixedMatrix[cellRow][i]} = ${parseInt(fixedMatrix[cellRow][i], 16).toString(2).padStart(8, '0')} = ${hexToPolynomial(fixedMatrix[cellRow][i])}`;
        termMathP.appendChild(document.createElement("br"));
        termMathP.append(`${fixedMatrix[cellRow][i]} * ${targetCols[i].textContent} = {${hexToPolynomial(fixedMatrix[cellRow][i])}} * {${hexToPolynomial(targetCols[i].textContent)}}`);
        containerMath.appendChild(termMath);
        termMath.appendChild(termMathP);
    }
}
export function drawSvgLine(fromSq, toSq) {
    const svg = document.getElementById("sub-bytes-svg");
    svg.innerHTML = "";

    const sq1 = fromSq.getBoundingClientRect();
    const sq2 = toSq.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    const sq1X = sq1.left + (sq1.width / 2) - svgRect.left;
    const sq1Y = sq1.top + (sq1.height / 2) - svgRect.top;
    const sq2X = sq2.left + (sq2.width / 2) - svgRect.left;
    const sq2Y = sq2.top + (sq2.height / 2) - svgRect.top;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    const cs = (sq1X + sq2X) / 2; // control point x
    const cy = Math.min(sq1Y, sq2Y) + 125; // control point y

    path.setAttribute(
        "d",
        `M ${sq1X} ${sq1Y} Q ${cs} ${cy} ${sq2X} ${sq2Y}`
    );
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("fill", "none");
    
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
    path.style.transition = "stroke-dashoffset 0.75s ease";
    svg.appendChild(path);

    // Trigger animation
    requestAnimationFrame(() => {
        path.style.strokeDashoffset = 0;
    });

    const midpointOfPath = path.getPointAtLength(pathLength / 2);    

    const sbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    sbox.setAttribute("x", midpointOfPath.x - 25); // subtract half width to center
    sbox.setAttribute("y", midpointOfPath.y - 25); // subtract half height
    sbox.setAttribute("width", 50);
    sbox.setAttribute("height", 50);
    sbox.setAttribute("fill", "#9aff9a");
    sbox.setAttribute("stroke", "black");
    svg.appendChild(sbox);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", midpointOfPath.x); 
    text.setAttribute("y", midpointOfPath.y); 
    text.setAttribute("text-anchor", "middle"); 
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "black"); 
    text.setAttribute("font-size", "14");
    text.setAttribute("font-family", "monospace");
    text.textContent = "S-Box"; 
    svg.appendChild(text);
}
