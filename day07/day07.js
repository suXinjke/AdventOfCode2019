const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day07_input.txt' ) )
    .toString()
    .trim()
    .split( ',' )
    .map( Number )

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
    input = 1
} ) {

    const paddedOpcode = memory[ip].toString().padStart( 5, '0' )
    const opcode = paddedOpcode.slice( -2 )
    const [ thirdParamMode, secondParamMode, firstParamMode ] = paddedOpcode.slice( 0, paddedOpcode.length - 2 )

    const firstParam =  firstParamMode  === '0' ? memory[memory[ip+1]] : memory[ip+1]
    const secondParam = secondParamMode === '0' ? memory[memory[ip+2]] : memory[ip+2]
    const thirdParam =  thirdParamMode  === '0' ? memory[memory[ip+3]] : memory[ip+3]

    switch ( opcode ) {
        case '01': // ADD
            memory[memory[ip+3]] = firstParam + secondParam
            return { ip: ip + 4 }
        case '02': // MUL
            memory[memory[ip+3]] = firstParam * secondParam
            return { ip: ip + 4 }
        case '03': // WRITE
            memory[memory[ip+1]] = input
            return { ip: ip + 2, inputDone: true }
        case '04': // PRINT
            return { ip: ip + 2, output: firstParam }
        case '05': // JUMP IF TRUE
            if ( firstParam !== 0 ) {
                return { ip: secondParam }
            } else {
                return { ip: ip + 3 }
            }
        case '06': // JUMP IF FALSE
            if ( firstParam === 0 ) {
                return { ip: secondParam }
            } else {
                return { ip: ip + 3 }
            }
        case '07': // LESS THAN
            if ( firstParam < secondParam ) {
                memory[memory[ip+3]] = 1
            } else {
                memory[memory[ip+3]] = 0
            }
            return { ip: ip + 4 }
        case '08': // EQUALS
            if ( firstParam === secondParam ) {
                memory[memory[ip+3]] = 1
            } else {
                memory[memory[ip+3]] = 0
            }
            return { ip: ip + 4 }
        case '99': // HALT
            return { ip: ip + 1, halt: true }
        default:
            return panic( {
                ip,
                message: `Unknown opcode ${opcode}`,
            } )
    }
}

function executeProgram( {
    ip = 0,
    program = defaultProgram,
    input = 1,

    showOutput = false,
    pauseAfterOutput = false,
    pauseAfterInput = false,
} ) {
    while ( true ) {
        const {
            ip: ipUpdate,
            output,
            halt,
            inputDone
        } = executeInstruction( {
            ip,
            memory: program,
            input
        } )

        ip = ipUpdate

        if ( output !== undefined ) {
            if ( showOutput ) {
                console.log( output )
            }

            if ( pauseAfterOutput ) {
                return { pauseReason: 'OUTPUT', ip, output }
            }
        }

        if ( inputDone ) {
            if ( pauseAfterInput ) {
                return { pauseReason: 'INPUT', ip }
            }
        }

        if ( halt ) {
            return { pauseReason: 'HALT', ip }
        }
    }
}

// stolen from and based on: https://initjs.org/all-permutations-of-a-set-f1be174c79f8
function getAllPermutations( string ) {
    const results = []

    if ( string.length === 1 ) {
        results.push( string )
        return results
    }

    for ( let i = 0 ; i < string.length ; i++ ) {
        const firstChar = string[i]
        const charsLeft = string.substring( 0, i ) + string.substring( i + 1 )
        const innerPermutations = getAllPermutations( charsLeft )
        for ( let j = 0; j < innerPermutations.length; j++ ) {
            results.push( firstChar + innerPermutations[j] )
        }
    }
    return results
}

function runAmps( {
    ampCount = 5,
    program = [],
    phases = [],
    feedbackLoop = false
} ) {
    const amps = [ ...new Array( ampCount ) ].map( amp => ( {
        memory: [ ...program ],
        ip: 0,
        initialised: false
    } ) )

    let input = 0
    let halt = false
    do {
        for ( let i = 0 ; i < amps.length ; i++ ) {
            const amp = amps[i]

            let { pauseReason, ip: ipUpdate, output } = executeProgram( {
                program: amp.memory,
                ip: amp.ip,
                input: amp.initialised ? input : phases[i],
                pauseAfterOutput: true,
                pauseAfterInput: !amp.initialised
            } )

            amp.ip = ipUpdate

            if ( pauseReason === 'INPUT' ) {
                amp.initialised = true

                // continue on same amp
                i--
                continue
            }
            if ( pauseReason === 'OUTPUT' ) {
                input = output
            }
            if ( pauseReason === 'HALT' ) {
                halt = true
                break
            }
        }
    } while ( !halt && feedbackLoop )

    return input
}

const thrustPowerLevels = getAllPermutations( '01234' )
    .map( str => str.split('').map( Number ) )
    .map( phases => runAmps( { ampCount: 5, phases, program: INPUT, feedbackLoop: false } ) )

const superThrustPowerLevels = getAllPermutations( '56789' )
    .map( str => str.split('').map( Number ) )
    .map( phases => runAmps( { ampCount: 5, phases, program: INPUT, feedbackLoop: true } ) )

console.log( 'Part 1 solution:', Math.max( ...thrustPowerLevels ) )
console.log( 'Part 2 solution:', Math.max( ...superThrustPowerLevels ) )