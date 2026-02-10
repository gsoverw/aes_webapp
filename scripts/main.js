import "./newAESLogic.js"
import { u8aToHexSpaced, iniBlock, allAfterSubBytes, allAfterShiftRows, allAfterMixColumns, rowToColumnWise, allAfterAddRoundKey, pt } from "./newAESLogic.js"
import { keySchedule, drawAesBlock, fullAesExample, drawKeyExpansionTable, drawSbox,
         drawSboxVisualLines, drawRconTable, drawRconVisual, drawRconSvg, keyExpansionXor, keyExpansionXorSvg, keyExpansionXor1 } from "./draw.js";
import { subBytesArrowAnimation, shiftRowsAnimationClick, mixColumnsMathClick, 
         addRoundKeyAnimation, rotWordAnimation, newSboxAnimation, keyExpansionXorAnimation } from "./animations.js";
import { roundKeys } from "./aesLogic.js"
import { expandedKey, key, afterAllRotWord, afterAllSubWord } from "./newAESLogic.js";


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
//sboxExampleAnimation();

drawAesBlock(u8aToHexSpaced(afterAllRotWord[0]), "sbox-visual-row1")
drawAesBlock(u8aToHexSpaced(afterAllSubWord[0]), "sbox-visual-row2")


drawSbox();
newSboxAnimation();
drawSboxVisualLines()

drawRconTable("rCon-block1");
drawRconVisual("rCon-block2");
drawRconSvg("rCon-block2");

//keyExpansionXor();
keyExpansionXor1();
keyExpansionXorSvg();
keyExpansionXorAnimation();
drawKeyExpansionTable();

//drawArrayBlock(u8aToHexSpaced(expandedKey.subarray(16, 32)), 1, "k1Canvas")

drawAesBlock(u8aToHexSpaced(pt), "ITV-block1", "plaintext", false)
drawAesBlock(u8aToHexSpaced(key), "ITV-block2", "k0", false)
drawAesBlock(u8aToHexSpaced(iniBlock), "ITV-block3", "stateArray", false)

drawAesBlock(rowToColumnWise(iniBlock), "sub-bytes-visual-block1", "stateArray")
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



