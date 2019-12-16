const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day16_input.txt' ) )
    .toString()
    .trim()

// function pattern( step = 1, minLength = 4 ) {
//     const res = []
//     const myPattern = [ 0, 1, 0, -1 ]
//     let curDigitIdx = 0

//     while ( res.length < minLength + 1 ) {
//         for ( let i = 0 ; i < step ; i++ ) {
//             res.push( myPattern[curDigitIdx] )
//         }

//         curDigitIdx++
//         if ( curDigitIdx > myPattern.length - 1 ) {
//             curDigitIdx = 0
//         }
//     }

//     // console.log( step, minLength, res.length )
//     return res.slice( 1 )
// }

function pattern( phase, digit ) {
    const pat = [ 0, 1, 0, -1 ]

    return pat[Math.floor(digit / phase) % pat.length]
}

// console.log( pattern( 2, 8 ).slice( 1 ) )

// function newInput( input = [ 1, 2, 3, 4, 5, 6, 7, 8 ], mul = 1 ) {
//     const sum = input.map( ( num, idx ) => num * mul ).reduce( ( sum, num ) => sum + num )

//     return Number( sum.toString().slice( -1 ) )
// }

// function nextPhase( input = [ 1, 2, 3, 4, 5, 6, 7, 8 ] ) {
//     return input.map( ( num, idx ) => {
//         // const pat = pattern( idx + 1, input.length * input.length )
//         // console.log( pat )
//         // console.log( newInput( input, pat ) )
//         // console.log( num, idx )
//         // return 22
//         return newInput( input, pattern( idx + 1, input.length ) )
//     } )
// }

// function nextPhase( input = [ 1, 2, 3, 4, 5, 6, 7, 8 ] ) {
//     return input.map( ( num, idx ) => {
//         return newInput( input, pattern( idx + 1, input ) )
//     } )
// }

function nextPhase( input = [ 1, 2, 3, 4, 5, 6, 7, 8 ] ) {
    return input.map( ( _, phaseIndex ) => {
        const megasum = input.reduce( ( sum, num, digitIndex ) => {
            const popa = pattern( phaseIndex + 1, digitIndex + 1 )
            return sum + num * popa
        }, 0 )

        return Math.abs( megasum )
        // return megasum
    } )
}

function CUM_GET_SUM( input = [ 5, 6, 7, 8 ] ) {
    const res = [ ...input ]
    for ( let i = input.length - 2 ; i >= 0 ; i-- ) {
        res[i] = res[i] + res[i+1]
    }
    return res
}

// console.log( CUM_GET_SUM() )

function nextPhase2( input = [ 1, 2, 3, 4, 5, 6, 7, 8 ] ) {

    const firstHalf = input.slice( 0, input.length / 2 )

    // const part2 = input.slice( -input.length / 2 )
    // for ( let i = part2.length - 2 ; i >= 0 ; i-- ) {
    //     part2[i] = part2[i] + part2[i+1]
    // }
    const part2 = CUM_GET_SUM( ( -input.length / 2 ) )
    return [
        ...firstHalf.map( ( _, phaseIndex ) => {
            const megasum = input.reduce( ( sum, num, digitIndex ) => {
                const popa = pattern( phaseIndex + 1, digitIndex + 1 )
                return sum + num * popa
            }, 0 )

            // return Math.abs( megasum )
            return megasum
        } ),
        ...part2
    ].map( num => Math.abs( num % 10 ) )
}

// console.log( nextPhase2() )

// console.log( pattern( 1, 8 ) )
// console.log( pattern( 2, 8 ) )
// console.log( newInput() )
// console.log( nextPhase() )
// console.log( nextPhase( nextPhase() ) )
// console.log( 2 + 2 )

function doIt() {
    // console.log( INPUT )

    // const megaInp = '12345678'
    // const megaInp = '00000001'
    // const megaInp = '0000'
    // const megaInp = '80871224585914546619083218645595'

    // let megaInp = ''
    // for ( let i = 0 ; i < 10000 ; i++ ) {
    //     // megaInp += '03036732577212944063491565474664'
    //     // megaInp += '02935109699940807407585447034323'
    //     megaInp += '03081770884921959731165446850517'
    // }

    let megaInp = ''
    for ( let i = 0 ; i < 10000 ; i++ ) {
        megaInp += INPUT
    }

    let numInp = megaInp.split( '' ).map( Number )

    // console.log( numInp )
    // console.log( nextPhase( nextPhase(numInp )))

    // for ( let i = 0 ; i < 1 ; i++ ) {
    //     for ( let p = 0 ; p < 2 ; p++ ) {
    //         const pat = pattern( p + 1, numInp.length )
    //         const newStuff = Number( ( numInp[i] * pat[0] ).toString().slice( -1 ) )
    //         console.log( { pat, newStuff } )
    //         // console.log( pattern( p + 1, numInp.length ) )
    //         // numInp[i] = newInput( numInp.slice( i, i + 1 ), pattern( p, numInp.length ) )
    //         // numInp[i] = newInput( numInp.slice( i, i + 1 ), pattern( p, numInp.length ) )
    //     }
    // }

    // console.log( numInp )

    const offsetArray = numInp.slice( 0, 7 )
    const offset = Number( offsetArray.map( String ).join( '' ) )
    console.log( offsetArray )
    console.log( offset )
    console.log( numInp.length )
    // console.log(  )
    // console.log( numInp.slice( 0, 8 ) )

    numInp = numInp.slice( offset )
    console.log( numInp.length )

    console.time()
    for ( let i = 0 ; i < 100 ; i++ ) {
        // numInp = nextPhase2( numInp )
        numInp = CUM_GET_SUM( numInp ).map( num => num % 10 )
        // console.log( numInp )
        // console.log( i, numInp )
        // console.log( i )
    }
    console.timeEnd()

    // console.log( numInp.slice( offset, offset + 8 ) )

    // 96179440
    // hat's not the right answer; your answer is too high. If you're stuc
    // WHODODYOUTHINK YOU ARE??????????????
    console.log( numInp.slice( 0, 8 ) )
}

doIt()

// console.log( pattern( 1, 1 ) )

// function pat2() {
//     // const pat = [ 0, 1, -1, 0 ]

//     // const digit =
//     const phase = 3
//     for ( let digit = 0 ; digit < 20 ; digit++ ) {
//         // console.log(
//         console.log( pattern( phase, digit ) )
//     }
// }

// pat2()

