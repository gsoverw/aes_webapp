import { tempValues, expandedKey, u8aToHexSpaced, pt, key, iniBlock, 
         allAfterSubBytes, allAfterAddRoundKey, allAfterShiftRows, rowToColumnWise, allAfterMixColumns, 
         resultCypher, afterAllGOut, afterAllRotWord, afterAllSubWord, RCON } from "./newAESLogic.js"


import { multiplyBinaryPolynomials, reduceAESPolynomial, polynomialToBinary, hexToPolynomial, svgArrowHead } from "./utils.js";

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
const rConout = ["8b", "84", "eb", "01"];
const result = ["8a", "84", "eb", "01"];

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
export function drawKeyExpansionTable() {
    const tablediv = document.getElementById("expansion-example-table");
    tablediv.innerHTML = "";
    const expansionTextDiv = document.getElementById("key-expansion-text")
    expansionTextDiv.innerHTML = "";
    const expansionKeyText = document.getElementById("key-expansion-key-value");
    expansionKeyText.innerHTML = "";
    expansionKeyText.innerHTML = `Key = <code>${u8aToHexSpaced(key).join(" ")}</code> for Nk = 4, which results in:`;

    for(let i = 0; i < 4; i++) {
        const expansionTextCell = document.createElement("div")
        expansionTextCell.innerText = `[w${i}] = ${u8aToHexSpaced(expandedKey.subarray(i * 4, (i * 4) + 4)).join("")}`
        expansionTextDiv.appendChild(expansionTextCell);
    }

    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
    headerRow.style.marginBottom = "30px";
    headerRow.style.borderBottom = "3px solid black";

    const headers = ["i", "temp", "after \nrotWord()", "after \nsubWord()", "rCon[]", "After ⊕ \nw/Rcon", "w[i - Nk]", "temp ⊕ \nw[i - Nk]", ""];
    headers.forEach(headerText => {
        const headerCell = document.createElement("td");
        headerCell.innerText = headerText;
        headerRow.appendChild(headerCell);
        table.appendChild(headerRow);
    });

    for(let i = 0; i < 40; i++) {
        const row = document.createElement("tr");
        function emptyCell() {
            const emptyCell = document.createElement("td");
            row.appendChild(emptyCell);
            table.appendChild(row);
        }
        const cellI = document.createElement("td");
        cellI.innerText = i + 4;
        row.appendChild(cellI);
        table.appendChild(row);

        const cellTemp = document.createElement("td");
        cellTemp.innerText = tempValues[i].join("");
        row.appendChild(cellTemp);
        table.appendChild(row);
        if (i % 4 === 0) {
            row.style.borderTop = "3px solid black";
            row.style.paddingTop = "3px";

            const cellRotWord = document.createElement("td");
            cellRotWord.innerText = afterAllRotWord[i / 4].join("");
            row.appendChild(cellRotWord);
            
            const cellSubWord = document.createElement("td");
            cellSubWord.innerText = afterAllSubWord[i / 4].join("");
            row.appendChild(cellSubWord);

            const cellRcon = document.createElement("td");
            cellRcon.innerText = RCON[i /4].toString(2).padStart(8, '0');
            row.appendChild(cellRcon);

            const cellGOutput = document.createElement("td");
            cellGOutput.innerText = afterAllGOut[i / 4].join("")
            row.appendChild(cellGOutput);
            table.appendChild(row)
        } else {
            emptyCell();
            emptyCell();
            emptyCell();
            emptyCell();
        }
        const wPrevious = document.createElement("td");
        wPrevious.innerText = u8aToHexSpaced(expandedKey.subarray(i * 4, (i * 4) + 4)).join("")
        row.appendChild(wPrevious);
        table.appendChild(row)

        const afterXorTemp = document.createElement("td");
        afterXorTemp.innerText = tempValues[i + 1].join("");
        row.appendChild(afterXorTemp);
        table.appendChild(row)

        const wValue = document.createElement("td")
        wValue.innerText = `-----> = w[${i + 4}]`
        row.appendChild(wValue);
        table.appendChild(row)
    }
    tablediv.appendChild(table);
}
export function drawSbox() {
    const container = document.getElementById("sbox-slider");
    container.innerHTML = "";

    // Draw column labels (0-F across the top)
    const topLeftCorner = document.createElement("div");
    topLeftCorner.style.marginBottom = "15px";
    topLeftCorner.style.marginRight = "20px";
    container.appendChild(topLeftCorner);
    
    for(let col = 0; col < 16; col++) {
        const label = document.createElement("div");
        label.className = `sbox-cell headerCol`
        label.style.marginBottom = "15px";
        label.textContent = sBoxLabels[col];
        container.appendChild(label);
    }
    // Draw rows with row labels and sBox values
    for(let row = 0; row < 16; row++) {
        // Draw row label
        const rowLabel = document.createElement("div");
        rowLabel.className = `sbox-cell headerRow`
        rowLabel.style.marginRight = "20px";
        rowLabel.textContent = sBoxLabels[row];
        container.appendChild(rowLabel);
        
        // Draw sBox cells for this row
        for(let col = 0; col < 16; col++) {
            const cell = document.createElement("div");
            cell.className = `sbox-cell cell-${col}`
            cell.dataset.col = col;
            cell.dataset.row = row;
            cell.textContent = sBox[row][col];
            container.appendChild(cell);
        }
    }
}
export function newSboxDraw(hoveredCellText) {
    const container = document.getElementById("sbox-slider")
    const containerSvg = document.getElementById("sbox-slider-svg")
    const containerCellsCol = Array.from(container.querySelectorAll(".headerCol"));
    const containerCellsRow = Array.from(container.querySelectorAll(".headerRow"));
    const containerCells = Array.from(container.querySelectorAll(".sbox-cell"));

    containerSvg.innerHTML = "";
    //clear previous highlights
    containerCells.forEach(div => {
        div.classList.remove("sbox-highlight-cell")
        div.classList.remove("sbox-highlight");
    });
    const rowHighlight = containerCellsRow.find(div =>
        div.classList.contains(`headerRow`) && div.textContent === hoveredCellText[0]
    );
    const colHighlight = containerCellsCol.find(div =>
        div.classList.contains(`headerCol`) && div.textContent === hoveredCellText[1]
    );
    const targetCell = containerCells.find(div =>
        div.dataset.row === parseInt(hoveredCellText[0], 16).toString() &&
        div.dataset.col === parseInt(hoveredCellText[1], 16).toString()
    );
    drawSboxSvgLines(rowHighlight, colHighlight, targetCell);
    rowHighlight.classList.add("sbox-highlight-cell");
    colHighlight.classList.add("sbox-highlight-cell");
    targetCell.classList.add("sbox-highlight");
}
export function drawSboxSvgLines(rowSq, colSq, targetSq) {
    const containerSvg = document.getElementById("sbox-slider-svg");
    containerSvg.innerHTML = "";

    const rowRect = rowSq.getBoundingClientRect();
    const colRect = colSq.getBoundingClientRect();
    const targetRect = targetSq.getBoundingClientRect();

    const targetCenterY = targetRect.top + targetRect.height / 2 - containerSvg.getBoundingClientRect().top;

    // Draw horizontal line from rowSq to targetSq
    const hLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    hLine.setAttribute("x1", rowRect.right - containerSvg.getBoundingClientRect().left);
    hLine.setAttribute("y1", targetCenterY);
    hLine.setAttribute("x2", targetRect.left - containerSvg.getBoundingClientRect().left);
    hLine.setAttribute("y2", targetCenterY);
    hLine.setAttribute("stroke", "lightblue");
    hLine.setAttribute("stroke-width", "2");
    containerSvg.appendChild(hLine);

    // Draw vertical line from colSq to targetSq
    const targetCenterX = targetRect.left + targetRect.width / 2 - containerSvg.getBoundingClientRect().left;
    const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    vLine.setAttribute("x1", targetCenterX);
    vLine.setAttribute("y1", colRect.bottom - containerSvg.getBoundingClientRect().top);
    vLine.setAttribute("x2", targetCenterX);
    vLine.setAttribute("y2", targetRect.top - containerSvg.getBoundingClientRect().top);
    vLine.setAttribute("stroke", "lightblue");
    vLine.setAttribute("stroke-width", "2");
    containerSvg.appendChild(vLine);
}
export function drawAesBlock(block, parentContainer, blockText="", mini=false, wValues=false) {
    const container = document.getElementById(parentContainer);
    container.innerHTML = "";
    container.style.display = "inline-block";
    for (let row = 0; row < 4; row++) {
        const rowEl = document.createElement("div");
        rowEl.className = mini ? "aes-row-mini" : `aes-row row-${row}`;
        if(mini) rowEl.classList.add("aes-row-mini");
        rowEl.dataset.row = row;

        for (let col = 0; col < 4; col++) {
            const index = row * 4 + col;
            const cell = document.createElement("div");
            cell.className = mini ? "aes-cell-mini" : "aes-cell";
            cell.dataset.index = index;
            cell.dataset.col = col;
            cell.dataset.row = row;
            cell.textContent = u8aToHexSpaced(block)[index];
            rowEl.appendChild(cell);

            if(col === 3 && wValues === true) {
                const cell = document.createElement("div");
                cell.className = "w-label";
                cell.textContent = `w[${row}]`;
                rowEl.appendChild(cell)
            }
        }
        container.appendChild(rowEl);
        if(block.length < 5) {break}; //only one row
    }
    if(blockText === "") return;
    const blockName = document.createElement("div");
    blockName.textContent = blockText;
    blockName.style.fontWeight = "bold";
    blockName.style.fontStyle = "italic";
    blockName.style.fontSize = "18px";
    blockName.style.textAlign = "center";
    blockName.style.marginTop = "15px";
    blockName.style.display = "inline-block";
    if(wValues === true) {
        blockName.style.paddingRight = "50px";
    }
    container.appendChild(blockName);
}
export function drawRconTable(frameID) {
    const container = document.getElementById(frameID);
    container.innerHTML = "";

    for(let i = 0; i < 2; i++) {
        const rowEl = document.createElement("div");
        rowEl.className = `rcon-row row-${i}`;
        
        const rowLabel = document.createElement("div");
        rowLabel.className = "rcon-row-label";
        rowLabel.textContent = i === 0 ? "Round#" : "rCi";
        container.appendChild(rowLabel);
        
        for(let col = 0; col < 11; col++) {
            const cell = document.createElement("div");
            cell.className = "aes-cell";
            cell.style.width = "40px";
            cell.style.height = "40px";
            cell.dataset.index = col;
            cell.dataset.col = col;
            cell.dataset.row = i;
            cell.textContent = i === 0 ? col : rCon[col][0];
            container.appendChild(cell);
        }
    }
}
export function drawRconVisual(frameID) {
    const container = document.getElementById(frameID);
    container.innerHTML = "";

    for(let i = 0; i < 3; i++) {
        const rowLabel = document.createElement("div");
        rowLabel.textContent = i === 0 ? "rC(1)" : "sbox output";
        rowLabel.className = `rcon-row row-${i}`;
        if(i === 2) {
            rowLabel.textContent = "rCon output"
            rowLabel.style.marginBottom = "100px"
        };
        container.appendChild(rowLabel);
        
        for(let col = 0; col < 4; col++) {
            const cell = document.createElement("div");
            cell.className = "aes-cell";
            cell.dataset.index = col;
            cell.textContent = i === 0 ? rCon[1][col] : result[col];
            if(i === 2) {
                cell.textContent = rConout[col];
                cell.style.marginLeft = "69px";
            }
            rowLabel.appendChild(cell);
        }
        container.appendChild(rowLabel);
    }
}
//This function is too big need to pull out some of the logic into a smaller util function
export function drawRconSvg(frameID) {
    const container = document.getElementById(frameID);
    const svg = document.getElementById("rCon-svg");
    svg.innerHTML = "";

    const row0 = Array.from(container.querySelectorAll(".row-0 .aes-cell"));
    const row1 = Array.from(container.querySelectorAll(".row-1 .aes-cell"));
    const row2 = Array.from(container.querySelectorAll(".row-2 .aes-cell"));
    

    const svgRect = svg.getBoundingClientRect();
    svgArrowHead(svg);

    for(let i = 0; i < 4; i++) {

        const row0Rect = row0[i].getBoundingClientRect();
        const row1Rect = row1[i].getBoundingClientRect();
        const row2Rect = row2[i].getBoundingClientRect();
        const midPoint = ((row0Rect.bottom - svgRect.top) + (row1Rect.top - svgRect.top)) / 2;

        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const line3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const line4 = document.createElementNS("http://www.w3.org/2000/svg", "line");

        line1.setAttribute("x1", row0Rect.left + row0Rect.width / 2 - svgRect.left);
        line1.setAttribute("y1", row0Rect.bottom - svgRect.top);
        line1.setAttribute("x2", row1Rect.left + row1Rect.width / 2 - svgRect.left);
        line1.setAttribute("y2", midPoint - 30);
        line1.setAttribute("stroke", "black");
        line1.setAttribute("stroke-width", "2");
        setTimeout(() => {
            line1.setAttribute("marker-end", "url(#arrowhead)");
            drawXorSymbolSvg(svg, row0Rect.left + row0Rect.width / 2 - svgRect.left, midPoint, 10);
        }, 1000);
        svg.appendChild(line1);

        const line1Length = line1.getTotalLength();
        line1.style.strokeDasharray = line1Length;
        line1.style.strokeDashoffset = line1Length;
        line1.style.transition = "stroke-dashoffset 1s ease-in-out";
        svg.appendChild(line1);
        void line1.getBoundingClientRect();
        line1.style.strokeDashoffset = 0;

        line2.setAttribute("x1", row1Rect.left + row0Rect.width / 2 - svgRect.left);
        line2.setAttribute("y1", (row1Rect.bottom - row1Rect.height) - svgRect.top);
        line2.setAttribute("x2", row1Rect.left + row1Rect.width / 2 - svgRect.left);
        line2.setAttribute("y2", midPoint + 30);
        line2.setAttribute("stroke", "black");
        line2.setAttribute("stroke-width", "2");
        setTimeout(() => {
            line2.setAttribute("marker-end", "url(#arrowhead)");
        }, 1000);
        svg.appendChild(line2);

        const line2Length = line2.getTotalLength();
        line2.style.strokeDasharray = line2Length;
        line2.style.strokeDashoffset = line2Length;
        line2.style.transition = "stroke-dashoffset 1s ease-in-out";
        svg.appendChild(line2);
        void line2.getBoundingClientRect();
        line2.style.strokeDashoffset = 0;

        setTimeout(() => {
            line3.setAttribute("x1", (row1Rect.left + row1Rect.width / 2 - svgRect.left));
            line3.setAttribute("y1", midPoint);;
            line3.setAttribute("x2", (row0Rect.left + row0Rect.width / 2 - svgRect.left) + 70);
            line3.setAttribute("y2", midPoint);
            line3.setAttribute("stroke", "black");
            line3.setAttribute("stroke-width", "2");
            svg.appendChild(line3);

            const line3Length = line3.getTotalLength();
            line3.style.strokeDasharray = line3Length;
            line3.style.strokeDashoffset = line3Length;
            line3.style.transition = "stroke-dashoffset 1s ease-in-out";
            svg.appendChild(line3);
            void line3.getBoundingClientRect();
            line3.style.strokeDashoffset = 0;
        }, 1000);

        setTimeout(() => {
            line4.setAttribute("x1", (row0Rect.left + row0Rect.width / 2 - svgRect.left) + 70);
            line4.setAttribute("y1", midPoint);
            line4.setAttribute("x2", (row1Rect.left + row1Rect.width / 2 - svgRect.left) + 70);
            line4.setAttribute("y2", (row2Rect.top - row2Rect.height / 2) - svgRect.top);
            line4.setAttribute("stroke", "black");
            line4.setAttribute("stroke-width", "2");

            setTimeout(() => {
                line4.setAttribute("marker-end", "url(#arrowhead)");
            }, 1000);
            svg.appendChild(line4);

            const line4Length = line4.getTotalLength();
            line4.style.strokeDasharray = line4Length;
            line4.style.strokeDashoffset = line4Length;
            line4.style.transition = "stroke-dashoffset 1s ease-in-out";
            svg.appendChild(line4);
            void line4.getBoundingClientRect();
            line4.style.strokeDashoffset = 0;
        }, 2000);
    }
}
export function keyExpansionXor() {
    const container = document.getElementById("key-expansion-xor-visual");
    container.innerHTML = "";

    for(let i = 0; i < 3; i++) {
        const containerEl = document.createElement("div");
        containerEl.id = `key-expansion-xor-text-${i}`;
        containerEl.className = "xor-text col-0";
        containerEl.style.position = "absolute";
        containerEl.style.top = `${i * 250 + 15}px`;
        containerEl.textContent = i === 0 ? "k0 = " : i === 1 ? "rCon output" : "Next key (k1) = ";
        containerEl.style.fontWeight = "bold";
        container.appendChild(containerEl); 
        if(i === 1) {
            containerEl.style.top = `315px`;
            drawAesBlock(rConout, containerEl.id, "rCon output", true, false)
        }
    }
    for(let i = 0; i < 8; i++) {
        const ele = document.createElement("div");
        ele.className = `aes-ele aes-ele-${i}`;
        ele.id = `key-expansion-xor-ele-${i}`;
        ele.style.textAlign = "center";
        ele.style.position = "absolute";
        ele.style.left = `${300 + (i % 4) * 250}px`;
        if(i > 3) {
            ele.style.top = `500px`;
        } else {
            ele.style.top = `0px`;
        }
        container.appendChild(ele);
        drawAesBlock(i < 4 ? u8aToHexSpaced(key).slice(i * 4, (i * 4) + 4) : expandedKey.subarray((i * 4), (i * 4) + 4), ele.id, i < 4 ? `w${i}` : `w${i}`, true, false);
    }
}
//rewrite the keyExpansionXpo function so it can be easier to use for the animaiton 
export function keyExpansionXor1() {
    const container = document.getElementById("key-expansion-xor-visual");
    container.innerHTML = "";

    for(let i = 0; i < 3; i++) {
        const textEl = document.createElement("div");
        textEl.id = "key-expansion-xor-text";
        textEl.className = `xor-text num-${i}`;
        textEl.style.position = "absolute";
        textEl.style.top = `${i * 250 + 15}px`;
        if(i === 1) { textEl.style.top = `350px`; }
        textEl.textContent = i === 0 ? "k0 = " : i === 1 ? "rCon output" : "Next key (k1) = ";
        textEl.style.fontWeight = "bold";
        container.appendChild(textEl);
    }
    for(let i = 0; i < 8; i++) {
        const wEle = document.createElement("div");
        wEle.className = `key-expansion-xor w-aes-ele-${i}`;
        wEle.id = `key-expansion-xor-w-ele-${i}`;
        wEle.textContent = `w${i}`;
        wEle.style.textAlign = "center";
        wEle.style.fontWeight = "bold";
        wEle.style.position = "absolute";
        wEle.style.left = `${430 + (i % 4) * 250}px`;
        if(i > 3) {
            wEle.style.top = `505px`;
        }
        container.appendChild(wEle);
    }
    const rConEle = document.createElement("div");
    rConEle.id = "key-expansion-xor-rcon-ele";
    rConEle.style.position = "absolute";
    rConEle.style.top = `315px`;
    container.appendChild(rConEle);
    drawAesBlock(rConout, rConEle.id, "", true, false);
    for(let i = 0; i < 8; i++) {
        const ele = document.createElement("div");
        ele.className = `key-expansion-xor aes-ele`;
        ele.id = `key-expansion-xor-ele-${i}`;
        ele.style.textAlign = "center";
        ele.style.position = "absolute";
        ele.style.left = `${300 + (i % 4) * 250}px`;
        if(i > 3) { 
            ele.style.top = `500px`;
            ele.style.opacity = "0";
        }
        container.appendChild(ele);
        drawAesBlock(i < 4 ? u8aToHexSpaced(key).slice(i * 4, (i * 4) + 4) : expandedKey.subarray((i * 4), (i * 4) + 4), ele.id, "", true, false);
    }

}
export function keyExpansionXorSvg() {
    const container = document.getElementById("key-expansion-xor-visual");
    const svg = document.getElementById("key-expansion-xor-svg");
    // Don't clear `container` here — `keyExpansionXor()` builds the DOM nodes.
    svg.innerHTML = "";

    // Select the cell elements inside each row
    const allEle = Array.from(container.querySelectorAll(".aes-ele"));
    const rConOutput = container.querySelector("#key-expansion-xor-rcon-ele");
    const svgRect = svg.getBoundingClientRect();
    svgArrowHead(svg);

    //const count = Math.min(4, row0.length, row2.length);
    for (let i = 0; i < 4; i++) {
        const eleRect0 = allEle[i].getBoundingClientRect();
        const eleRect1 = allEle[i + 4].getBoundingClientRect();
        const rConRect = rConOutput.getBoundingClientRect();

        const xOrX = eleRect0.left + eleRect0.width / 2 - svgRect.left;
        const xOrY = rConRect.top - svgRect.top + 20;
        drawXorSymbolSvg(svg, xOrX, xOrY, 10);

        if(i === 0) {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.id = "rcon-line-0";
            line.classList.add("svg-line");
            line.setAttribute("x1", xOrX - 200);
            line.setAttribute("y1", xOrY);
            line.setAttribute("x2", xOrX - 45);
            line.setAttribute("y2", xOrY);
            line.setAttribute("marker-end", "url(#arrowhead)");
            line.setAttribute("stroke", "black");
            line.setAttribute("stroke-width", "2");
            svg.appendChild(line);
        }
        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line1.id = "rcon-line-1";
        line1.classList.add("svg-line");
        line1.setAttribute("x1", eleRect0.left + eleRect0.width / 2 - svgRect.left);
        line1.setAttribute("y1", eleRect0.bottom - svgRect.top + 20);
        line1.setAttribute("x2", eleRect1.left + eleRect1.width / 2 - svgRect.left);
        line1.setAttribute("y2", xOrY - 40);
        line1.setAttribute("marker-end", "url(#arrowhead)");
        line1.setAttribute("stroke", "black");
        line1.setAttribute("stroke-width", "2");
        svg.appendChild(line1);

        const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line2.id = "rcon-line-2";
        line2.classList.add("svg-line");
        line2.setAttribute("x1", eleRect0.left + eleRect0.width / 2 - svgRect.left);
        line2.setAttribute("y1", xOrY + 20);
        line2.setAttribute("x2", eleRect1.left + eleRect1.width / 2 - svgRect.left);
        line2.setAttribute("y2", eleRect1.top - svgRect.top - 30);
        line2.setAttribute("marker-end", "url(#arrowhead)");
        line2.setAttribute("stroke", "black");
        line2.setAttribute("stroke-width", "2");
        svg.appendChild(line2);

        if(i === 3) break;
        const line3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line3.id = "rcon-line-3";
        line3.classList.add("svg-line");
        line3.setAttribute("x1", eleRect0.left + eleRect0.width / 2 - svgRect.left);
        line3.setAttribute("y1", eleRect1.top - svgRect.top + 50);
        line3.setAttribute("x2", eleRect1.left + eleRect1.width / 2 - svgRect.left);
        line3.setAttribute("y2", eleRect1.top - svgRect.top + 100);
        line3.setAttribute("stroke", "black");
        line3.setAttribute("stroke-width", "2");
        svg.appendChild(line3);

        const line4 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line4.id = "rcon-line-4";
        line4.classList.add("svg-line");
        line4.setAttribute("x1", eleRect0.left + eleRect0.width / 2 - svgRect.left);
        line4.setAttribute("y1", eleRect1.top - svgRect.top + 100);
        line4.setAttribute("x2", eleRect1.left + eleRect1.width / 2 - svgRect.left + 120);
        line4.setAttribute("y2", eleRect1.top - svgRect.top + 100);
        line4.setAttribute("stroke", "black");
        line4.setAttribute("stroke-width", "2");
        svg.appendChild(line4);

        const line5 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line5.id = "rcon-line-5";
        line5.classList.add("svg-line");
        line5.setAttribute("x1", eleRect1.left + eleRect1.width / 2 - svgRect.left + 120);
        line5.setAttribute("y1", eleRect1.top - svgRect.top + 100);
        line5.setAttribute("x2", eleRect1.left + eleRect1.width / 2 - svgRect.left + 120);
        line5.setAttribute("y2", eleRect1.top - svgRect.top - 165);
        line5.setAttribute("stroke", "black");
        line5.setAttribute("stroke-width", "2");
        svg.appendChild(line5);

        const line6 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line6.id = "rcon-line-6";
        line6.classList.add("svg-line");
        line6.setAttribute("x1", eleRect1.left + eleRect1.width / 2 - svgRect.left + 120);
        line6.setAttribute("y1", eleRect1.top - svgRect.top - 165);
        line6.setAttribute("x2", eleRect1.left + eleRect1.width / 2 - svgRect.left + 205);
        line6.setAttribute("y2", eleRect1.top - svgRect.top - 165);
        line6.setAttribute("marker-end", "url(#arrowhead)");
        line6.setAttribute("stroke", "black");
        line6.setAttribute("stroke-width", "2");
        svg.appendChild(line6);
    }
}
export function drawMixColumnsMathHeader(cell) {
    const container = document.getElementById("mix-columns-visual-math-header");
    const containerFooter = document.getElementById("mix-columns-visual-math-footer");
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
        termMathP.appendChild(document.createElement("br"));

        termMathP.append(`= ${multiplyBinaryPolynomials(parseInt(fixedMatrix[cellRow][i], 16).toString(2).padStart(8, '0'), parseInt(targetCols[i].textContent, 16).toString(2).padStart(8, '0'))}`);
        termMathP.appendChild(document.createElement("br"));

        if (termMathP.textContent.includes("X^8")) {
            termMathP.append(`= ${reduceAESPolynomial(multiplyBinaryPolynomials(parseInt(fixedMatrix[cellRow][i], 16).toString(2).padStart(8, '0'), parseInt(targetCols[i].textContent, 16).toString(2).padStart(8, '0')))}`);
            termMathP.appendChild(document.createElement("br"));
        };

        termMathP.append(`= ${polynomialToBinary(reduceAESPolynomial(multiplyBinaryPolynomials(parseInt(fixedMatrix[cellRow][i], 16).toString(2).padStart(8, '0'), parseInt(targetCols[i].textContent, 16).toString(2).padStart(8, '0'))))}`);

        containerMath.appendChild(termMath);
        termMath.appendChild(termMathP);
    }
    for(let i = 0; i < 4; i++) {
        const term = document.createElement("div");
        term.className = "mix-columns-math-term";
        term.textContent = `${polynomialToBinary(reduceAESPolynomial(multiplyBinaryPolynomials(parseInt(fixedMatrix[cellRow][i], 16).toString(2).padStart(8, '0'), parseInt(targetCols[i].textContent, 16).toString(2).padStart(8, '0'))))}`;
        containerFooter.appendChild(term);

        if(i === 3) {
            term.textContent = `= ${parseInt(cell.textContent, 16).toString(2).padStart(8, '0')} = ${cell.textContent}`;
        }

        if(i === 3) break;  
        const xOR = document.createElement("div");
        xOR.className = "mix-columns-math-xor";
        xOR.textContent = "⊕";
        containerFooter.appendChild(xOR);
    }
}
export function fullAesExample() {
    const container = document.getElementById("full-round-example-visual");
    container.innerHTML = "";

    const headerVals = [
        "Round<br>Number",
        "Startof<br>Round",
        "After<br>subBytes",
        "After<br>shiftRows",
        "After<br>mixColumns",
        "xOR w/<br>Round Key"
    ];

    const headerRow = document.createElement("div");
    headerRow.className = "full-aes-example-header";

    headerVals.forEach(val => {
        const headerCell = document.createElement("div");
        headerCell.innerHTML = val;
        headerRow.appendChild(headerCell);
    });
    container.appendChild(headerRow);

    for(let i = 0; i < 12; i++) {
        const row = document.createElement("div");
        row.className = "full-aes-example-row";
        row.style.alignItems = "center";
        for(let j = 0; j < 6; j++) {
            const cell = document.createElement("div");
            cell.id = `full-aes-example-cell-r${i}-c${j}`;
            row.appendChild(cell);
            switch(j) {
                case 0:
                    cell.textContent = `${i}`;
                    if(i === 0) { cell.textContent = "input"; }     
                    if(i === 11) { cell.textContent = "Output"; }                  
                break;
                case 1:
                    if(i === 0) {
                        container.appendChild(row);
                        drawAesBlock(u8aToHexSpaced(rowToColumnWise(pt)), cell.id, "", true);
                        break;
                    }
                    if(i === 11) {
                        container.appendChild(row);
                        drawAesBlock(u8aToHexSpaced(rowToColumnWise(resultCypher)), cell.id, "", true);
                        return;
                    }
                    row.appendChild(cell);
                    container.appendChild(row);
                    drawAesBlock(u8aToHexSpaced(rowToColumnWise(allAfterAddRoundKey[i - 1])), cell.id, "", true);                    
                break;
                case 2:
                    if(i === 0) {
                        container.appendChild(row);
                        cell.textContent = "<---------";
                        break;
                    }
                    row.appendChild(cell);
                    container.appendChild(row);
                    drawAesBlock(u8aToHexSpaced(rowToColumnWise(allAfterSubBytes[i - 1])), cell.id, "", true);    
                break;
                case 3:
                    if(i === 0) {
                        container.appendChild(row);
                        cell.textContent = "Initial Transformation";
                        break;
                    }
                    row.appendChild(cell);
                    container.appendChild(row);
                    drawAesBlock(u8aToHexSpaced(rowToColumnWise(allAfterShiftRows[i - 1])), cell.id, "", true);    
                break;
                case 4:
                    if(i === 0) {
                        container.appendChild(row);
                        cell.textContent = "--------->";
                        break;
                    }
                    if(i === 10) {
                        cell.textContent = "MixColumns Skipped";
                        break;
                    }
                    row.appendChild(cell);
                    container.appendChild(row);
                    drawAesBlock(u8aToHexSpaced(rowToColumnWise(allAfterMixColumns[i - 1])), cell.id, "", true);    
                break;
                case 5:
                    if(i === 0) {
                        container.appendChild(row);
                        drawAesBlock(u8aToHexSpaced(key), cell.id, "", true);
                        break;
                    }
                    row.appendChild(cell);
                    container.appendChild(row);
                    drawAesBlock(u8aToHexSpaced(rowToColumnWise(expandedKey.subarray(i*16, (i+1)*16))), cell.id, "", true);    
                break;
            }
        }
    }
}
function drawXorSymbolSvg(svg, cx, cy, radius = 10) {
    const ns = "http://www.w3.org/2000/svg";
    const group = document.createElementNS(ns, "g");
    // Circle
    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", radius);
    circle.setAttribute("stroke", "black");
    circle.setAttribute("stroke-width", "3");
    circle.setAttribute("fill", "none");
    // Horizontal line
    const hLine = document.createElementNS(ns, "line");
    hLine.setAttribute("x1", cx - radius);
    hLine.setAttribute("y1", cy);
    hLine.setAttribute("x2", cx + radius);
    hLine.setAttribute("y2", cy);
    hLine.setAttribute("stroke", "black");
    hLine.setAttribute("stroke-width", "3");
    // Vertical line
    const vLine = document.createElementNS(ns, "line");
    vLine.setAttribute("x1", cx);
    vLine.setAttribute("y1", cy - radius);
    vLine.setAttribute("x2", cx);
    vLine.setAttribute("y2", cy + radius);
    vLine.setAttribute("stroke", "black");
    vLine.setAttribute("stroke-width", "3");
    group.append(circle, hLine, vLine);
    svg.appendChild(group);
    return group;
}
export function drawAddRoundKeyLine(s1, s2, s3) {
    const svg = document.getElementById("add-round-key-svg");
    svg.innerHTML = "";

    const sq1 = s1.getBoundingClientRect();
    const sq2 = s2.getBoundingClientRect();
    const sq3 = s3.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    const sq1X = sq1.left + (sq1.width / 2) - svgRect.left;
    const sq1Y = sq1.top + (sq1.height / 2) - svgRect.top;
    const sq2X = sq2.left + (sq2.width / 2) - svgRect.left;
    const sq2Y = sq2.top + (sq2.height / 2) - svgRect.top;
    const sq3X = sq3.left + (sq3.width / 2) - svgRect.left;
    const sq3Y = sq3.top + (sq3.height / 2) - svgRect.top;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const meetingPointX = (sq1X + (5 * sq1.width));
    const meetingPointY = (sq2Y - sq1Y) / 2 + sq1Y;

    function createCurve(svg, startX, startY, ctrlX, ctrlY, endX, endY) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute(
            "d",
            `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`
        );
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", "3");
        path.setAttribute("fill", "none");
        svg.appendChild(path);
        return path;
    }

    const path1 = createCurve(svg, sq1X, sq1Y, meetingPointX, sq1Y, meetingPointX, meetingPointY);
    const path2 = createCurve(svg, sq2X, sq2Y, meetingPointX, sq2Y, meetingPointX, meetingPointY);
    const path3 = createCurve(svg, meetingPointX + 15, meetingPointY, meetingPointX, meetingPointY, sq3X, sq3Y);

    [path1, path2, path3].forEach(path => {
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;
        path.style.transition = "stroke-dashoffset 0.75s ease";
        svg.appendChild(path);

        // Trigger animation
        requestAnimationFrame(() => {
            path.style.strokeDashoffset = 0;
        });
    });

    function animatePath(path, delay = 0) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.transition = "stroke-dashoffset 0.75s ease";

        requestAnimationFrame(() => {
            setTimeout(() => {
                path.style.strokeDashoffset = 0;
            }, delay);
        });
    }

    animatePath(path1);
    animatePath(path2);
    animatePath(path3, 1500);

    drawXorSymbolSvg(svg, meetingPointX, meetingPointY, 15);

    const calcContainer = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    calcContainer.setAttribute("x", meetingPointX + 25); // subtract half width to center
    calcContainer.setAttribute("y", meetingPointY + 25); // subtract half height
    calcContainer.setAttribute("width", 250);
    calcContainer.setAttribute("height", 100);
    calcContainer.setAttribute("fill", "#9aff9a");
    calcContainer.setAttribute("stroke", "black");
    svg.appendChild(calcContainer);

    function drawSvgText(svg, x, y, content) {
        const ns = "http://www.w3.org/2000/svg";
        const text = document.createElementNS(ns, "text");

        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("text-anchor", "center");
        text.setAttribute("dominant-baseline", "hanging");

        text.textContent = content;

        svg.appendChild(text);
        return text;
    }
    drawSvgText(svg, calcContainer.getBoundingClientRect().left - calcContainer.getBoundingClientRect().width / 2, meetingPointY + 30, `${s1.textContent} ⊕ ${s2.textContent}`);
    drawSvgText(svg, meetingPointX + 50, meetingPointY + 50, `${parseInt(s1.textContent, 16).toString(2).padStart(8, '0')} ⊕ ${parseInt(s1.textContent, 16).toString(2).padStart(8, '0')}`);
}
export function drawSvgLine(fromSq, toSq, frameID) {
    const svg = document.getElementById(frameID);
    if(frameID !== "sbox-visual-svg") {
        svg.innerHTML = "";
    }
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
export function drawSboxVisualLines() {
    const row1 = document.getElementById("sbox-visual-row1")
    const row2 = document.getElementById("sbox-visual-row2")
    const svg = document.getElementById("sbox-visual-svg");
    svg.style.zIndex = "-1";

    const cells1 = Array.from(row1.querySelectorAll(".aes-cell"));
    const cells2 = Array.from(row2.querySelectorAll(".aes-cell"));
    for(let i = 0; i < 4; i++) {
        drawSvgLine(cells1[i], cells2[i], "sbox-visual-svg")
    }
}
