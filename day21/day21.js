const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day21_input.txt' ) )
    .toString()
    .trim()
    .split( ',' )
    .map( Number )

// Maybe it will help debug later on if AOC19 will include more of these
function panic( {
    message = 'Panic',
    ip = 0,
    memory
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
    memory,
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
                memory
            } )
    }
}

function executeProgram( {
    ip = 0,
    offset = 0,
    program,
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
                return { pauseReason: 'OUTPUT', ip, offset, output }
            }
        }

        if ( inputDone ) {
            if ( pauseAfterInput ) {
                return { pauseReason: 'INPUT', ip, offset }
            }
        }

        if ( halt ) {
            return { pauseReason: 'HALT', ip }
        }
    }
}

function commandString( str = '' ) {
    const result = str
        .toUpperCase()
        .split( '' )
        .map( chr => chr.charCodeAt( 0 ) )
        .concat( 10 )

    if ( result.length > 21 ) {
        throw new Error( "your function sucks it's too big" )
    }

    return result
}

function solve( program ) {

    let ip = 0
    let offset = 0

    const programs = [
        // walker
        // commandString( 'NOT C J' ),
        // commandString( 'AND D J' ),
        // commandString( 'NOT A T' ),
        // commandString( 'OR T J' ),

        // commandString('WALK'),

        // runner
        // I've stolen it from reddit,
        // I really didn't enjoy such strategy puzzle
        // and neither I'm not interested in how it can be automated
        commandString('OR A J'),
        commandString('AND B J'),
        commandString('AND C J'),
        commandString('NOT J J'),
        commandString('AND D J'),
        commandString('OR E T'),
        commandString('OR H T'),
        commandString('AND T J'),

        commandString('RUN'),
    ]
    let lastOutput
    let programCount = 0

    let input = programs[programCount].shift() || 0
    let str = ''

    while ( true ) {
        let {
            pauseReason,
            ip: ipUpdate,
            offset: offsetUpdate,
            output
        } = executeProgram( {
            program,
            ip,
            offset,
            input,
            pauseAfterOutput: true,
            pauseAfterInput: true
        } )

        ip = ipUpdate
        if ( offsetUpdate !== undefined ) {
            offset = offsetUpdate
        }

        if ( pauseReason === 'OUTPUT' ) {
            lastOutput = output
            const char = String.fromCharCode( output )
            str += char
        }

        if ( pauseReason === 'INPUT' ) {
            if ( programs[programCount].length === 0 ) {
                programCount++
            }
            if ( programs[programCount] ) {
                input = programs[programCount].shift() || 0
            } else {
                input = 0
            }
        }

        if ( pauseReason === 'HALT' ) {
            console.log( str )
            console.log( lastOutput )
            return lastOutput
        }
    }
}

solve( INPUT )