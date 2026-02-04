import { drawSvgLine, drawMixColumnsMathHeader, drawAddRoundKeyLine, newSboxDraw } from "./draw.js"

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
