import "./newAESLogic.js"
import { u8aToHexSpaced, iniBlock, allAfterSubBytes, allAfterShiftRows, allAfterMixColumns, rowToColumnWise, allAfterAddRoundKey } from "./newAESLogic.js"
import { keySchedule, drawRcon, drawxOR, rCon, drawArrayBlock, sliderArrows, 
    drawInitialTransformation, drawAesBlock, fullAesExample, drawKeyExpansionTable, drawSboxLines } from "./draw.js";
import { sboxExampleAnimation, subBytesArrowAnimation, shiftRowsAnimationClick, mixColumnsMathClick, 
         addRoundKeyAnimation, rotWordAnimation, newSboxAnimation } from "./animations.js";
import { roundKeys } from "./aesLogic.js"
import { expandedKey, key, afterAllRotWord, afterAllSubWord } from "./newAESLogic.js";


const rConout = ["8b", "84", "eb", "01"];
const result = ["8a", "84", "eb", "01"];
const test2 = ["sbox", "sbox", "sbox", "sbox"]
const fixedMatrix = [
    0x02, 0x03, 0x01, 0x01,
    0x01, 0x02, 0x03, 0x01,
    0x01, 0x01, 0x02, 0x03,
    0x03, 0x01, 0x01, 0x02
];

drawAesBlock(u8aToHexSpaced(key), "k0", "k0", false, true)

keySchedule();

drawAesBlock(u8aToHexSpaced(expandedKey.subarray(12, 16)), "rotWord-visual", "w[3]");
rotWordAnimation();
sboxExampleAnimation();

drawAesBlock(u8aToHexSpaced(afterAllRotWord[0]), "sbox-visual-row1")
drawAesBlock(u8aToHexSpaced(afterAllSubWord[0]), "sbox-visual-row2")


drawSboxLines()
newSboxAnimation()

drawRcon("rConCanvas0");
drawxOR(rCon[1], result, rConout, ["rC1", "sb", "out"], "rConCanvas1");

//Drawings for the 'Last Part div'
drawxOR(rConout, roundKeys[0][0], roundKeys[1][0], ["g()", "w0", "w4"], "slideCanvas0");
drawxOR(roundKeys[1][0], roundKeys[0][1], roundKeys[1][1], ["w4", "w1", "w5"], "slideCanvas1");
drawxOR(roundKeys[1][1], roundKeys[0][2], roundKeys[1][2], ["w5", "w2", "w6"], "slideCanvas2");
drawxOR(roundKeys[1][2], roundKeys[0][2], roundKeys[1][3], ["w6", "w3", "w7"], "slideCanvas3");

drawKeyExpansionTable();


//drawArrayBlock(u8aToHexSpaced(expandedKey.subarray(0, 31)), 0, "k0Canvas")

sliderArrows("slideArrowCanvas1")
sliderArrows("slideArrowCanvas2")
sliderArrows("slideArrowCanvas3")

drawArrayBlock(u8aToHexSpaced(expandedKey.subarray(16, 32)), 1, "k1Canvas")

//drawFullKeyExpansion(30, "keCalculation")

drawInitialTransformation("itVisual")

drawAesBlock(iniBlock, "sub-bytes-visual-block1", "stateArray")
drawAesBlock(u8aToHexSpaced(rowToColumnWise(allAfterSubBytes[0])), "sub-bytes-visual-block2", "After subBytes")

drawAesBlock(u8aToHexSpaced(rowToColumnWise(allAfterSubBytes[0])), "shift-rows-visual-block1", "After subBytes")
drawAesBlock(u8aToHexSpaced(rowToColumnWise(allAfterShiftRows[0])), "shift-rows-visual-block2", "After shiftRows")

drawAesBlock(u8aToHexSpaced(rowToColumnWise(allAfterShiftRows[0])), "mix-columns-visual-block1", "After shiftRows")
drawAesBlock(fixedMatrix, "mix-columns-visual-block2", "MixColumns Fixed Matrix")
drawAesBlock(u8aToHexSpaced(rowToColumnWise(allAfterMixColumns[0])), "mix-columns-visual-block3", "After MixColumns")

drawAesBlock(u8aToHexSpaced(rowToColumnWise(allAfterMixColumns[0])), "add-round-key-visual-block1", "After MixColumns")
drawAesBlock(u8aToHexSpaced(expandedKey.subarray(16, 32)), "add-round-key-visual-block2", "Round Key")
drawAesBlock(u8aToHexSpaced(rowToColumnWise(allAfterAddRoundKey[0])), "add-round-key-visual-block3", "After AddRoundKey")


subBytesArrowAnimation();

shiftRowsAnimationClick();

mixColumnsMathClick();

addRoundKeyAnimation();

fullAesExample();



