const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day10_input.txt' ) )
    .toString()
    .trim()
    .split( /\r?\n/ )

const asteroids = INPUT
    .map( ( row, rowIndex ) => row.split( '' )
        .map( ( col, colIndex ) => ( { x: colIndex, y: rowIndex, chr: col } ) )
    )
    .reduce( ( asteroids, row ) => asteroids
        .concat( row.filter( col => col.chr === '#' )
    ), [] )

function getAngle( origin = { x: 0, y: 0 }, target = { x: 1, y: 1 } ) {
    const preX = target.x - origin.x
    const preY = target.y - origin.y
    const mag = Math.sqrt( preX * preX + preY * preY )
    const normalizedVecX = preX / mag
    const normalizedVecY = preY / mag

    return {
        angle: Math.atan2( normalizedVecY, normalizedVecX ).toFixed( 10 ),
        mag
    }
}

function findTheBestAsteroid( asteroids ) {
    return asteroids.reduce( ( prev, { x, y } ) => {
        const set = new Set()

        for ( const target of asteroids ) {
            if ( x === target.x && y === target.y ) {
                continue // do not target yourself please
            }

            const { angle } = getAngle( { x, y }, { x: target.x, y: target.y } )

            set.add( angle )
        }

        const size = set.size
        const itsBetter = size > prev.asteroidsNearby

        return itsBetter ? { x, y, asteroidsNearby: size } : prev
    }, { x: NaN, y: NaN, asteroidsNearby: 0 } )
}

function part2( x, y, asteroids ) {
    const angles = {}

    for ( const target of asteroids ) {
        if ( x === target.x && y === target.y ) {
            continue
        }

        const { angle, mag } = getAngle( { x, y }, { x: target.x, y: target.y } )
        if ( !angles[angle] ) {
            angles[angle] = []
        }

        angles[angle].push( { x: target.x, y: target.y, mag } )
    }

    // these start from pointing to the left rather than up,
    // and I'm too lazy to figure out the coordinate system stuff,
    // so I will just move the angles I don't need at the beginning
    const sortedAngles = Object.entries( angles ).map( entry => {
        const [ rad, group ] = entry
        return [ Number( rad ), group ]
    } ).sort( ( [ angle1 ], [ angle2 ] ) => angle1 > angle2 ? 1 : -1 )

    const cutoffAngle = ( -Math.PI / 2 ) - 0.00001

    const anglesThatWereToTheLeft = sortedAngles.filter( ( [ rad ] ) => rad < cutoffAngle )
    const anglesRemaining = sortedAngles.filter( ( [ rad ] ) => rad >= cutoffAngle )

    const correctlySortedAngles = anglesRemaining.concat( anglesThatWereToTheLeft )

    let asteroidsDestroyed = 0

    while ( true ) {
        let asteroidsLeft = false
        for ( const [ angle, group ] of correctlySortedAngles ) {
            if ( group.length === 0 ) {
                continue
            }

            const { x, y } = group.pop()
            asteroidsDestroyed++
            asteroidsLeft = true

            if ( asteroidsDestroyed === 200 ) {
                return x * 100 + y
            }
        }

        if ( !asteroidsLeft ) {
            break
        }
    }
}

const { x, y, asteroidsNearby } = findTheBestAsteroid( asteroids )
console.log( `Part 1 answer: ${asteroidsNearby} at ${x}, ${y}` )
console.log( 'Part 2 answer:', part2( x, y, asteroids ) )