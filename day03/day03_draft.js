// This was saved after furious attempt at speedrunning day03,
// it's so bad yet amusing, that I decided to leave it for comparison

const fs = require( 'fs' )
const path = require( 'path' )

const [ firstWrite, secondWire ] = fs
    .readFileSync( path.join( __dirname, 'day03_input.txt' ) )
    .toString()
    .trim()
    .split( /\r\n/g )
    .map( line => line.split( ',' ) )

// console.log( firstWrite )
// console.log( secondWire )

const stepsDict = {
    '0:0': {
        1: 0,
        2: 0
    }
}

let x = 0
let y = 0

function makeStep( shit = 'R35', wireId ) {
    // const res = [...field]
    // return field
    const direction = shit.slice( 0, 1 )

    const steps = Number(shit.slice( 1, shit.length + 1 ))
    // console.log( { shit, direction, steps } )
    for ( let i = 0 ; i < steps ; i++ ) {

        if ( direction === 'R' ) {
            x++
        } else if ( direction === 'L' ) {
            x--
        } else if ( direction === 'U' ) {
            y++
        } else if ( direction === 'D' ) {
            y--
        }

        const hash = `${x}:${y}`
        if ( stepsDict[hash] === undefined ) {
            stepsDict[hash] = {
                1: 0,
                2: 0
            }
        }
        stepsDict[hash][wireId]++
    }

    // console.log( steps )
    return steps
}

for ( const dumbo of firstWrite ) {
    makeStep( dumbo, 1 )
}
x = 0
y = 0
for ( const dumbo of secondWire ) {
    makeStep( dumbo, 2 )
}
// let test
// const dumb = [ 0, 0, 0, 0, 1, 0, 0, 0, 0 ]
// console.log( makeStep( 'R8' ) )
// console.log( makeStep( 'U5' ) )
// console.log( makeStep( 'L5' ) )
// console.log( makeStep( 'D3' ) )
// x = 0
// y = 0
// console.log( makeStep( 'U7' ) )
// console.log( makeStep( 'R6' ) )
// console.log( makeStep( 'D4' ) )
// console.log( makeStep( 'L4' ) )
const res = Object.keys( stepsDict ).filter( key => {
    return stepsDict[key][1] > 0 && stepsDict[key][2] > 0
} )
const res2 = res.map( chunk => {
    const [ x, y ] = chunk.split( ':' ).map( Number )
    // return [ Math.abs( Number( x ) ), Math.abs( Number( y ) ) ]
    // return Math.abs( Number( x ) ) + Math.abs( Number( y ) )
    // return Math.abs( Number( x ) ) + Math.abs( Number( y ) )
    return Math.abs( 0 - x ) + Math.abs( 0 - y )
} )
console.log( res )

let results = []
for ( const shit of res ) {
    const [ shitX, shitY ] = shit.split( ':' ).map( Number )
    console.log( { shitX, shitY } )
    // console.log( x, y )
    x = 0
    y = 0

    let firstWireSteps = 0
    let secondWireSteps = 0

    let superBreak = false
    for ( const dumbo of firstWrite ) {
        superBreak = false
        const direction = dumbo.slice( 0, 1 )

        const steps = Number(dumbo.slice( 1, shit.length + 1 ))
        for ( let i = 0 ; i < steps ; i++ ) {
            makeStep( direction + '1', 1 )
            firstWireSteps++

            if ( x === shitX && y === shitY ) {
                superBreak = true
                break
            }
        }

        if (superBreak) {
            break
        }
    }

    x = 0
    y = 0

    for ( const dumbo of secondWire ) {
        superBreak = false
        const direction = dumbo.slice( 0, 1 )

        const steps = Number(dumbo.slice( 1, shit.length + 1 ))
        // console.log( dumbo )
        for ( let i = 0 ; i < steps ; i++ ) {
            makeStep( direction + '1', 2 )
            secondWireSteps++

            if ( x === shitX && y === shitY ) {
                superBreak = true
                break
            }
        }

        if (superBreak) {
            break
        }
    }

    results.push( firstWireSteps + secondWireSteps )
}

console.log( results )
console.log( Math.min( ...results ) )
// console.log( res2 )
// console.log( Math.min( ...res2 ) )
// | 0 -

// console.log( 'Part 1 solution:', part1() )
// console.log( 'Part 2 solution (bruteforce):', part2_bruteforce() )
// console.log( 'Part 2 solution (foamy brutefarce):', part2_foamyBrutefarce() )
