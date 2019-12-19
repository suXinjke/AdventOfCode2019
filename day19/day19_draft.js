const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day19_input.txt' ) )
    .toString()
    .trim()
    .split( ',' )
    .map( Number )

const INPUT2 = fs
    .readFileSync( path.join( __dirname, 'day19_input3.txt' ) )
    .toString()
    .trim()
    .split( '\r\n' )

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

function solve( program, inputs = [ 0, 0 ] ) {

    let ip = 0
    let offset = 0

    let input = inputs.shift()
    let lastOutput

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
        }

        if ( pauseReason === 'INPUT' ) {
            if ( inputs.length > 0 ) {
                input = inputs.shift()
            }
        }

        if ( pauseReason === 'HALT' ) {
            return lastOutput
        }
    }
}

function findCorner( rows, size, offset ) {
    // console.log( rows )

    let matches

    for ( let rowIndex = 0 ; rowIndex < rows.length ; rowIndex++ ) {
        matches = 0
        const row = rows[rowIndex]
        if ( ( row.match( /#/g ) || [] ) .length < size ) {
            continue
        }

        const upperRowIndex = rowIndex-(size-1)
        const upperRow = rows[upperRowIndex]
        if ( !upperRow ) {
            continue
        }

        if ( ( upperRow.match( /#/g ) || [] ) .length < size ) {
            continue
        }

        // console.log( upperRow )
        // console.log( row )
        // console.log(  )
        for ( let col = 0 ; col < row.length ; col++ ) {
            // console.log( row[col], upperRow[col], row[col] === upperRow[col] )
            if ( row[col] === '#' && upperRow[col] === '#' ) {
                // console.log( row[col], upperRow[col] )
                matches++
            }
        }

        if ( matches >= size ) {
            // console.log( { upperRow, row } )
            // console.log( rowIndex )
            // console.log( upperRow )
            // console.log( row )
            // console.log( matches )
            // console.log( upperRowIndex, row.indexOf( '#' ) )
            const x = row.indexOf( '#' )
            const y = upperRowIndex + offset
            return [ x, y, x * 10000 + y ]
            break
        }
        // const bottomLeft
        // console.log()
    }
}

function fill( rows, offset, size, x, y ) {
    return rows.map( ( row, _rowIndex ) => {
        const rowIndex = _rowIndex + offset
        // console.log( rowIndex )
        if ( rowIndex < y ) {
            return row
        }
        if ( rowIndex >= y + size ) {
            return row
        }


        return row.split( '' ).map( ( char, index ) => {
            if ( index < x ) {
                return char
            }

            if ( index >= x + size ) {
                return char
            }

            if ( char !== '#' ) {
                return char
            }

            return 'O'
        } ).join( '' )
    } )
}

// const offset = 0
// console.log( findCorner( INPUT2.slice( offset ), 5, offset ) )
// console.log( INPUT2 )/
// console.log( fill( INPUT2, 0, 5, 11, 9 ) )
// fill( INPUT2, 0, 2, 4, 3 )

let points = 0
let field = {}
let rows = []
let str = ''

let offset = 0

// for ( let i = offset ; i < 1200 ; i++ ) {
//     for ( let j = 0 ; j < 1200 ; j++ ) {
// for ( let y = offset ; y < 10 ; y++ ) {
for ( let y = 0 ; y < 1200 ; y++ ) {
    for ( let x = 0 ; x < 1200 ; x++ ) {
        const res = solve( [ ...INPUT ], [ x, y ] )
        str += res ? '#' : '.'
    }

    rows.push( str )
    str = ''
}

// console.log( rows.join( '\n' ) )
const [ x, y ] = findCorner( rows, 100, offset )
console.log( fill( rows, offset, 100, x, y, ).join( '\n' ) )
console.log( [x, y] )





// const LENGTH = 100

// // for ( const row of rows ) {
// for ( let i = 0 ; i < rows.length ; i++ ) {
//     if ( ( rows[i].match( /#/g ) || [] ) .length < LENGTH ) {
//         continue
//     }

//     // console.log( i, rows[i] )

//     if ( !rows[i-(LENGTH-1)] ) {
//         continue
//     }

//     const start = rows[i].indexOf( '#' )
//     // const upperStart = rows[i-(LENGTH-1)].indexOf( '#' )

//     // console.log( { start, upperStart } )

//     // const bottomLeft =

//     if (
//         rows[i][start] === '#' &&
//         rows[i-(LENGTH-1)][start] === '#' &&
//         rows[i-(LENGTH-1)][start+(LENGTH-1)] === '#' &&
//         rows[i][start+LENGTH-1] === '#'
//     ) {
//         console.log( {
//             bottomLeft: [ i + offset, start ],
//             bottomRight: [ i + offset, start+LENGTH-1 ],
//             upperLeft: [ i + offset - ( LENGTH-1), start ],
//             upperRight: [ i + offset - ( LENGTH-1), start+LENGTH-1 ],
//         } )
//         // console.log( { start, crap: [ i-(LENGTH-1), start ] } )
//         // console.log( i )
//         break
//     }
// }
// // console.log( rows )
// console.log( totalStr )
// // console.log( rows.filter( row => ( row.match( /#/g ) || [] ).length >= 4 ) )