const SBOX = new Uint8Array([
  0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
  0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
  0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
  0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
  0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
  0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
  0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
  0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
  0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
  0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
  0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
  0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
  0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
  0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
  0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
  0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16
]);

export const RCON = new Uint8Array([
  0x00, // unused
  0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36
]);

const ptHex = "3243f6a8885a308d313198a2e0370734"
const keyHex = "2b7e151628aed2a6abf7158809cf4f3c";

export const expandedKey = new Uint8Array(176);

export let gFunctionValues = []
export let tempValues = []


function hexToU8A(hex) {
    if (hex.length !== 32) {
        throw new Error("The hex sting length is not 32");
    }
    const returnU8A = new Uint8Array(16);

    for (let i = 0; i < 16; i++) {
        returnU8A[i] = parseInt(hex.substr(i * 2, 2), 16);
    }

    return returnU8A;
}
export function u8aToHexSpaced(u8a) {
    //to fix the commas in the full expansion visaul add a ".join("");" at the end of the return 
    return Array.from(u8a, b =>
        b.toString(16).padStart(2, "0")
    );
}

export const key = hexToU8A(keyHex);
export const pt = hexToU8A(ptHex);
console.log("key:   " + key)
console.log("pt:   " + pt)


export const afterAllRotWord = [];
export const afterAllSubWord = [];
export const afterAllGOut = [];

function keyExpantion(k0) {
    if (!(k0 instanceof Uint8Array) || key.length !== 16) {
        throw new Error("key is not of type Uint8Array or its length is not 16");
    }
    //const expandedKey = new Uint8Array(176);

    //writes k0 into the expanded key
    expandedKey.set(k0, 0)

    let totalBytes = 16
    let roundNumber = 1
    let word = new Uint8Array(4);

    for(let i = 0; i < 43; i++) {
        for(let j = 0; j < 8; j++) {

        }
    }
    while (totalBytes < 176) {
        
        //Creates the current word we are working with
        word.set(expandedKey.subarray(totalBytes - 4, totalBytes));
        if(totalBytes === 16) tempValues.push(u8aToHexSpaced(word))

        //If the total number of bytes is a factor of 16, then it means we are at the start of a new key.
        //If it is that means our previous word is the last word in the key.
        //The last word of each key is what goes through the rotWord, sBox and rCon transformations.
        if(totalBytes % 16 === 0) {
            let afterRotWord;
            let afterSbox;
            let afterRcon;
            const temp = word[0]

            word[0] = word[1]
            word[1] = word[2]
            word[2] = word[3]
            word[3] = temp

            afterRotWord = word;
            afterAllRotWord.push(u8aToHexSpaced(afterRotWord))
            
            //sbox subtitution
            for(let i = 0; i < 4; i++) {
                word[i] = SBOX[word[i]]
            }
            afterSbox = word;
            afterAllSubWord.push(u8aToHexSpaced(afterSbox))
            
            //rCon
            word[0] ^= RCON[roundNumber];
            roundNumber++;

            afterRcon = word;
            afterAllGOut.push(u8aToHexSpaced(afterRcon))
        }
        for(let i = 0; i < 4; i++) {
            expandedKey[totalBytes] = expandedKey[totalBytes - 16] ^ word[i];
            totalBytes++;
        }
        tempValues.push(u8aToHexSpaced(expandedKey.subarray(totalBytes - 4, totalBytes)));
    }
}
console.log(u8aToHexSpaced(expandedKey));
keyExpantion(key)

export function initialTransformation(pt, key) {
    const trasformedBlock = new Uint8Array(pt.length)

    for(let i = 0; i < pt.length; i++) {
        trasformedBlock[i] = pt[i] ^ key[i];
    }
    return trasformedBlock;
}

export const iniBlock = initialTransformation(pt, key)
console.log("iniBlock: " + u8aToHexSpaced(iniBlock))


function subBytes(iniBlock) {
    const afterSubBytes = new Uint8Array(iniBlock.length)

    for(let i = 0; i < iniBlock.length; i++) {
        afterSubBytes[i] = SBOX[iniBlock[i]];
    }
    return afterSubBytes;
}
//console.log(u8aToHexSpaced(initialTransformation(pt, key)))
//console.log("after subBytes: " + u8aToHexSpaced(subBytes(initialTransformation(pt, key))));

function shiftRows(block) {
    const src = block.slice();

    // row 0: no shift
    block[0]  = src[0];
    block[4]  = src[4];
    block[8]  = src[8];
    block[12] = src[12];

    // row 1: shift left by 1
    block[1]  = src[5];
    block[5]  = src[9];
    block[9]  = src[13];
    block[13] = src[1];

    // row 2: shift left by 2
    block[2]  = src[10];
    block[6]  = src[14];
    block[10] = src[2];
    block[14] = src[6];

    // row 3: shift left by 3
    block[3]  = src[15];
    block[7]  = src[3];
    block[11] = src[7];
    block[15] = src[11];

    return block
}

//shiftRows(subBytes(initialTransformation(pt, key)))

function xtime(x) {
    return ((x << 1) ^ ((x & 0x80) ? 0x1b : 0x00)) & 0xff;
}

function mixSingleColumn(block, c) {
    const i = c * 4;
    const e0 = block[i];
    const e1 = block[i + 1]
    const e2 = block[i + 2]
    const e3 = block[i + 3]

    const t = e0  ^ e1  ^ e2  ^ e3;
    const temp = e0;
    
    block[i] ^= t ^ xtime(e0 ^ e1);
    block[i + 1] ^= t ^ xtime(e1 ^ e2);
    block[i + 2] ^= t ^ xtime(e2 ^ e3);
    block[i + 3] ^= t ^ xtime(e3 ^ temp);
}   

function mixColumns(block) {
    for(let i = 0; i < 4; i++) {
        mixSingleColumn(block, i)
    }
    return block
}

export const allAfterSubBytes = [];
export const allAfterShiftRows = [];
export const allAfterMixColumns = [];
export const allAfterAddRoundKey = [];

allAfterAddRoundKey.push(iniBlock.slice());

function aesEncryption(pt) {
    let state = initialTransformation(pt, key);
    let nextState = new Uint8Array(16);
    let cypherText = new Uint8Array(16);

    for(let i = 1; i < 10; i++) {
        let afterSubBytes = subBytes(state);
        allAfterSubBytes.push(afterSubBytes.slice());

        let afterShiftRows =  shiftRows(afterSubBytes);
        allAfterShiftRows.push(afterShiftRows.slice());
        

        let afterMixCol = mixColumns(afterShiftRows);
        allAfterMixColumns.push(afterMixCol.slice());

        for(let j = 0; j < state.length; j++) {
            nextState[j] = afterMixCol[j] ^ expandedKey[j + (16 * i)]
            
        }
        state = nextState;
        allAfterAddRoundKey.push(state.slice());
    }
    for(let i = 0; i < state.length; i++) {
        cypherText[i] = shiftRows(subBytes(state))[i] ^ expandedKey[(expandedKey.length - 16) + i]
    }
    return cypherText
}

aesEncryption(pt)
export const resultCypher = aesEncryption(pt);
console.log(u8aToHexSpaced(aesEncryption(pt)))
//console.log(u8aToHexSpaced(allAfterSubBytes[0]))
//console.log(u8aToHexSpaced(allAfterShiftRows[1]))

console.log(tempValues);

export function rowToColumnWise(state) {
    if (state.length !== 16) {
        throw new Error("AES state must be 16 bytes");
    }
    const result = new Array(16);
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            result[col * 4 + row] = state[row * 4 + col];
        }
    }
    return result;
}

