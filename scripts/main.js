import { keySchedule, drawRcon, drawxOR, rCon, drawArrayBlock } from "./draw.js";
import { sboxExampleAnimation } from "./animations.js";
import { rotWordHover } from "./rotWordAnimation.js";
import { roundKeys } from "./aesLogic.js"

const rConout = ["8b", "84", "eb", "01"];
const result = ["8a", "84", "eb", "01"];
const test2 = ["sbox", "sbox", "sbox", "sbox"]

keySchedule();
rotWordHover("rotWordAnimation");
sboxExampleAnimation();
drawRcon("rConCanvas0");
drawxOR(rCon[1], result, rConout, "rConCanvas1");

//Drawings for the 'Last Part div'
drawxOR(rConout, roundKeys[0][0], roundKeys[1][0], "slideCanvas0");
drawxOR(roundKeys[1][0], roundKeys[0][1], roundKeys[1][1], "slideCanvas1");
drawxOR(roundKeys[1][1], roundKeys[0][2], roundKeys[1][2], "slideCanvas2");
drawxOR(roundKeys[1][2], roundKeys[0][2], roundKeys[1][3], "slideCanvas3");


drawArrayBlock(roundKeys[0], 1, "k0Canvas")
