const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day17_input.txt' ) )
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

function countIntersections( field ) {
    let sum = 0

    Object.entries( field ).forEach( ( [ key, val ] ) => {
        if ( val !== '#' ) {
            return
        }

        const [ x, y ] = key.split( ':' ).map( Number )
        if ( field[`${x-1}:${y}`] !== '#' ) {
            return
        }
        if ( field[`${x+1}:${y}`] !== '#' ) {
            return
        }
        if ( field[`${x}:${y+1}`] !== '#' ) {
            return
        }
        if ( field[`${x}:${y-1}`] !== '#' ) {
            return
        }

        sum += x * y
    } )

    return sum
}

function solve( program ) {

    const programs = [
        // commandString('A,B, A,C'),
        commandString('A,B,A,B,C,B,C,A,B,C'),
        commandString('R,4, R,10, R,8, R,4'),
        commandString('R,10,R,6,R,4'),
        commandString('R,4,L,12,R,6,L,12'),
        // commandString('R,10, R,6, R,4, R,4'),
        // commandString('R,10, R,8, R,4, R,10'),
        // commandString('R,4, R,10, R,8, R,4'),
        // commandString('R,10, R,6, R,4, R,4'),
        // commandString('R,10, R,8, R,4, R,10'),
        commandString('y'),
    ]

    // let field = {
    //     // '0:0': '@'
    // }
    // try {
    //     field = JSON.parse( fs.readFileSync( path.join( __dirname, './field.json' ) ) )
    // } catch ( e ) {
    // }

    let ip = 0
    let offset = 0
    let x = 0
    let y = 0
    let lastOutput = 0
    let programCount = 0

    let str = ''
    let field = {}

    let input = programs[programCount].shift() || 0

    while ( true ) {
        // fs.writeFileSync( './field.json', JSON.stringify( field ) )
        // display( field, x, y, steps )
        // let direction = await awaitInput()
        // process.stdin.removeAllListeners()

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
            if ( output === 10 ) {
                x = 0
                y++

                if ( y > 45 ){
                    console.log( str )
                    str = ''
                    y = 0
                    x = 0
                }
            } else {
                field[`${x}:${y}`] = char
                x++
            }
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

            console.log( lastOutput )
            // console.log( str )
            // console.log( 'str length', str.length )
            // console.log( countIntersections( field ) )
            break
        }

        // console.log( { x, y, direction, horizontalDirection } )
        // console.log()
    }
}

INPUT[0] = 2
solve( INPUT )

function commandString( str = '' ) {
    const result = str
        .toUpperCase()
        .replace( /\s+/g, '' )
        .split( '' )
        .map( chr => chr.charCodeAt( 0 ) )
        .concat( 10 )

    if ( result.length > 21 ) {
        throw new Error( "your function sucks it's too big" )
    }

    return result
}

// console.log( commandString( 'A,B,C, B,A,C' ) )
// console.log( commandString( 'R,4,R,4,R,8' ) )
// console.log( commandString( 'L,6,L,2' ) )
// console.log( commandString( 'L,6, L,2' ) )
// console.log( commandString( '        L,6, l,2,L,10,L,8,l,9,' ) )