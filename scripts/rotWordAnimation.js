const test = ["09", "cf", "4f", "3c"]

let rectangles = [
  { xPOS: 0, yPOS: 0, width: 40, height: 40, byteVal: '' },
  { xPOS: 60, yPOS: 0, width: 40, height: 40, byteVal: '' }, 
  { xPOS: 120, yPOS: 0, width: 40, height: 40, byteVal: '' },
  { xPOS: 180, yPOS: 0, width: 40, height: 40, byteVal: '' },
];

let margin = 10;
let gap = 10;
let phase = 0;
let speed = 2;

let animationRunning = false;
let animationIdFrame1 = null;
let animationIdFrame2 = null;

for(let i = 0; i < 4; i++) {
    rectangles[i].byteVal = test[i]
}

function resetRotWordAnimation() {
    rectangles[0].xPOS = 0;
    rectangles[0].yPOS = 0;

    rectangles[1].xPOS = 60;
    rectangles[1].yPOS = 0;

    rectangles[2].xPOS = 120;
    rectangles[2].yPOS = 0;

    rectangles[3].xPOS = 180;
    rectangles[3].yPOS = 0;

    phase = 0;  
}

export function drawFrame1() {

    let rect = rectangles[0]

    const canvas = document.getElementById("rotWordCanvas0");
    const ctx = canvas.getContext('2d');    

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgb(128 128 128)"
    ctx.fillRect(rectangles[0].xPOS, rectangles[0].yPOS, rectangles[0].width, rectangles[0].height)

    ctx.fillStyle = "black";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(rect.byteVal, rect.xPOS + rect.width / 2, rect.yPOS + rect.height / 2);

}

export function drawFrame2() {

    const canvas = document.getElementById("rotWordCanvas1");
    const ctx = canvas.getContext('2d');    

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgb(128 128 128)"

    for(let i = 1; i < 4; i++) {
        ctx.fillRect(rectangles[i].xPOS, rectangles[i].yPOS, rectangles[i].width, rectangles[i].height)

        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(rectangles[i].byteVal, rectangles[i].xPOS + rectangles[i].width / 2, rectangles[i].yPOS + rectangles[i].height / 2);
        ctx.fillStyle = "rgb(128 128 128)"; 
    }
    
}

function updateFrame1() {
        if (phase === 0) {              // MOVE DOWN
        rectangles[0].yPOS += speed;
        if (rectangles[0].yPOS >= 50) {
            rectangles[0].yPOS = 50;
            phase = 1;
        }
    }

    else if (phase === 1) {         // MOVE RIGHT
        rectangles[0].xPOS += speed;
        if (rectangles[0].xPOS >= 160) {
            rectangles[0].xPOS = 160;
            phase = 2;
        }
    }

    else if (phase === 2) {         // MOVE UP
        rectangles[0].yPOS -= speed;
        if (rectangles[0].yPOS <= 0) {
            rectangles[0].yPOS = 0; // Original Y
            phase = 3;               // Done
        }
    }
}

function updateFrame2() {

    let startPOS = margin;
    let speed = 1;

    for(let i = 1; i < 4; i++) {
        if(rectangles[i].xPOS > startPOS) {
            rectangles[i].xPOS -= speed;
        }
        if(rectangles[i].xPOS < startPOS) {
            rectangles[i].xPOS = startPOS;
        }
        startPOS += rectangles[i].width + gap;
       
    }

}
function animateFrame1() {
    drawFrame1()
    updateFrame1()
    animationIdFrame1 = requestAnimationFrame(() => animateFrame1());
}

function animateFrame2() {
    drawFrame2()
    updateFrame2()
    animationIdFrame2 = requestAnimationFrame(() => animateFrame2());
}


export function startRotWordAnimation() {
    if(animationRunning) return;
    animationRunning = true;

    animateFrame1();
    animateFrame2();
}

export function stopRotWordAnimation() {
    animationRunning = false;

    cancelAnimationFrame(animationIdFrame1);
    cancelAnimationFrame(animationIdFrame2);

    resetRotWordAnimation();

    drawFrame1();
    drawFrame2();

}

export function rotWordHover(frameID) {
    const hoverFrame = document.getElementById(frameID)
    
    //This is so the rotWord array shows up on the page before the animaiton starts
    drawFrame1()
    drawFrame2()

    hoverFrame.addEventListener("mouseenter", () => {
        startRotWordAnimation();
    });

    hoverFrame.addEventListener("mouseleave", () => {
        stopRotWordAnimation();
    });
};
