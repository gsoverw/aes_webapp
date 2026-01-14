import { drawHAxisBox, drawVAxisBox, drawResult, drawSboxExample, drawSBox } from "./draw.js"

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
    const hover = document.getElementById(hoverID);

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

export function sboxExampleAnimation() {
    drawSboxExample()
    slideInSBox("cf", "sboxHover0");
    slideInSBox("4f", "sboxHover1");
    slideInSBox("3c", "sboxHover2");
    slideInSBox("09", "sboxHover3");
}
