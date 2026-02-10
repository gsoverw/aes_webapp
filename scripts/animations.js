import { drawSvgLine, drawMixColumnsMathHeader, drawAddRoundKeyLine, newSboxDraw, rCon } from "./draw.js"
import { animate, utils, stagger, createTimeline } from 'https://esm.sh/animejs';


export function addRoundKeyAnimation() {
    const block1 = document.getElementById("add-round-key-visual-block1");
    const block2 = document.getElementById("add-round-key-visual-block2");
    const block3 = document.getElementById("add-round-key-visual-block3");
    const svg = document.getElementById("add-round-key-svg");

    let lastTargetCell = null;
    block1.addEventListener("mouseover", (e) => {
        const cell = e.target.closest(".aes-cell");
        if (!cell) return;
        const index = cell.dataset.index;
        const targetCell = block2.querySelector(`.aes-cell[data-index="${index}"]`);
        if (!targetCell) return;
        const resultCell = block3.querySelector(`.aes-cell[data-index="${index}"]`);
        if (!resultCell) return;

        if(lastTargetCell && lastTargetCell !== targetCell) {
            lastTargetCell.classList.remove("target-highlight");
        }
        targetCell.classList.add("target-highlight");
        lastTargetCell = targetCell;

        drawAddRoundKeyLine(cell, targetCell, resultCell);
    });
    block1.addEventListener("mouseleave", () => {
        if(lastTargetCell) {
            lastTargetCell.classList.remove("target-highlight");
            lastTargetCell = null;
        }
        svg.innerHTML = "";
    });
}
export function subBytesArrowAnimation() {
    const block1 = document.getElementById("sub-bytes-visual-block1");
    const block2 = document.getElementById("sub-bytes-visual-block2");
    const sboxWrapper = document.getElementById("sbox-slider-wrapper");
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

        drawSvgLine(cell, targetCell, "sub-bytes-svg");
        
        //slideInSBox(cell.textContent, cell);
        newSboxDraw(cell.textContent);
        sboxWrapper.style.display = "block";    
        sboxWrapper.style.right = "150px";
        
    });
    block1.addEventListener("mouseleave", () => {
        if (lastTargetCell) {
            lastTargetCell.classList.remove("target-highlight");
            lastTargetCell = null;
        }
        sboxWrapper.style.display = "none";
        sboxWrapper.style.right = "-950px";
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
export function rotWordAnimation() {
    const row = document.getElementById("rotWord-visual")
    row.addEventListener("click", () => {
        const cells = Array.from(row.querySelectorAll(".aes-cell"));
        cells.forEach(cell => {
            cell.classList.remove("aes-cell:hover");
        });
        cells[0].classList.add("curve-move");
        cells[1].style.transition = "transform 1.5s ease";
        cells[1].style.transform = `translateX(-55px)`;
        cells[2].style.transition = "transform 1.5s ease";
        cells[2].style.transform = `translateX(-55px)`;
        cells[3].style.transition = "transform 1.5s ease";
        cells[3].style.transform = `translateX(-55px)`;
    });
    document.addEventListener("click", (e) => {
        if (!row.contains(e.target)) {
            const cells = Array.from(row.querySelectorAll(".aes-cell"));
            cells.forEach(cell => {
                cell.style.transition = ""; 
                cell.style.transform = "";
                cell.style.position = "";
                cell.classList.remove("curve-move");
                cell.style.zIndex = "";
            });
        }
    });
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
    const containerMath = document.getElementById("mix-columns-visual-math");
    const containerFooter = document.getElementById("mix-columns-visual-math-footer");

    cells.forEach(cell => {
        const stateArray = document.getElementById("mix-columns-visual-block1");
        const fixedMatrixArray = document.getElementById("mix-columns-visual-block2");

        cell.addEventListener("click", () => {
            containerMath.innerHTML = "";
            containerFooter.innerHTML = "";
            drawMixColumnsMathHeader(cell);
        });
    });
}
export function newSboxAnimation() {
    const wrapper = document.getElementById("sbox-slider-wrapper");
    const row1 = document.getElementById("sbox-visual-row1");
    const cells = Array.from(row1.querySelectorAll(".aes-cell"));

    cells.forEach(cell => {
        cell.addEventListener("mouseover", () => {
            //slideInSBox(cell.textContent, cell);
            newSboxDraw(cell.textContent)
            wrapper.style.display = "block";
            wrapper.style.right = "150px";
        });
        cell.addEventListener("mouseout", () => {
            wrapper.style.display = "none";
            wrapper.style.right = "-950px";
        });
    });
}
export function keyExpansionXorAnimation() {
    const container = document.getElementById("key-expansion-xor-visual");
    const buttonPlay = document.getElementById("expansionXorPlayButton");
    const buttonPause = document.getElementById("expansionXorPauseButton");

    const rConOut = document.querySelector("#key-expansion-xor-rcon-ele")
    const svg = document.getElementById("key-expansion-xor-svg");

    const lines = Array.from(svg.getElementsByClassName("svg-line"));

    const clone = rConOut.cloneNode(true);
    clone.id = "rConOut-clone";
    clone.style.opacity = "0.5";
    clone.style.zIndex = "-5";    
    rConOut.parentNode.appendChild(clone);

    const cellBlocks = Array.from(container.querySelectorAll(".aes-ele"));
    const cellBlocksCells = cellBlocks.map(block =>
        Array.from(block.querySelectorAll(".aes-cell-mini"))
    );
    console.log(cellBlocks);

    const rConOutCells = Array.from(rConOut.querySelectorAll(".aes-cell-mini"));
    console.log(rConOutCells);

    cellBlocks.forEach(block => {
        const clone = block.cloneNode(true);
        clone.classList.add("aes-cell-clone");
        clone.id = `${block.id}-clone`;
        clone.style.opacity = "0.5";
        clone.style.zIndex = "-1";
        if( block.id === `key-expansion-xor-ele-4` || block.id === `key-expansion-xor-ele-5` || block.id === `key-expansion-xor-ele-6` || block.id === `key-expansion-xor-ele-7` ) {
            clone.style.transform = "translateY(-140px)";
            clone.style.opacity = "0";
        }
        block.parentNode.appendChild(clone);
    });

    const cloneCells = Array.from(container.querySelectorAll(".aes-cell-clone"));

    //move this function to utils.js and reuse for other animations
    function addVerticalShift(tl, targets, offset = 0) {
      tl.add(targets, {
        x: (el, i) => i * -30,
        y: (el, i) => i * 30,
        duration: 1000
      }, offset);
    }

    const t1 = createTimeline({
         autoplay: false,
        });

    t1.label("start")
        //moving into position
        .add(rConOut, { x: "300px", y: "-40px", duration: 2000, easing: 'ease', autoplay: false}, 0)
        .add(cellBlocks[0], { x: "80px", y: "275px", duration: 2000, easing: 'ease', autoplay: false}, 0)

        //lines fade out
        .add(lines[0], {opacity: 0.025, duration: 500, easing: 'ease', autoplay: false}, 2500)
        .add(lines[1], {opacity: 0.025, duration: 500, easing: 'ease', autoplay: false}, 2500)
        .add(lines[2], {opacity: 0.025, duration: 500, easing: 'ease', autoplay: false}, 2500)

        //xor animation
        .add(rConOut, { x: "340px", duration: 2500, easing: 'ease', autoplay: false}, 3000)
        .add(cellBlocks[0], { x: "40px", duration: 2500, easing: 'ease', autoplay: false,
        }, 3000)

        //fading out
        .add(rConOut, { opacity: 0, duration: 1000, easing: 'ease', autoplay: false}, 4500)
        .add(cellBlocks[0], { opacity: 0, duration: 1000, easing: 'ease', autoplay: false}, 4500)

        //w4-clone fade in and move into position
        .add(cloneCells[4], { opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 5000)
        .add(cloneCells[4], { y: "0px", duration: 1500, easing: 'ease', autoplay: false,

        }, 6000)

        //w[4] moves into position
        .add(cellBlocks[4], { 
            keyframes: [
                { y: '80px', easing: 'easeInOut', duration: 750 },
                { x: '120px', easing: 'easeInOut', duration: 500, delay: 100 },
                { y: '-225px', easing: 'easeInOut', duration: 500,delay: 100 },
                { x: '250px', easing: 'easeInOut', duration: 500, delay: 100 },
            ], onBegin: () => {cellBlocks[4].style.opacity = "1", cloneCells[4].style.opacity = "0.5"}}, 8000)

        //lines fade in
        .add(lines[0], {opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 7000)
        .add(lines[1], {opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 7000)
        .add(lines[2], {opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 7000)

        //w[1] moves into position
        .add(cellBlocks[1], { x: "80px", y: "275px", duration: 2000, easing: 'ease', autoplay: false}, 8250)

        //[w4] XOR [w1] animation
        .add(cellBlocks[4], { x: "295px", duration: 2650, easing: 'ease', autoplay: false}, 11000)
        .add(cellBlocks[1], { x: "40px", duration: 2500, easing: 'ease', autoplay: false}, 11000)

        .add(lines[6], {opacity: 0.025, duration: 500, easing: 'ease', autoplay: false}, 11000)
        .add(lines[7], {opacity: 0.025, duration: 500, easing: 'ease', autoplay: false}, 11000)
        .add(lines[8], {opacity: 0.025, duration: 500, easing: 'ease', autoplay: false}, 11000)

        //fading out w1 and w4
        .add(cellBlocks[4], { opacity: 0, duration: 1000, easing: 'ease', autoplay: false}, 12500)
        .add(cellBlocks[1], { opacity: 0, duration: 1000, easing: 'ease', autoplay: false}, 12500)

        //w5-clone fade in and move into position
        .add(cloneCells[5], { opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 13500)
        .add(cloneCells[5], { y: "0px", duration: 1500, easing: 'ease', autoplay: false}, 13500)

        .add(cellBlocks[5], { 
            keyframes: [
                { y: '80px', easing: 'easeInOut', duration: 750 },
                { x: '120px', easing: 'easeInOut', duration: 500, delay: 100 },
                { y: '-225px', easing: 'easeInOut', duration: 500,delay: 100 },
                { x: '250px', easing: 'easeInOut', duration: 500, delay: 100 },
            ], onBegin: () => {cellBlocks[5].style.opacity = "1", cloneCells[5].style.opacity = "0.5"}}, 15000)

        .add(lines[6], {opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 14500)
        .add(lines[7], {opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 14500)
        .add(lines[8], {opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 14500)

        //w2 moves into position
        .add(cellBlocks[2], { x: "80px", y: "275px", duration: 2000, easing: 'ease', autoplay: false}, 15250)

        //[w5] XOR [w2] animation
        .add(cellBlocks[5], { x: "295px", duration: 2500, easing: 'ease', autoplay: false}, 18000)
        .add(cellBlocks[2], { x: "40px", duration: 2500, easing: 'ease', autoplay: false}, 18000)

        .add(lines[12], {opacity: 0.025, duration: 500, easing: 'ease', autoplay: false}, 18000)
        .add(lines[13], {opacity: 0.025, duration: 500, easing: 'ease', autoplay: false}, 18000)
        .add(lines[14], {opacity: 0.025, duration: 500, easing: 'ease', autoplay: false}, 18000)

        ////fading out w5 and w2
        .add(cellBlocks[5], { opacity: 0, duration: 1000, easing: 'ease', autoplay: false}, 19500)
        .add(cellBlocks[2], { opacity: 0, duration: 1000, easing: 'ease', autoplay: false}, 19500)

        //w6-clone fade in and move into position
        .add(cloneCells[6], { opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 20500)
        .add(cloneCells[6], { y: "0px", duration: 1500, easing: 'ease', autoplay: false}, 20500)

        .add(cellBlocks[6], { 
            keyframes: [
                { y: '80px', easing: 'easeInOut', duration: 750 },
                { x: '120px', easing: 'easeInOut', duration: 500, delay: 100 },
                { y: '-225px', easing: 'easeInOut', duration: 500,delay: 100 },
                { x: '250px', easing: 'easeInOut', duration: 500, delay: 100 },
            ], onBegin: () => {cellBlocks[6].style.opacity = "1", cloneCells[6].style.opacity = "0.5"}}, 22000)

        .add(lines[12], {opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 21500)
        .add(lines[13], {opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 21500)
        .add(lines[14], {opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 21500)

        //w3 moves into position
        .add(cellBlocks[3], { x: "80px", y: "275px", duration: 2000, easing: 'ease', autoplay: false}, 22250)

        //[w6] XOR [w3] animation
        .add(cellBlocks[6], { x: "290px", duration: 2500, easing: 'ease', autoplay: false}, 25000)
        .add(cellBlocks[3], { x: "40px", duration: 2500, easing: 'ease', autoplay: false}, 25000)

        .add(lines[18], {opacity: 0.025, duration: 500, easing: 'ease', autoplay: false}, 25000)
        .add(lines[19], {opacity: 0.025, duration: 500, easing: 'ease', autoplay: false}, 25000)
        .add(lines[20], {opacity: 0.025, duration: 500, easing: 'ease', autoplay: false}, 25000)

        //fading out w6 and w3
        .add(cellBlocks[6], { opacity: 0, duration: 1000, easing: 'ease', autoplay: false}, 26500)
        .add(cellBlocks[3], { opacity: 0, duration: 1000, easing: 'ease', autoplay: false}, 26500)

        //w7-clone fade in and move into position
        .add(cloneCells[7], { opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 27500)
        .add(cloneCells[7], { y: "0px", duration: 1500, easing: 'ease', autoplay: false}, 27500)

        .add(lines[18], {opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 28500)
        .add(lines[19], {opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 28500)
        .add(lines[20], {opacity: 1, duration: 500, easing: 'ease', autoplay: false}, 28500)

    addVerticalShift(t1, rConOutCells, 0);
    addVerticalShift(t1, cellBlocksCells[0], 0);
    addVerticalShift(t1, cellBlocksCells[1], 8250);
    addVerticalShift(t1, cellBlocks[4].querySelectorAll(".aes-cell-mini"), 9350);
    addVerticalShift(t1, cellBlocks[5].querySelectorAll(".aes-cell-mini"), 16350);
    addVerticalShift(t1, cellBlocks[6].querySelectorAll(".aes-cell-mini"), 23350);
    addVerticalShift(t1, cellBlocksCells[2], 15250);
    addVerticalShift(t1, cellBlocksCells[3], 22250);

    const playAnimation = () => t1.play();
    const pauseAnimation = () => t1.pause();

    const seekInput = document.getElementById("t1Seek");

    seekInput.addEventListener("input", (e) => {
        const seekValue = parseFloat(e.target.value);
        const totalDuration = t1.duration;
        const seekTime = (seekValue / 100) * totalDuration;
        t1.seek(seekTime);
    });

    t1.update = () => {
        const progress = (t1.currentTime / t1.duration) * 100;
        seekInput.value = progress;
    };

    buttonPlay.addEventListener("click", playAnimation);
    buttonPause.addEventListener("click", pauseAnimation);
}