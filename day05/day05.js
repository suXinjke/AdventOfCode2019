const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day05_input.txt' ) )
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
    input = '1'
} ) {
    memory = [ ...memory ]

    const paddedOpcode = memory[ip].toString().padStart( 5, '0' )
    const opcode = paddedOpcode.slice( -2 )
    const [ thirdParamMode, secondParamMode, firstParamMode ] = paddedOpcode.slice( 0, paddedOpcode.length - 2 )

    const firstParam =  firstParamMode  === '0' ? memory[memory[ip+1]] : memory[ip+1]
    const secondParam = secondParamMode === '0' ? memory[memory[ip+2]] : memory[ip+2]
    const thirdParam =  thirdParamMode  === '0' ? memory[memory[ip+3]] : memory[ip+3]

    switch ( opcode ) {
        case '01': // ADD
            memory[memory[ip+3]] = firstParam + secondParam
            return { memory, ip: ip + 4 }
        case '02': // MUL
            memory[memory[ip+3]] = firstParam * secondParam
            return { memory, ip: ip + 4 }
        case '03': // WRITE
            memory[memory[ip+1]] = input
            return { memory, ip: ip + 2 }
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
                memory[memory[ip+3]] = 1
            } else {
                memory[memory[ip+3]] = 0
            }
            return { memory, ip: ip + 4 }
        case '08': // EQUALS
            if ( firstParam === secondParam ) {
                memory[memory[ip+3]] = 1
            } else {
                memory[memory[ip+3]] = 0
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
    program = defaultProgram,
    input = 1
} ) {
    console.time('Finished in:')

    let memory = [ ...program ]

    let ip = 0
    while ( true ) {

        const {
            memory: memoryUpdate,
            ip: ipUpdate,
            output,
            halt
        } = executeInstruction( {
            ip,
            memory,
            input
        } )

        memory = memoryUpdate
        ip = ipUpdate

        if ( output !== undefined ) {
            console.log( output )
        }

        if ( halt ) {
            console.log( `Intcode exit at IP: ${ip}` )
            console.timeEnd( 'Finished in:' )
            break
        }
    }
}

executeProgram( { program: INPUT, input: 1 } )
executeProgram( { program: INPUT, input: 5 } )