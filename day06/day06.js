const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day06_input.txt' ) )
    .toString()
    .trim()
    .split( /\s\n/ )
    .map( line => line.split( ')' ) )

function indirectOrbits( system, center, distance = 0 ) {
    let nestedOrbits = 0

    const planets = system[center]
    if ( planets ) {
        nestedOrbits = planets.reduce( ( sum, planet ) => sum + indirectOrbits( system, planet, distance + 1 ), 0 )
    }

    return (distance >= 2 ? 1 : 0) + nestedOrbits
}

function findPath( system, center, destination ) {
    const planets = system[center]
    if ( !planets ) {
        return []
    }

    if ( planets.includes( destination ) ) {
        return [ center, destination ]
    }

    for ( const planet of planets ) {
        const nestedPath = findPath( system, planet, destination )
        if ( nestedPath.includes( destination ) ) {
            return [ center ].concat( nestedPath )
        }
    }

    return []
}

const SYSTEM = INPUT.reduce( ( system, [ left, right ] ) => ( {
    ...system,
    [left]: ( system[left] || [] ).concat( right )
} ), {} )

const directOrbitsCount = Object.values( SYSTEM )
    .reduce( ( count, planets ) => count + planets.length, 0 )

const indirectOrbitsCount = Object.keys( SYSTEM )
    .reduce( ( count, center ) => count + indirectOrbits( SYSTEM, center ), 0 )

const PART_1_ANSWER = directOrbitsCount + indirectOrbitsCount


const pathToYOU = findPath( SYSTEM, 'COM', 'YOU' )
const pathToSAN = findPath( SYSTEM, 'COM', 'SAN' )
const commonPath = pathToYOU.filter( node => pathToSAN.includes( node ) )

const PART_2_ANSWER =
    pathToYOU
        .filter( node => !commonPath.includes( node ) )
        .slice( 0, -1 )
        .length
    +
    pathToSAN
        .filter( node => !commonPath.includes( node ) )
        .slice( 0, -1 )
        .length


console.log( 'Part 1 solution:', PART_1_ANSWER )
console.log( 'Part 2 solution:', PART_2_ANSWER )