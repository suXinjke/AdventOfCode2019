// Another terrible draft for your amusement
const fs = require( 'fs' )
const path = require( 'path' )

// const INPUT = fs
//     .readFileSync( path.join( __dirname, 'day04_input.txt' ) )
//     .toString()
//     .trim()
//     .split( /,\s*/g )
//     .map( line => Number( line ) )

// const INPUT = '359282-820401'
// const INPUT = '359282-820401'

// for ( let i = 359282 ; i <= 820401 ; i++ ) {
let count = 0
// for ( let i = 123444 ; i <= 123444 + 2 ; i++ ) {
for ( let i = 359282 ; i <= 820401 ; i++ ) {
// for ( let i = 111121 ; i <= 111121 + 2 ; i++ ) {
    const str = i.toString()
    const digits = i.toString().split( '' ).map( Number )
    let increases = true
    let twoAdjastent = false
    for ( let i = 1 ; i < digits.length ; i++ ) {
        const prev = digits[i-1]
        const cur = digits[i]
        if ( cur < prev ) {
            increases = false
            break
        }
        // if ( prev === cur ) {
        //     twoAdjastent = true
        //     if ( i < digits.length - 1 ) {
        //         const next = digits[i + 1]
        //         // console.log( { prev, cur, next } )
        //         if ( next === cur ) {
        //             twoAdjastent = false
        //             break
        //         }
        //         // console.log( { cur, next } )
        //     }
        // }

        // console.log( prev, cur )
    }

    for ( let j = 0 ; j <= 9 ; j++ ) {
        const matches = str.match( new RegExp( `${j}+`, 'g' ) )
        for ( const match in matches ) {
            if ( matches[match].length === 2 ) {
                twoAdjastent = true
            }
        }
        // if ( matches ) {
        //     console.log( { i, j, matches } )
        // }
    }

    if ( increases && twoAdjastent ) {
        count++
    }
    // let increaseProperly
    // const sortedStr = i.toString()
    // let digitDict = {}
    // for ( const char of str ) {
    //     // console.log( char )
    //     if ( !digitDict[char] ) {
    //         digitDict[char] = 0
    //     }
    //     digitDict[char]++
    // }
    // console.log( digitDict )
    // console.log( str )
    // console.log( digits )
}

console.log( count )