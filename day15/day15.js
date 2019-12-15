const fs = require( 'fs' )
const path = require( 'path' )
const readline = require( 'readline' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day15_input.txt' ) )
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

const Direction = {
    North: 1,
    East: 4,
    West: 3,
    South: 2
}

function display( field, meX, meY, steps ) {
    console.log( steps )
    let str = ''
    for ( let row = -23 ; row <= 23 ; row++ ) {
        for ( let col = -36 ; col <= 36 ; col++ ) {
            const tileCode = field[`${col}:${row}`] || ' '
            str +=
                ( col === meX && row === meY ) ? '@' :
                tileCode === '*' ? '·' :
                tileCode
        }
        str += '\n'
    }

    console.log( str )
}

function awaitInput() {
    return new Promise( ( res ) => {
        const stdin = process.stdin;
        stdin.setRawMode( true );
        stdin.resume();
        stdin.setEncoding( 'utf8' );
        stdin.on( 'data', function( key ){
            const code = key.charCodeAt( 0 )
            if ( code === 3 ) {
                process.exit();
            }

            if ( key === 'w' ) {
                res( Direction.South )
            } else if ( key === 'a' ) {
                res( Direction.West )
            } else if ( key === 's' ) {
                res( Direction.North )
            } else if ( key === 'd' ) {
                res( Direction.East )
            }
        });
    } )
}

async function solve( program ) {

    let field = {
        // '0:0': '@'
    }
    try {
        field = JSON.parse( fs.readFileSync( path.join( __dirname, './field.json' ) ) )
    } catch ( e ) {
    }

    let ip = 0
    let offset = 0
    let x = 0
    let y = 0
    // let direction = Direction.West  //   1
    //                                 // 3   4
    //                                 //   2
    // let horizontalDirection = Direction.West


    // let input = Direction.West
    let sweepUp = true
    let floorDone = false
    let steps = 0

    while ( true ) {
        fs.writeFileSync( './field.json', JSON.stringify( field ) )
        display( field, x, y, steps )
        let direction = await awaitInput()
        process.stdin.removeAllListeners()

        let {
            pauseReason,
            ip: ipUpdate,
            offset: offsetUpdate,
            output
        } = executeProgram( {
            program,
            ip,
            offset,
            input: direction,
            pauseAfterOutput: true
        } )

        ip = ipUpdate
        if ( offsetUpdate !== undefined ) {
            offset = offsetUpdate
        }

        let nextX = x
        let nextY = y
        if ( direction === Direction.North ) {
            nextY++
        } else if ( direction === Direction.East ) {
            nextX++
        } else if ( direction === Direction.South ) {
            nextY--
        } else if ( direction === Direction.West ) {
            nextX--
        }

        if ( pauseReason === 'OUTPUT' ) {
            if ( output === 1 ) { // OK
                x = nextX
                y = nextY
                field[`${nextX}:${nextY}`] = '*'
                steps++
            } else if ( output === 2 ) { // OXYGEN
                x = nextX
                y = nextY
                field[`${nextX}:${nextY}`] = 'O'
                console.log( `OXY AT ${nextX} ${nextY}` )
                // return
            } else { // HIT THE WALL
                field[`${nextX}:${nextY}`] = '#'
            }
        }

        if ( pauseReason === 'HALT' ) {
            break
        }

        // console.log( { x, y, direction, horizontalDirection } )
        // console.log()
    }
}

if ( process.argv[2] === 'play' ) {
    solve( [ ...INPUT ] )
} else {


// console.log( Math.abs( -12 ) + Math.abs( -18 ) )

// const dora = require( './field.json' )
let steps = 0
const dora = JSON.parse( fs.readFileSync( path.join( __dirname, './field.json' ) ) )
while ( true ) {
    if ( Object.values( dora ).filter( val => val === '*' ).length === 0 ) {
        console.log( { steps } )
        return
    }

    const oxygen = Object.entries( dora )
        .filter( ( [ coord, val ] ) => val === 'O' )
        .map( ( [ coord ] ) => {
            const [ x, y ] = coord.split( ':' ).map( Number )
            return { x, y }
        } ).forEach( ( { x, y } ) => {

            if ( dora[`${x-1}:${y}`] === '*' ) {
                dora[`${x-1}:${y}`] = 'O'
            }
            if ( dora[`${x+1}:${y}`] === '*' ) {
                dora[`${x+1}:${y}`] = 'O'
            }
            if ( dora[`${x}:${y-1}`] === '*' ) {
                dora[`${x}:${y-1}`] = 'O'
            }
            if ( dora[`${x}:${y+1}`] === '*' ) {
                dora[`${x}:${y+1}`] = 'O'
            }
        } )

    steps++
    display( dora, 0, 0, steps )
    // console.log( oxygen )
    // break
}
// console.log( dora )

}