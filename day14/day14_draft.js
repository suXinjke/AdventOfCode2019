const fs = require( 'fs' )
const path = require( 'path' )
const util = require( 'util' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day14_input.txt' ) )
    .toString()
    .trim()
    .split( /\r?\n/ )

const db = {}
INPUT.forEach( str => {
    const win = str.replace( ' => ', ', ' )
        .split( ', ' )
        .reverse()

    const [ rootAmount, rootType ] = win[0].split( ' ' )
    db[rootType] = {
        amount: Number( rootAmount ),
        params: []
    }

    win.slice( 1 ).forEach( ( param, index ) => {
        const [ amount, type ] = param.split( ' ' )

        db[rootType].params.push( {
            amount: Number( amount ),
            type
        } )
    } )
} )

function howMuchOre( db, excesses, target, required ) {
    // console.log( { target, required } )

    const shit = db[target]
    let collected = 0
    if ( excesses[target] ) {
        const excess = excesses[target]
        collected += excess
        excesses[target] -= excess
    }
    let ore = 0
    // const params =
    const newRequired = required - collected
    const batchSize = Math.ceil( newRequired / shit.amount )
    // console.log( { target, required, collected, newRequired, batchSize } )

    // console.log( { target, newRequired, batchSize } )
    let executions = 0
    while ( collected < required ) {
        // console.log( { target, collected, required } )
        ore += shit.params.reduce( ( sum, param ) => {
            if ( param.type === 'ORE' ) {
                return sum + param.amount * batchSize
            } else {
                return sum + howMuchOre( db, excesses, param.type, param.amount * batchSize, false )
            }
        }, 0 )
        collected += shit.amount * batchSize

        // executions++
        break
    }
    // if ( batchSize !== executions ) {
    //     console.log( { batchSize, executions } )
    // }

    const excess = collected - required
    if ( excess > 0 ) {
        if ( !excesses[target] ) {
            excesses[target] = 0
        }
        excesses[target] += excess
    }
    return ore
}

const worstCase = howMuchOre( db, {}, 'FUEL', 1 )
console.log( worstCase )
let limit = 1000000000000

let start=Math.floor( limit / worstCase )
let end= start * 2

let lastVal = 0

for ( let i = start + 1330000 ; i < end ; i++ ) {
    const fuel = howMuchOre( db, {}, 'FUEL', i )
    if ( fuel > limit ) {
        console.log( i - 1 )
        break
    }
    if ( i % 1000 === 0 ) {
        console.log( fuel )
    }
    lastVal = fuel
}


// for ( let i = 0 ; i < 100000 ; i++ ) {
// let res = 0
// let i = 1
// while ( true ) {
//     res = howMuchOre( db, {}, 'FUEL', i )
//     if ( res > 1000000000000 ) {
//         break
//     }
//     i++
//     if ( i % 1000000 === 0 ) {
//         console.log( { i, res } )
//     }
// }

// console.log( howMuchOre( db, {}, 'FUEL', 82892754 ) )

function canConsumeExcess( current, target ) {
    console.log( current, target )
    return Object.keys( target ).every( key => ( current[key] || 0 ) >= target )
    // const can = Object.keys( target ).every( key => ( current[key] || 0 ) >= target )
    // if ( can ) {
    //     return current
    // } else {
    //     return Object.keys( current ).reduce( ( prev, key ) => ( {
    //         ...prev,
    //         [key]: current[key] - ( target[key] || 0 )
    //     } ), {} )
    // }
}

// console.log( consumeExcess( { b: 6 }, { b: 2 } ) )

// console.log( howMuchOre( db, {}, 'FUEL', 1 ) )



// for ( let i = 0 ; i < 50 ; i++ ) {
//     console.time()
//     console.log( howMuchOre( db, {}, 'FUEL', 1000000 ) )
//     console.timeEnd()
// }

// let ore = 1000000000000

// const oneStepExcess = {}
// let minOre = Math.floor( ore / howMuchOre( db, {}, 'FUEL', 1 ) )
// let maxOre = 2 * minOre
// console.log( minOre )
// console.log( maxOre )

// // while ( false ) {
// while ( true ) {
//     const prod_fuel = minOre + Math.floor( ( maxOre - minOre ) / 2 )
//     if ( howMuchOre( db, {}, 'FUEL', prod_fuel ) > ore ) {
//         maxOre = prod_fuel
//     } else {
//         minOre = prod_fuel
//     }

//     console.log( { maxOre, minOre } )
// }
// console.log( limit )
// const minExcess = db['FUEL'].params.reduce( ( prev, param ) => ( {
//     ...prev,
//     [param.type]: param.amount
// } ), {} )
// console.log( minOre )
// console.log( minExcess )
// console.log( minExcess )

// let oreLeft = 1000000000000
// let excess = {}
// let fuel = 0
// while ( true ) {
//     // ore
//     if ( canConsumeExcess( excess, minExcess ) ) {
//         fuel++

//         for ( const key in excess ) {
//             excess[key] -= ( minExcess[key] || 0 )
//         }
//         continue
//     }

//     if ( oreLeft < minOre ) {
//         break
//     }


//     oreLeft -= minOre
//     fuel++

//     for ( const key in oneStepExcess ) {
//         if ( excess[key] === undefined ) {
//             excess[key] = 0
//         }
//         excess[key] += oneStepExcess[key]
//     }

//     if ( fuel % 1000000 === 0 ) {
//         console.log( { oreLeft, fuel } )
//     }
// }

// console.log( fuel )

// let excess = {}
// let results = []
// for ( let i = 1 ; i <= 10 ; i++ ) {
//     // console.log( i, howMuchOre( db, {}, 'FUEL', i ) )
//     results.push( howMuchOre( db, {}, 'FUEL', i ) )
// }
// for ( let i = 1 ; i < 10 ; i++ ) {
//     console.log( results[i], results[i] - results[i-1] )
// }