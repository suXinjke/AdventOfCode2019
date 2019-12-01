const fs = require( 'fs' )
const path = require( 'path' )

// const INPUT = [ 12, 14, 100756 ]
const INPUT = fs
    .readFileSync( path.join( __dirname, 'day01_input.txt' ) )
    .toString()
    .split( '\n' )
    .filter( line => line.length > 0 )
    .map( line => Number( line ) )

function calculateFuel( mass = 0 ) {
    return Math.floor( mass / 3 ) - 2
}

function calculateMegaFuel( mass = 0 ) {
    let sum = 0
    let massLeft = mass
    while ( massLeft > 0 ) {
        const result = calculateFuel( massLeft )
        if ( result > 0 ) {
            sum += result
        }
        massLeft = result
    }

    return sum
}

const PART_1 = INPUT.reduce( ( fuel, mass ) => fuel + calculateFuel( mass ), 0 )
const PART_2 = INPUT.map( fuel => calculateMegaFuel( fuel ) ).reduce( ( sum, fuel ) => sum + fuel, 0 )
console.log( PART_1 )
console.log( PART_2 )
