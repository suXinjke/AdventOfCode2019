const fs = require( 'fs' )
const path = require( 'path' )

const MASSES = fs
    .readFileSync( path.join( __dirname, 'day01_input.txt' ) )
    .toString()
    .trim()
    .split( /,?\s+/g )
    .map( line => Number( line ) )

// 1969 -> 654
function calculateFuel( mass = 0 ) {
    return Math.floor( mass / 3 ) - 2
}

// 1969 -> 966
function calculateMegaFuel( mass = 0 ) {
    const fuelRequirement = calculateFuel( mass )
    const needsMoreFuel = calculateFuel( fuelRequirement ) > 0

    return needsMoreFuel ?
        fuelRequirement + calculateMegaFuel( fuelRequirement ) :
        fuelRequirement
}

const PART_1_ANSWER = MASSES
    .reduce( ( fuelSum, mass ) => fuelSum + calculateFuel( mass ), 0 )

const PART_2_ANSWER = MASSES
    .map( fuel => calculateMegaFuel( fuel ) )
    .reduce( ( fuelSum, megaFuel ) => fuelSum + megaFuel, 0 )

console.log( `Part 1 answer: ${PART_1_ANSWER}` )
console.log( `Part 2 answer: ${PART_2_ANSWER}` )
