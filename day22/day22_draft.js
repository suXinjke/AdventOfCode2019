const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day22_input.txt' ) )
    .toString()
    .trim()
    .split( /\r?\n/ )

const DECK_SIZE = 10

let cards = [ ...new Array( DECK_SIZE ) ].map( ( _, index ) => index )
// console.log( cards )
// console.log( [ ...cards.slice( 3 ), ...cards.slice( 0, 3 ) ] )
// console.log( [ ...cards.slice( -4 ), ...cards.slice( 0, cards.length - 4 ) ] )
// console.log( cards.reverse() )
// console.log( cards )

function newStack( deck ) {
    return [ ...deck ].reverse()
}

function cutCards( deck, n ) {
    if ( n > 0 ) {
        return deck.slice( n ).concat( deck.slice( 0, n ) )
    } else if ( n < 0 ) {
        return deck.slice( n ).concat( deck.slice( 0, deck.length + n ) )
    } else {
        return deck
    }
}

function dealWithIncrement( deck, increment ) {
    const result = new Array( deck.length )

    let idx = 0
    let counter = 0
    while ( counter !== deck.length ) {
        result[idx] = deck[counter]
        idx += increment
        counter++

        if ( idx > deck.length - 1 ) {
            idx -= deck.length
        }
    }

    return result
}

function solve() {

    // console.log( cards )

    for ( const command of INPUT ) {
        const lastShit = command.split( ' ' ).slice( -1 )

        if ( command === 'deal into new stack' ) {
            cards = newStack( cards )
        } else if ( command.startsWith( 'cut' ) ) {
            cards = cutCards( cards, Number( lastShit ) )
        } else if ( command.startsWith( 'deal' ) ) {
            cards = dealWithIncrement( cards, Number( lastShit ) )
        }
    }

    // console.log( cards )
    console.log( cards.findIndex( elem => elem === 2019 ) )
}

// const obj = {}
// for ( let i = 0 ; i < 119315717514047 ; i++ ) {
//     obj[i] = i
// }
// console.log( Object.

function solve2() {
    const DECK_SIZE = 119315717514047
    let idx = 2020
    // const DECK_SIZE = 10007
    // let idx = 2019

    // for ( let i = 0 ; i < 1 ; i++ ) {
    for ( let i = 0 ; i < 101741582076661 ; i++ ) {
        for ( const command of INPUT ) {
            // console.log( command )
            const lastShit = command.split( ' ' ).slice( -1 )

            if ( command === 'deal into new stack' ) {
                // cards = newStack( cards )
                idx = ( DECK_SIZE - 1 ) - idx
            } else if ( command.startsWith( 'cut' ) ) {
                const n = Number( lastShit )

                if ( n > 0 ) {
                    if ( idx < n ) {
                        idx = ( DECK_SIZE - n ) + idx
                    } else {
                        idx -= n
                    }
                } else if ( n < 0 ) {
                    // console.log( idx )
                    // console.log( DECK_SIZE )
                    // console.log( n )
                    // console.log( DECK_SIZE + n - 1 )
                    if ( idx > DECK_SIZE + n - 1 ) {
                        // idx = ( DECK_SIZE - n ) + idx
                        idx -= ( DECK_SIZE + n )
                    } else {
                        idx += -n
                    }
                }
            } else if ( command.startsWith( 'deal' ) ) {
                const increment = Number( lastShit )

                // let counter = 0
                // let sub_idx = 0
                // while ( counter !== idx ) {
                //     // result[idx] = cards[counter]
                //     sub_idx += increment
                //     counter++

                //     if ( sub_idx > DECK_SIZE - 1 ) {
                //         sub_idx -= DECK_SIZE
                //     }

                // }


                // idx = sub_idx
                // console.log( sub_idx )
                // console.log( counter )

                // if ( increment === 1 || increment === DECK_SIZE + 1 ) {

                // } else {

                //     idx -= ( increment - 1 )
                //     if ( idx < 0 ) {
                //         console.log( idx )
                //         idx += DECK_SIZE
                //     }
                // }

                idx = ( idx * increment ) % DECK_SIZE
            }
        }

        // console.log( i )
        // if ( i % 1000 === 0 ) {
        //     console.log( 119315717514047 - i )
        // }
        if ( idx === 2020 ) {
            console.log( i )
        }
    }

    console.log( idx )
}

solve2()

// const deck
let badCards = [ ...new Array( 10 ) ].map( ( _, index ) => index )
// console.log( badCards )
// console.log( dealWithIncrement( badCards, 1 ) )
// console.log( dealWithIncrement( badCards, 2 ) )
// console.log( dealWithIncrement( badCards, 3 ) )
// console.log( dealWithIncrement( badCards, 4 ) )
// console.log( dealWithIncrement( badCards, 5 ) )
// console.log( dealWithIncrement( badCards, 6 ) )
// console.log( dealWithIncrement( badCards, 7 ) )
// console.log( dealWithIncrement( badCards, 8 ) )
// console.log( dealWithIncrement( badCards, 9 ) )
// console.log( dealWithIncrement( badCards, 10 ) )
// console.log( dealWithIncrement( badCards, 11 ) )

// console.log( 10 % 5 )
// console.log( Math.floor( 10 / 9 ) * 3 )

// YES THIS ONE
// console.log( 1 & 7 )
// console.log( ( 0 * 3 ) % 10 )
// console.log( ( 1 * 3 ) % 10 )
// console.log( ( 2 * 3 ) % 10 )
// console.log( ( 3 * 3 ) % 10 )
// console.log( ( 4 * 3 ) % 10 )
// console.log( ( 5 * 3 ) % 10 )
// console.log( ( 6 * 3 ) % 10 )

// for ( let i = 0 ; i < 9 ; i++ ) {
    // console.log( i % 3 )
    // console.log( 9 - 3 * (i % 3) )
// }
// console.log( 8 % 7 )
// console.log( 10 - 10 * ( 3 * 0 ) )