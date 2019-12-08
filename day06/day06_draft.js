const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day06_input.txt' ) )
    .toString()
    .trim()
    .split( /\s\n/ )
    .map( line => line.split( ')' ) )
    // .map( Number )

const system = {}
const system2 = {
    'A': ['B'],
    'B': ['C']
}

function indirectOrbits( system, root, level = 2 ) {
    // console.log( { root, level, ray: system[root] } )
    if ( !system[root] ) {
        // return first ? 0 : 1
        // return first ? 0 : 1
        // return 0
        return level <= 0 ? 1 : 0
    }

    return (level <= 0 ? 1 : 0) + system[root].reduce( ( sum, root ) => sum + indirectOrbits( system, root, level - 1 ), 0 )
}

function directOrbits( system ) {
    return Object.values( system ).reduce( ( sum, ray ) => sum + ray.length, 0 )
}

function findPath( system, current, dest ) {
    const planets = system[current]
    // console.log( current, planets )
    if ( !planets ) {
        return []
    }

    if ( planets.includes( dest ) ) {
        return [ current, dest ]
    }

    for ( const route of planets ) {
        const stuff = findPath( system, route, dest )
        if ( stuff.includes( dest ) ) {
            return [ current ].concat( stuff )
        }
        // console.log( stuff )
        // if ( stuff.includes( dest ) ) {
        //     return path.concat( stuff )
        // }
    }

    return current
}

// console.log( indirectOrbits( { 'root': [ 'A' ], 'A': [ 'c' ] }, 'root' ) )

for ( const [ left, right ] of INPUT ) {
    if ( !system[left] ) {
        system[left] = []
    }

    system[left].push( right )
    // console.log( left, right )
}

const YOU_PATH = findPath( system, 'COM', 'YOU' )
const SAN_PATH = findPath( system, 'COM', 'SAN' )

const COMMON_PATH = YOU_PATH.filter( node => SAN_PATH.includes( node ) )
// console.log( YOU_PATH )
// console.log( SAN_PATH )
// console.log( COMMON_PATH )
// console.log( COMMON_PATH[COMMON_PATH.length-1] )
// console.log( COMMON_PATH )

const YOU = YOU_PATH.filter( node => !COMMON_PATH.includes( node ) ).slice( 0, -1 )
const SAN = SAN_PATH.filter( node => !COMMON_PATH.includes( node ) ).slice( 0, -1 )
// console.log( YOU )
// console.log( SAN )
console.log( YOU.length + SAN.length )

// console.log( system )
// console.log( INPUT )

// console.log( indirectOrbits( system2, 'A' ) )
// console.log( directOrbits( system2, 'A' ) )

// let sum = 0
// Object.keys( system ).forEach( key => {
//     sum += indirectOrbits( system, key )
// } )
// sum += directOrbits( system )
// console.log( sum )


// console.log( indirectOrbits( system, 'COM' ) )
// console.log( directOrbits( system, 'COM' ) )