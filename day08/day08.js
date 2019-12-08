const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day08_input.txt' ) )
    .toString()
    .trim()
    .split( '' )
    .map( Number )

const WIDTH = 25
const HEIGHT = 6

const PIXEL_COUNT = WIDTH * HEIGHT
const LAYER_COUNT = INPUT.length / ( PIXEL_COUNT )

const layers = [ ...new Array( LAYER_COUNT ) ]
    .map( ( _, index ) => INPUT.slice( index * PIXEL_COUNT, index * PIXEL_COUNT + PIXEL_COUNT ) )

const zeroDigitsCount = layers
    .map( layer => layer.reduce( ( sum, digit ) => digit === 0 ? sum + 1 : sum, 0 ) )

const zeroDigitsMinimum = Math.min( ...zeroDigitsCount )
const zeroDigitsMinimumIndex = zeroDigitsCount.indexOf( zeroDigitsMinimum )

const oneDigitCount = layers[zeroDigitsMinimumIndex].reduce( ( sum, digit ) => digit === 1 ? sum + 1 : sum, 0 )
const twoDigitCount = layers[zeroDigitsMinimumIndex].reduce( ( sum, digit ) => digit === 2 ? sum + 1 : sum, 0 )

const PART_1_ANSWER = oneDigitCount * twoDigitCount
console.log( 'Part 1 solution:', PART_1_ANSWER )

const decodedImage = []
for ( let pixelIndex = 0 ; pixelIndex < WIDTH * HEIGHT ; pixelIndex++ ) {
    for ( let layerIndex = 0 ; layerIndex < layers.length; layerIndex++ ) {
        const layer = layers[layerIndex]
        const pixel = layer[pixelIndex]
        if ( pixel !== 2 ) {
            decodedImage.push( pixel )
            break
        }
    }
}

let imageView = ''
for ( let row = 0 ; row < HEIGHT ; row++ ) {
    for ( let col = 0 ; col < WIDTH ; col++ ) {
        imageView += decodedImage[row*WIDTH + col] === 0 ? ' ' : '█'
    }
    imageView += '\n'
}

console.log( 'Part 2 solution:' )
console.log( imageView )