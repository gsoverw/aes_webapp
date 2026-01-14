const plainText = "Coding is great!";
const originalKey = "AI is the future";
const testPT = "32 43 f6 a8 88 5a 30 8d 31 31 98 a2 e0 37 07 34"
const testKey = "2b 7e 15 16 28 ae d2 a6 ab f7 15 88 09 cf 4f 3c"
const keyArray = testKey;

const sBox = [
    ['63', '7c', '77', '7b', 'f2', '6b', '6f', 'c5', '30', '01', '67', '2b', 'fe', 'd7', 'ab', '76'],
    ['ca', '82', 'c9', '7d', 'fa', '59', '47', 'f0', 'ad', 'd4', 'a2', 'af', '9c', 'a4', '72', 'c0'],
    ['b7', 'fd', '93', '26', '36', '3f', 'f7', 'cc', '34', 'a5', 'e5', 'f1', '71', 'd8', '31', '15'],
    ['04', 'c7', '23', 'c3', '18', '96', '05', '9a', '07', '12', '80', 'e2', 'eb', '27', 'b2', '75'],
    ['09', '83', '2c', '1a', '1b', '6e', '5a', 'a0', '52', '3b', 'd6', 'b3', '29', 'e3', '2f', '84'],
    ['53', 'd1', '00', 'ed', '20', 'fc', 'b1', '5b', '6a', 'cb', 'be', '39', '4a', '4c', '58', 'cf'],
    ['d0', 'ef', 'aa', 'fb', '43', '4d', '33', '85', '45', 'f9', '02', '7f', '50', '3c', '9f', 'a8'],
    ['51', 'a3', '40', '8f', '92', '9d', '38', 'f5', 'bc', 'b6', 'da', '21', '10', 'ff', 'f3', 'd2'],
    ['cd', '0c', '13', 'ec', '5f', '97', '44', '17', 'c4', 'a7', '7e', '3d', '64', '5d', '19', '73'],
    ['60', '81', '4f', 'dc', '22', '2a', '90', '88', '46', 'ee', 'b8', '14', 'de', '5e', '0b', 'db'],
    ['e0', '32', '3a', '0a', '49', '06', '24', '5c', 'c2', 'd3', 'ac', '62', '91', '95', 'e4', '79'],
    ['e7', 'c8', '37', '6d', '8d', 'd5', '4e', 'a9', '6c', '56', 'f4', 'ea', '65', '7a', 'ae', '08'],
    ['ba', '78', '25', '2e', '1c', 'a6', 'b4', 'c6', 'e8', 'dd', '74', '1f', '4b', 'bd', '8b', '8a'],
    ['70', '3e', 'b5', '66', '48', '03', 'f6', '0e', '61', '35', '57', 'b9', '86', 'c1', '1d', '9e'],
    ['e1', 'f8', '98', '11', '69', 'd9', '8e', '94', '9b', '1e', '87', 'e9', 'ce', '55', '28', 'df'],
    ['8c', 'a1', '89', '0d', 'bf', 'e6', '42', '68', '41', '99', '2d', '0f', 'b0', '54', 'bb', '16']
];

const rCon = [
    ['00','00','00','00'],
    ['01','00','00','00'],
    ['02','00','00','00'],
    ['04','00','00','00'],
    ['08','00','00','00'],
    ['10','00','00','00'],
    ['20','00','00','00'],
    ['40','00','00','00'],
    ['80','00','00','00'],
    ['1B','00','00','00'],
    ['36','00','00','00']
]

export const roundKeys = []

const mixColumnsMatrix = []

function ascciiToHex(str) {
    let hexString = '';
    for (let i = 0; i < str.length; i++) {
        // Convert each character to its ASCII code and then to hexadecimal
        hexString += str.charCodeAt(i).toString(16);
    }
    return hexString;
}

function stateArray(str) {

    let block = []
    //loop is written this way to make sure the 'plainTextBlock' is in column-major order

    for (let i = 0; i < 4; i++) {
        
        let subarray = []
        for (let j = i; j < str.length; j += 4) {
            
            subarray.push(ascciiToHex(str[j]));
        }
        block.push(subarray)
    }
    return block;
}

function rotWord(word, shiftnumber = 1) {

    let modArray = [...word];
    
    for (let i = 0; i < shiftnumber; i++) {
        
        modArray.push(modArray.shift())
    }

    return modArray
}

function subWord(word) {
    let afterSub = []
    let firstHalf;
    let secondHalf;

    for (let byte of word) {

        let valFromSBox = ''

        firstHalf = parseInt(byte[0], 16)
        secondHalf = parseInt(byte[1], 16)
        
        valFromSBox = sBox[firstHalf][secondHalf]
        //console.log(valFromSBox)
        afterSub.push(valFromSBox)        
        
    }
    return afterSub
}

// There has to be a better way to implement this function
function xOR(arr1, arr2) {

    // Converts each element into its base 10 form
    let decimalArr1 = arr1.map(curHex => parseInt(curHex, 16))
    let decimalArr2 = arr2.map(curHex => parseInt(curHex, 16))
 
     //Preforms the xOR
    let xOredArr = decimalArr1.map((item, i) => item ^ decimalArr2[i])
 
     //Converts from base 10 back to base 16 (hex)
    let rArray = xOredArr.map(curDeciVal => curDeciVal.toString(16))
 
    let solutionArray = []

    //For some reason after the elements are converted to base 16 anything
    //less that a value of 10hex does not have a leading zero. This loop is to 
    //add that zero back into the string.
    for(let val of rArray) {
        if (val.length === 1) {
            val = '0' + val;
            solutionArray.push(val)
        } else {solutionArray.push(val)}
    }
    return solutionArray;

}

function rConFunction (arr, roundNumber) {
    let rConArr = rCon[roundNumber]

    return xOR(arr, rConArr)

}

function gFunction (arr, roundNumber) {

    return rConFunction(subWord(rotWord(arr)), roundNumber)
}

function keyExpantion (key) {
    //keyArray = key.split("").map(k => ascciiToHex(k))
    let keyArray = key.split(" ")

    let keyBlock = []
    
    for (let i = 0; i < 4; i++) {
        keyBlock.push(keyArray.slice(i * 4, i * 4 + 4));
    }

    roundKeys.push(keyBlock)

    //let curKey = keyBlock
    let curKey = roundKeys[0]
    

    for (let i = 1; i < 11; i++) {

        let nextKey = []

        let wg = gFunction(curKey[3], i)
    
        let w4 = xOR(curKey[0], wg)
        let w5 = xOR(w4, curKey[1])
        let w6 = xOR(w5, curKey[2])
        let w7 = xOR(w6, curKey[3])

        nextKey.push(w4, w5, w6, w7)
        roundKeys.push(nextKey)
        curKey = nextKey
        
    }
    console.log(roundKeys)
}


function initialTransformation() {
    let ptArray = testPT.split(" ")
    let keyArray = testKey.split(" ")

    let tArray = xOR(ptArray, keyArray)
    let solution = [];

    
    for (let i = 0; i < 4; i++) {
        
        let subarray = []
        for (let j = i; j < tArray.length; j += 4) {
            
            subarray.push(tArray[j]);
        }
        solution.push(subarray)
    }
    return solution
}

function subBytes(arrayBlock) {
    let returnArray = []

    for (let i = 0; i < arrayBlock.length; i++) {
        
        returnArray.push(subWord(arrayBlock[i]))
        
    }
    return returnArray
}

function shiftRows(arrayBlock) {

    let newArray = []
    for (let i = 0; i < arrayBlock.length; i++) {
        
        newArray.push(rotWord(arrayBlock[i], i))
        
    }
    return newArray
}

function gf2Multiplication (a, b) {

    let result = 0;
    while (b > 0) {
        if (b & 1) {
            result ^= a;
        }
        a <<= 1;
        if (a & 0x100) { // If a has overflowed beyond 8 bits
            a ^= 0x11b;  // Reduce with the AES irreducible polynomial
        }
        b >>= 1;
    }
    return result;

}

function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function mixColumnsTwo(shiftRowsOutputCol) {

    let returnMatrix = []

    let predefinedMatrix = [

        ["02", "03", "01", "01"],
        ["01", "02", "03", "01"],
        ["01", "01", "02", "03"],
        ["03", "01", "01", "02"]
    ]


    for(let i = 0; i < 4; i++) {

        let xorArray = []

        for(let j = 0; j < 4; j++) {
            xorArray.push(gf2Multiplication(parseInt(predefinedMatrix[i][j], 16), parseInt(shiftRowsOutputCol[j], 16)))
        }
        
        let xorSolution = xorArray[0] ^ xorArray[1] ^ xorArray[2] ^ xorArray[3]
        returnMatrix.push(xorSolution.toString(16).padStart(2, '0'))

    }
    return returnMatrix
}

function mixColumns(shiftRowsOutput) {

    let returnMatrix = []

    for (let i = 0; i < 4; i++) {
        returnMatrix.push(mixColumnsTwo(shiftRowsOutput.map(row => row[i])))
    }

    return returnMatrix;
}

function addRoundKey(mixColOutput, roundNum) {
    
    let returnArray = []

    for (let i = 0; i < 4; i++) {

        if(roundNum === 10) {
            returnArray.push(xOR(mixColOutput[i], transpose(roundKeys.at(roundNum))[i]))
        
        } else {
            returnArray.push(xOR(mixColOutput[i], roundKeys.at(roundNum)[i]))
        }
    }

    return transpose(returnArray);

}

function aesEncryption() {

    let roundArray = []
    roundArray.push(initialTransformation())
    for (let i = 1; i < 10; i++) {
        
        roundArray.push(addRoundKey(mixColumns(shiftRows(subBytes(roundArray[i - 1]))), i))
    }

    let cypherText = transpose(addRoundKey(shiftRows(subBytes(roundArray.at(-1))), 10))
    console.log(roundArray)
    return cypherText
}

let plainTextBlock = stateArray(plainText);

console.log(keyExpantion(testKey))
console.log(aesEncryption())





//I have a JS project which takes a plain text and encrypts it using AES-128 bit. 
// I want to learn how to take this code and make it into a useful website. 
// Give me some ideas on how I can do this. One idea I had was to take an educational approach
//  and make a website that walks through the encryption process step by step. Give me some other ideas










