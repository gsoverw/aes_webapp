import "./newAESLogic.js"
import { u8aToHexSpaced, iniBlock, allAfterSubBytes } from "./newAESLogic.js"
import { keySchedule, drawRcon, drawxOR, rCon, drawArrayBlock, sliderArrows, drawFullKeyExpansion, 
    drawInitialTransformation, drawAesBlock } from "./draw.js";
import { sboxExampleAnimation, subBytesArrowAnimation, animateShiftRows, shiftRowsAnimation } from "./animations.js";
import { rotWordHover } from "./rotWordAnimation.js";
import { roundKeys } from "./aesLogic.js"
import { expandedKey } from "./newAESLogic.js";


const rConout = ["8b", "84", "eb", "01"];
const result = ["8a", "84", "eb", "01"];
const test2 = ["sbox", "sbox", "sbox", "sbox"]

keySchedule();
rotWordHover("rotWordAnimation");
drawAesBlock(u8aToHexSpaced(expandedKey.subarray(12, 16)), "rotWordAnimation2")
sboxExampleAnimation();
drawRcon("rConCanvas0");
drawxOR(rCon[1], result, rConout, ["rC1", "sb", "out"], "rConCanvas1");

//Drawings for the 'Last Part div'
drawxOR(rConout, roundKeys[0][0], roundKeys[1][0], ["g()", "w0", "w4"], "slideCanvas0");
drawxOR(roundKeys[1][0], roundKeys[0][1], roundKeys[1][1], ["w4", "w1", "w5"], "slideCanvas1");
drawxOR(roundKeys[1][1], roundKeys[0][2], roundKeys[1][2], ["w5", "w2", "w6"], "slideCanvas2");
drawxOR(roundKeys[1][2], roundKeys[0][2], roundKeys[1][3], ["w6", "w3", "w7"], "slideCanvas3");


drawArrayBlock(u8aToHexSpaced(expandedKey.subarray(0, 31)), 0, "k0Canvas")

sliderArrows("slideArrowCanvas1")
sliderArrows("slideArrowCanvas2")
sliderArrows("slideArrowCanvas3")

drawArrayBlock(u8aToHexSpaced(expandedKey.subarray(16, 32)), 1, "k1Canvas")

drawFullKeyExpansion(30, "keCalculation")

drawInitialTransformation("itVisual")


drawAesBlock(iniBlock, "sub-bytes-visual-block1")
drawAesBlock(u8aToHexSpaced(allAfterSubBytes[0]), "sub-bytes-visual-block2")
drawAesBlock(u8aToHexSpaced(allAfterSubBytes[0]), "shift-rows-visual-block1")

subBytesArrowAnimation();

//animateShiftRows("shift-rows-visual-block1", 3);

shiftRowsAnimation();
//shiftRowsHover("shift-rows-visual-block1");

