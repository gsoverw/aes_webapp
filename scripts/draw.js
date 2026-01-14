import { boxSize, offset, sboxAxisHx, sboxAxisHy,
         sboxTargetH, sboxAxisVx, sboxAxisVy, sboxTargetV, speed
        } from "./animations.js"

import { SBOX_FRAME_1, SBOX_FRAME_3 } from "./animations.js";
import { roundKeys } from "./aesLogic.js"

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

    ctx.fillStyle = "rgb(128 128 128)"
    ctx.fillRect(xpos, ypos, w, h);
    ctx.fillStyle = "black";
    ctx.font = `${fontSize}px Arial`;;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, xpos + (w / 2), ypos + (h / 2));
}

export function drawArrayBlock(arrBlock, kVal, frameID) {
    const canvas = document.getElementById(frameID);
    const ctx = canvas.getContext('2d');
    let spacingRows = 40;

    ctx.fillStyle = "black";
    ctx.font = "20px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("k" + kVal + " =", 25, 70);

    for(let i = 0; i < 4; i++) {

        ctx.fillStyle = "black";
        ctx.font = "18px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("w" + i, 100, 15 + (spacingRows * i));
        
        for(let j = 0; j < 4; j++) {
            drawSquare(30, 30, arrBlock[i][j], 18, 130 + (40 * j), 0 + (spacingRows * i), frameID, false)
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
//#d8d8d8             
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

export function drawxOR(arr1, arr2, arr3, frameID) {

    for(let i = 0; i < 4; i++) {
        drawSquare(30, 30, arr1[i], 18, 1 + (100 * i), 0, frameID)
        drawSquare(30, 30, arr2[i], 18, (100 * i), 150, frameID)

        drawXorCircle(16, 90, 15, frameID);
        drawXorCircle(16 + (100 * i), 90, 15, frameID);

        drawArrow(16 + (100 * i), 30, 16 + (100 * i), 75, false, "down", frameID);
        drawArrow(16 + (100 * i), 150, 16 + (100 * i), 105, false, "up", frameID);
        drawArrow(16 + (100 * i), 90, 61 + (100 * i), 90, true, "right", frameID);
        drawArrow(61 + (100 * i), 90, 61 + (100 * i), 225, false, "down", frameID);

        drawSquare(30, 30, arr3[i], 18, 46 + (100 * i), 225, frameID);
    }
}

