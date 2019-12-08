const fs = require( 'fs' )
const path = require( 'path' )


const prog = fs
    .readFileSync( path.join( __dirname, 'day07_input.txt' ) )
    .toString()
    .trim()
    .split( ',' )
    .map( Number )

const defaultProgram = [ 1002, 4, 3, 4, 33 ]

// Maybe it will help debug later on if AOC19 will include more of these
function panic( {
    message = 'Panic',
    ip = 0,
    memory = defaultProgram
} ) {
    const errorMessage = `
        INT CODE PANIC: ${message}

        IP: ${ip}

        ${memory.slice( Math.max( ip - 8, 0 ), Math.max( ip - 4, 0 ) )}
        ${memory.slice( Math.max( ip - 4, 0 ), ip )}
      > ${memory.slice( ip, ip + 4 )}
        ${memory.slice( ip + 4, ip + 8 )}
        ${memory.slice( ip + 8, ip + 12 )}
    `
    throw new Error( errorMessage )
}

function executeInstruction( {
    ip = 0,
    memory = defaultProgram,
    // input = '1'
    inputCallback = () => 1
} ) {
    memory = [ ...memory ]

    const paddedOpcode = memory[ip].toString().padStart( 5, '0' )
    const opcode = paddedOpcode.slice( -2 )
    const [ thirdParamMode, secondParamMode, firstParamMode ] = paddedOpcode.slice( 0, paddedOpcode.length - 2 )

    const firstParam =  firstParamMode  === '0' ? memory[memory[ip+1]] : memory[ip+1]
    const secondParam = secondParamMode === '0' ? memory[memory[ip+2]] : memory[ip+2]
    const thirdParam =  thirdParamMode  === '0' ? memory[memory[ip+3]] : memory[ip+3]
    const destinationAddress = memory[ip+3]

    switch ( opcode ) {
        case '01': // ADD
            memory[destinationAddress] = firstParam + secondParam
            return { memory, ip: ip + 4 }
        case '02': // MUL
            memory[destinationAddress] = firstParam * secondParam
            return { memory, ip: ip + 4 }
        case '03': // WRITE
            memory[memory[ip+1]] = inputCallback()
            return { memory, ip: ip + 2, inputDone: true }
        case '04': // PRINT
            return { memory, ip: ip + 2, output: firstParam }
        case '05': // JUMP IF TRUE
            if ( firstParam !== 0 ) {
                return { memory, ip: secondParam }
            } else {
                return { memory, ip: ip + 3 }
            }
        case '06': // JUMP IF FALSE
            if ( firstParam === 0 ) {
                return { memory, ip: secondParam }
            } else {
                return { memory, ip: ip + 3 }
            }
        case '07': // LESS THAN
            if ( firstParam < secondParam ) {
                memory[destinationAddress] = 1
            } else {
                memory[destinationAddress] = 0
            }
            return { memory, ip: ip + 4 }
        case '08': // EQUALS
            if ( firstParam === secondParam ) {
                memory[destinationAddress] = 1
            } else {
                memory[destinationAddress] = 0
            }
            return { memory, ip: ip + 4 }
        case '99': // HALT
            return { memory, ip: ip + 1, halt: true }
        default:
            return panic( {
                ip,
                memory,
                message: `Unknown opcode ${opcode}`,
            } )
    }
}

function executeProgram( {
    ip = 0,
    inputs = 0,
    program = defaultProgram,
    inputCallback = ( index ) => 1
} ) {
    // console.time('Finished in:')

    let memory = [ ...program ]

    // let inputs = 0
    const outputs = []
    while ( true ) {

        const {
            memory: memoryUpdate,
            ip: ipUpdate,
            output,
            halt,
            inputDone
        } = executeInstruction( {
            ip,
            memory,
            inputCallback: () => inputCallback( inputs )
        } )

        memory = memoryUpdate
        ip = ipUpdate

        if ( output !== undefined ) {
            // outputs.push( output )
            return { halt: false, memory, ip, inputs, output }
        }

        if ( inputDone ) {
            inputs++
        }

        if ( halt ) {
            // console.log( `Intcode exit at IP: ${ip}` )
            // console.timeEnd( 'Finished in:' )
            break
        }
    }

    return { halt: true }
}

// const prog = [ 3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
//     27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5]
// const prog = [3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
//     -5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
//     53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10]


function getAllPermutations(string) {
    var results = [];

    if (string.length === 1) {
      results.push(string);
      return results;
    }

    for (var i = 0; i < string.length; i++) {
      var firstChar = string[i];
      var charsLeft = string.substring(0, i) + string.substring(i + 1);
      var innerPermutations = getAllPermutations(charsLeft);
      for (var j = 0; j < innerPermutations.length; j++) {
        results.push(firstChar + innerPermutations[j]);
      }
    }
    return results;
  }

const phases = getAllPermutations( '56789' )
    .map( str => str.split('').map( Number ) )
    .map( stuff => {
        const programs = [ prog, prog, prog, prog, prog ]
        const ips = [ 0, 0, 0, 0, 0 ]
        const inputs = [ 0, 0, 0, 0, 0 ]

        let last = 0
        while ( true ) {
            const A = executeProgram( { program: programs[0], ip: ips[0], inputs: inputs[0], inputCallback: ( index ) => {
                return ( index === 0 ? stuff[0] : last )
            } } )
            if ( A.halt ) {
                break
            }

            programs[0] = A.memory
            ips[0] = A.ip
            inputs[0] = A.inputs

            const B = executeProgram( { program: programs[1], ip: ips[1], inputs: inputs[1], inputCallback: ( index ) => {
                return ( index === 0 ? stuff[1] : A.output )
            } } )
            programs[1] = B.memory
            ips[1] = B.ip
            inputs[1] = B.inputs


            const C = executeProgram( { program: programs[2], ip: ips[2], inputs: inputs[2], inputCallback: ( index ) => {
                return ( index === 0 ? stuff[2] : B.output )
            } } )
            programs[2] = C.memory
            ips[2] = C.ip
            inputs[2] = C.inputs


            const D = executeProgram( { program: programs[3], ip: ips[3], inputs: inputs[3], inputCallback: ( index ) => {
                return ( index === 0 ? stuff[3] : C.output )
            } } )
            programs[3] = D.memory
            ips[3] = D.ip
            inputs[3] = D.inputs

            const E = executeProgram( { program: programs[4], ip: ips[4], inputs: inputs[4], inputCallback: ( index ) => {
                return ( index === 0 ? stuff[4] : D.output )
            } } )
            programs[4] = E.memory
            ips[4] = E.ip
            inputs[4] = E.inputs

            last = E.output
        }

        return last
    } )

console.log( Math.max( ...phases ) )

// const stuff = [ 9, 8, 7, 6, 5 ]



// console.log( Math.max( ...phases ) )

// executeProgram( { program: INPUT, input: 5 } )