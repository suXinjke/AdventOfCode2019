const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day08_input.txt' ) )
    .toString()
    .trim()
    .split( '' )
    .map( Number )
const width = 25
const height = 6

// const INPUT = '0222112222120000'.split( '' ).map( Number )
// const width = 2
// const height = 2

const layers = []
while ( INPUT.length > 0 ) {
    layers.push( INPUT.splice( 0, width * height ) )
}

// console.log( layers )
const zeroDigitsIndex = layers.map( layer => {
    return layer.reduce( ( sum, digit ) => {
        return digit === 0 ? sum + 1 : sum
    }, 0 )
} )
const min = Math.min( ...zeroDigitsIndex )
const minIndex = zeroDigitsIndex.indexOf( min )
console.log( minIndex )
// console.log( layers[minIndex] )
// const oneDigits = layers[minIndex].reduce( ( sum, digit ) => digit === 1 ? sum + 1 : sum, 0 )
// const twoDigits = layers[minIndex].reduce( ( sum, digit ) => digit === 2 ? sum + 1 : sum, 0 )
// console.log( oneDigits * twoDigits )


const finalImage = []
for ( let i = 0 ; i < width * height ; i++ ) {
    for ( let j = 0 ; j < layers.length; j++ ) {
        const layer = layers[j]
        const pixel = layer[i]
        if ( pixel !== 2 ) {
            finalImage.push( pixel )
            break
        }
        // console.log( { i, pixel, layer } )
    }
}

let str = ''
for ( let row = 0 ; row < height ; row++ ) {
    for ( let col = 0 ; col < width ; col++ ) {
        if ( finalImage[row*width + col] === 0 ) {
            str += ' '
        } else {
            str += 'X'
        }
        // str += finalImage[row*width + col]
    }
    str += '\n'
}
console.log( str )

// console.log( INPUT.length )
// console.log( 5 + 3 )