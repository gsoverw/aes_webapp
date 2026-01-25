import { drawHAxisBox, drawVAxisBox, drawResult, drawSboxExample, drawSBox, drawSvgLine, drawMixColumnsMathHeader } from "./draw.js"

export let boxSize = 30;
export let offset = boxSize * 1.42;
export let startingXPOS = 25;
export let highlightBoxSize = boxSize + 10;
export let sboxAxisHx = 95;
export let sboxAxisHy = 20;
export let sboxTargetH = null;
export let sboxAxisVx = 20;
export let sboxAxisVy = 95;
export let sboxTargetV = null;
export let speed = 5;

export let SBOX_FRAME_1 = "sboxframe1";
export let SBOX_FRAME_2 = "sboxframe2";
export let SBOX_FRAME_3 = "sboxframe3";

export function setSBoxFrames(f1, f2, f3) {
    SBOX_FRAME_1 = f1;
    SBOX_FRAME_2 = f2;
    SBOX_FRAME_3 = f3;
}

export function resetSBoxAnimation() {
    sboxAxisHx = 95;
    sboxAxisHy = 20;
    sboxTargetH = null

    sboxAxisVx = 20;
    sboxAxisVy = 95;
    sboxTargetV = null;
}

let hAnimationId = null;
let vAnimationId = null;
let animationRunning = false;

function updateAxisH(byteVal) {

    let locationX = parseInt(byteVal[1], 16)

    if(sboxTargetH === null) {
        sboxTargetH = (100 +  offset * locationX) - 5;
    }

    if(sboxAxisHx < sboxTargetH) {
        sboxAxisHx += speed;
        if(sboxAxisHx > sboxTargetH) sboxAxisHx = sboxTargetH;
    }
}

function updateAxisV(byteVal) {

    let locationY = parseInt(byteVal[0], 16)

    if(sboxTargetV === null) {
        sboxTargetV = (100 + offset * locationY) - 5;
    }

    if(sboxAxisVx < sboxTargetV) {
        sboxAxisVy += speed;
        if(sboxAxisVy > sboxTargetV) sboxAxisVy = sboxTargetV;
    }
}

function animateH(byteVal) {
    drawHAxisBox();
    updateAxisH(byteVal);

    hAnimationId = requestAnimationFrame(() => animateH(byteVal));
}

function animateV(byteVal) {
    drawVAxisBox();
    updateAxisV(byteVal);

    vAnimationId = requestAnimationFrame(() => animateV(byteVal));
}

export function startSBoxAnimation(byteVal) {
    if(animationRunning) return;
    animationRunning = true;

    animateH(byteVal);
    animateV(byteVal);
    drawResult();
}

export function stopSBoxAnimation() {
    animationRunning = false;

    cancelAnimationFrame(hAnimationId);
    cancelAnimationFrame(vAnimationId);

    
    const frame1 = document.getElementById(SBOX_FRAME_1);
    const ctx1 = frame1.getContext("2d");
    ctx1.clearRect(0, 0, frame1.width, frame1.height);

    const frame3 = document.getElementById(SBOX_FRAME_3);
    const ctx3 = frame3.getContext("2d");
    ctx3.clearRect(0, 0, frame3.width, frame3.height);

    resetSBoxAnimation();
}

const sboxPanel = document.getElementById("sBoxPanel");

function slideInSBox(byteVal, hoverID) {
    let hover;

    if(typeof hoverID === "string") {
        hover = document.getElementById(hoverID);
    } else { 
        hover = hoverID;
    }

    // MOUSE ENTER → SLIDE IN
    hover.addEventListener("mouseenter", () => {
        // Switch animation frames to slide panel canvases
        setSBoxFrames("slideSboxFrame1", "slideSboxFrame2", "slideSboxFrame3");

        // Draw fresh S-box into panel
        drawSBox("slideSboxFrame2");

        // Animate sliding in
        sboxPanel.style.right = "150px";

        startSBoxAnimation(byteVal);
    });

    // MOUSE LEAVE → SLIDE OUT
    hover.addEventListener("mouseleave", () => {
        // Animate sliding out
        sboxPanel.style.right = "-950px";

        // Stop animation
        stopSBoxAnimation();

        // Clear the panel canvases
        ["slideSboxFrame1","slideSboxFrame2","slideSboxFrame3"].forEach(id => {
            const c = document.getElementById(id);
            c.getContext("2d").clearRect(0, 0, c.width, c.height);
        });

        // Switch back to original S-box area frames
        setSBoxFrames("sboxframe1", "sboxframe2", "sboxframe3");
    });
}
export function attachSBoxHover(cell, byteVal) {
    const sboxPanel = document.getElementById("sBoxPanel");

    // Avoid attaching multiple listeners
    if (cell.dataset.sboxAttached) return;
    cell.dataset.sboxAttached = "true";

    cell.addEventListener("mouseenter", () => {
        // Switch animation frames to slide panel canvases
        setSBoxFrames("slideSboxFrame1", "slideSboxFrame2", "slideSboxFrame3");

        // Draw fresh S-box into panel
        drawSBox("slideSboxFrame2");

        // Animate sliding in
        sboxPanel.style.right = "150px";

        // Start the axis animation
        startSBoxAnimation(byteVal);
    });

    cell.addEventListener("mouseleave", () => {
        // Animate sliding out
        sboxPanel.style.right = "-950px";

        // Stop the animation
        stopSBoxAnimation();

        // Clear the panel canvases
        ["slideSboxFrame1","slideSboxFrame2","slideSboxFrame3"].forEach(id => {
            const c = document.getElementById(id);
            c.getContext("2d").clearRect(0, 0, c.width, c.height);
        });

        // Switch back to original S-box area frames
        setSBoxFrames("sboxframe1", "sboxframe2", "sboxframe3");
    });
}

export function sboxExampleAnimation() {
    drawSboxExample()
    slideInSBox("cf", "sboxHover0");
    slideInSBox("4f", "sboxHover1");
    slideInSBox("3c", "sboxHover2");
    slideInSBox("09", "sboxHover3");
}
export function subBytesArrowAnimation() {
    const block1 = document.getElementById("sub-bytes-visual-block1");
    const block2 = document.getElementById("sub-bytes-visual-block2");
    const svg = document.getElementById("sub-bytes-svg");

    let lastTargetCell = null;

    block1.addEventListener("mouseover", (e) => {
        const cell = e.target.closest(".aes-cell");
        if (!cell) return;

        const index = cell.dataset.index;
        const targetCell = block2.querySelector(`.aes-cell[data-index="${index}"]`);
        if (!targetCell) return;

        if(lastTargetCell && lastTargetCell !== targetCell) {
            lastTargetCell.classList.remove("target-highlight");
        }
        targetCell.classList.add("target-highlight");
        lastTargetCell = targetCell;

        drawSvgLine(cell, targetCell);
        
        slideInSBox(cell.textContent, cell);
    });
    block1.addEventListener("mouseleave", () => {
        if (lastTargetCell) {
            lastTargetCell.classList.remove("target-highlight");
            lastTargetCell = null;
        }
        svg.innerHTML = "";
    });
}
export function animateShiftRows(blockID, rowIndex) {
    if (rowIndex === 0) {return}
    const row = document.querySelector(
        `#${blockID} .aes-row[data-row="${rowIndex}"]`
    );
    const cells = Array.from(row.querySelectorAll(".aes-cell"));

    cells[0].classList.add("curve-move");
    cells[1].style.transition = "transform 1.5s ease";
    cells[1].style.transform = `translateX(-55px)`;
    cells[2].style.transition = "transform 1.5s ease";
    cells[2].style.transform = `translateX(-55px)`;
    cells[3].style.transition = "transform 1.5s ease";
    cells[3].style.transform = `translateX(-55px)`;

    if(rowIndex === 1) {return}
    setTimeout(() => {
        cells[1].classList.add("curve-move");
        cells[2].style.transition = "transform 2s ease";
        cells[2].style.transform = `translateX(-110px)`;
        cells[3].style.transition = "transform 2s ease";
        cells[3].style.transform = `translateX(-110px)`;
        cells[0].style.transition = "transform 2s ease";
        cells[0].style.transform = `translateX(-55px)`;
    }, 2000);

    if(rowIndex === 2) {return}
    setTimeout(() => {
        cells[2].classList.add("curve-move");
        cells[3].style.transition = "transform 2.5s ease";
        cells[3].style.transform = `translateX(-165px)`;
        cells[0].style.transition = "transform 2.5s ease";
        cells[0].style.transform = `translateX(-110px)`;
        cells[1].style.transition = "transform 2.5s ease";
        cells[1].style.transform = `translateX(-110px)`;
    }, 4000);
}
export function shiftRowsAnimationClick () {
    const block = document.getElementById("shift-rows-visual-block1");
    const rows = block.querySelectorAll(".aes-row");

    rows.forEach(row => {
        row.addEventListener("click", () => {
            const rowIndex = parseInt(row.dataset.row);
            console.log("Hovered row: " + rowIndex);
            animateShiftRows("shift-rows-visual-block1", rowIndex);
        });
        row.addEventListener("mouseleave", () => {
            const cells = block.querySelectorAll(".aes-cell");    
            cells.forEach(cell => {
                cell.style.transition = ""; 
                cell.style.transform = "";
                cell.style.position = "";
                cell.classList.remove("curve-move");
                cell.style.zIndex = "";
            });
        });
    });
}
export function mixColumnsMathClick() {
    const block = document.getElementById("mix-columns-visual-block3");
    const cells = block.querySelectorAll(".aes-cell");

    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            drawMixColumnsMathHeader(cell);
        });
    });
}