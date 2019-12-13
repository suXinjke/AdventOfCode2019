const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day13_input.txt' ) )
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

const Tile = {
    Empty: 0,
    Wall: 1,
    Block: 2,
    Paddle: 3,
    Ball: 4
}

function delay( msec = 500 ) {
    return new Promise( res => setTimeout( () => res(), msec ) )
}

function display( tiles ) {
    let str = 'Score: ' + tiles['-1:0'] + '\n'
    for ( let row = 0 ; row <= 23 ; row++ ) {
        for ( let col = 0 ; col <= 36 ; col++ ) {
            const tileCode = tiles[`${col}:${row}`] || 0
            str += (
                tileCode === Tile.Wall   ? '█' :
                tileCode === Tile.Block  ? '☻' :
                tileCode === Tile.Paddle ? '▼' :
                tileCode === Tile.Ball   ? '◦' :
                ' '
            )
        }
        str += '\n'
    }

    console.log( str )
}

async function play( program, coin, showOutput ) {
    let ip = 0
    let offset = 0

    if ( coin ) {
        program[0] = 2
    }

    const tiles = {}

    let step = 0
    let x = 0
    let y = 0

    let ballX = 0
    let paddleX = 0

    while ( true ) {
        const input = (
            ballX < paddleX ? -1 :
            ballX > paddleX ?  1 :
            0
        )

        const {
            pauseReason,
            ip: ipUpdate,
            offset: offsetUpdate,
            output
        } = executeProgram( {
            program,
            ip,
            offset,
            input,
            pauseAfterOutput: true
        } )

        ip = ipUpdate
        if ( offsetUpdate !== undefined ) {
            offset = offsetUpdate
        }

        if ( pauseReason === 'OUTPUT' ) {
            if ( step === 0 ) {
                x = output
            } else if ( step === 1 ) {
                y = output
            } else if ( step === 2 ) {

                const hash = `${x}:${y}`
                tiles[hash] = output

                if ( output === Tile.Ball ) {
                    ballX = x

                    if ( showOutput ) {
                        display( tiles )
                        await delay( 100 )
                    }
                } else if ( output === Tile.Paddle ) {
                    paddleX = x
                }

            }

            step++
            if ( step > 2 ) {
                step = 0
            }
        }

        if ( pauseReason === 'HALT' ) {
            if ( showOutput ) {
                display( tiles )
            }
            return tiles
        }
    }
}

async function main() {
    const showOutput = process.argv[2] === 'play'
    if ( !showOutput ) {
        const PART_1_ANSWER = Object.values( await play( [ ...INPUT ] ) ).filter( tile => tile === Tile.Block ).length
        const PART_2_ANSWER = ( await play( [ ...INPUT ], true ) )['-1:0']
        console.log( 'Part 1 answer:', PART_1_ANSWER )
        console.log( 'Part 2 answer:', PART_2_ANSWER )

        console.log( '\nWant to see the game in action? Type:' )
        console.log( 'node day13 play' )
    } else {
        play( [ ...INPUT ], true, true )
    }
}
main()