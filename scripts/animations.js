import { drawHAxisBox, drawVAxisBox, drawResult, drawSboxExample, drawSBox, drawSvgLine } from "./draw.js"

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
        //attachSBoxHover(cell, cell.textContent);
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
export function animateShiftRows(blockID, row) {

    const cells = Array.from(
       document.querySelectorAll(`#${blockID} .aes-cell`)
    );

    const start = row * 4;
    const cellArr = cells.slice(start, start + 4);

    let first = cellArr[0];
    let rest = cellArr.slice(1);
    let cellSize = cellArr[0].getBoundingClientRect().width;

    const timeouts = [];

    function enlarge() {
        cellArr.forEach((cell, index) => {
            cell.style.transition = "transform 0.75s ease";
            cell.style.transform = `scale(${1.5}) translateX(${(cellSize / 2.75 * index) - 27.5}px)`;
        });
    }
    if(row === 0) {
        enlarge();
        return;
    }
    function shift(shiftAmount) {
        enlarge();

        const t1 = setTimeout(() => {
            requestAnimationFrame(() => {
                rest.forEach((cell, index) => {
                    cell.style.transition = "transform 1s ease";
                    cell.style.transform = `scale(${1.5}) translateX(${((cellSize / 2.75 * index) - 36) - cellSize + 22}px)`;
                });
                first.classList.add("curve-move");
            });
        }, 1500);
        timeouts.push(t1);

        if(shiftAmount !== 1) {
            const t2 = setTimeout(() => {
                cellArr[1].classList.add("curve-move");
                cellArr[2].style.transition = "transform 2s ease";
                cellArr[2].style.transform = `scale(${1.5}) translateX(${-(cellSize * 2)}px)`;
                cellArr[3].style.transition = "transform 2s ease";
                cellArr[3].style.transform = `scale(${1.5}) translateX(${-(cellSize * 1.5 + 7.5)}px)`;
                cellArr[0].style.transition = "transform 2s ease";
                cellArr[0].style.transform = `scale(${1.5}) translateX(${-(cellSize * 1.5 + 7.5)}px)`;
            }, 3500); // 1500 + 2000
            timeouts.push(t2);
        }

        if(shiftAmount !== 2) {
            const t3 = setTimeout(() => {
                cellArr[2].classList.add("curve-move");
                cellArr[3].style.transition = "transform 2s ease";
                cellArr[3].style.transform = `scale(${1.5}) translateX(${-(cellSize * 2.75)}px)`;
                cellArr[0].style.transition = "transform 2s ease";
                cellArr[0].style.transform = `scale(${1.5}) translateX(${-(cellSize * 2.75)}px)`;
                cellArr[1].style.transition = "transform 2s ease";
                cellArr[1].style.transform = `scale(${1.5}) translateX(${-(cellSize * 2.75 - 16.5)}px)`;
            }, 5500); // 1500 + 2000 + 2000
            timeouts.push(t3);
        }
    }
    shift(row);

    return {
        cancel: () => {
            timeouts.forEach(t => clearTimeout(t));
        }
    };
}

export function shiftRowsAnimation() {
    const block = document.getElementById("shift-rows-visual-block1");
    let currentRow = null;
    let currentAnimation = null;

    block.addEventListener("mouseover", (e) => {
        const cells = block.querySelectorAll(".aes-cell");
        const cell = e.target.closest(".aes-cell");
        
        if (!cell) return;

        const index = cell.dataset.index;
        const row = Math.floor(index / 4);

        if (row === currentRow) return;
        currentRow = row;

        if(currentAnimation) currentAnimation.cancel();

        cells.forEach(cell => {
            cell.style.position = "relative";
            cell.style.zIndex = "1000";
        });
        currentAnimation = animateShiftRows("shift-rows-visual-block1", row);
    });
    block.addEventListener("mouseleave", () => {
        currentRow = null;

        if(currentAnimation) currentAnimation.cancel();
        currentAnimation = null;

        const cells = block.querySelectorAll(".aes-cell");    
        cells.forEach(cell => {
            cell.style.transition = "transform 0.5s ease"; 
            cell.style.transform = "scale(1) translateX(0)"; 
            cell.classList.remove("curve-move");
            cell.style.zIndex = ""; // reset z-index
        });
    });
}