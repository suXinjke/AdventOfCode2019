const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day09_input.txt' ) )
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
    offset = 0,
    input = 1
} ) {

    const paddedOpcode = memory[ip].toString().padStart( 5, '0' )
    const opcode = paddedOpcode.slice( -2 )
    const [ thirdParamMode, secondParamMode, firstParamMode ] = paddedOpcode.slice( 0, paddedOpcode.length - 2 )

    const firstParam = (
        firstParamMode  === '0' ? memory[memory[ip+1]] :
        firstParamMode  === '1' ? memory[ip+1] :
        memory[memory[ip+1]+offset]
    ) || 0
    const secondParam = (
        secondParamMode  === '0' ? memory[memory[ip+2]] :
        secondParamMode  === '1' ? memory[ip+2] :
        memory[memory[ip+2]+offset]
    ) || 0

    switch ( opcode ) {
        case '01': { // ADD
            const destination = memory[ip+3] + ( thirdParamMode === '2' ? offset : 0 )
            memory[destination] = firstParam + secondParam
            return { ip: ip + 4 }
        }
        case '02': { // MUL
            const destination = memory[ip+3] + ( thirdParamMode === '2' ? offset : 0 )
            memory[destination] = firstParam * secondParam
            return { ip: ip + 4 }
        }
        case '03': { // WRITE
            const destination = memory[ip+1] + ( firstParamMode === '2' ? offset : 0 )
            memory[destination] = input
            return { ip: ip + 2, inputDone: true }
        }
        case '04': // PRINT
            return { ip: ip + 2, output: firstParam }
        case '05': // JUMP IF TRUE
            return { ip: firstParam !== 0 ? secondParam : ip + 3 }
        case '06': // JUMP IF FALSE
            return { ip: firstParam === 0 ? secondParam : ip + 3 }
        case '07': { // LESS THAN
            const destination = memory[ip+3] + ( thirdParamMode === '2' ? offset : 0 )
            memory[destination] = firstParam < secondParam ? 1 : 0
            return { ip: ip + 4 }
        }
        case '08': { // EQUALS
            const destination = memory[ip+3] + ( thirdParamMode === '2' ? offset : 0 )
            memory[destination] = firstParam === secondParam ? 1 : 0
            return { ip: ip + 4 }
        }
        case '09': // CHANGE OFFSET
            return { ip: ip + 2, offset: offset + firstParam }
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
    offset = 0,
    program = defaultProgram,
    input = 1,

    showOutput = false,
    pauseAfterOutput = false,
    pauseAfterInput = false,
} ) {
    while ( true ) {
        const {
            ip: ipUpdate,
            offset: offsetUpdate,
            output,
            halt,
            inputDone
        } = executeInstruction( {
            ip,
            offset,
            memory: program,
            input
        } )

        ip = ipUpdate
        if ( offsetUpdate !== undefined ) {
            offset = offsetUpdate
        }

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

executeProgram( { program: INPUT, input: 1, showOutput: true } )
executeProgram( { program: INPUT, input: 2, showOutput: true } )