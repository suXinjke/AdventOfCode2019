const fs = require( 'fs' )
const path = require( 'path' )
const util = require( 'util' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day18_input3.txt' ) )
    .toString()
    .trim()
    .split( /\r?\n/ )

const rawField = {}
const locations = {}
const graph = {}


for ( let rowIndex = 0 ; rowIndex < INPUT.length ; rowIndex++ ) {
    const row = INPUT[rowIndex]
    for ( let colIndex = 0 ; colIndex < row.length ; colIndex++ ) {
        const char = row[colIndex]
        const coords = `${colIndex}:${rowIndex}`
        rawField[coords] = char

        // if ( !['#', '@', '.'].includes(char) ) {
        if ( !['#', '.'].includes(char) ) {
            locations[char] = coords
        }
    }
}

for ( [ coords, char ] of Object.entries( rawField ) ) {
    if ( ['#'].includes( char ) ) {
        continue
    }

    const [ x, y ] = coords.split( ':' ).map( Number )
    graph[coords] = [
        `${x-1}:${y}`,
        `${x+1}:${y}`,
        `${x}:${y-1}`,
        `${x}:${y+1}`
    ].filter( coords => rawField[coords] !== '#' )
}

const cache = {}
const keys = Object.entries( locations )
    .filter( ( [ entity ] ) => entity === '@' || entity.match( /[a-z]/ ) )
const coolKeychain = keys
    .map( ( [ entity ] ) => entity )
    .filter( entity => entity !== '@' )
    .reduce( ( prev, key ) => ( { ...prev, [key]: true } ), {} )

console.time()
for ( const [ entity, currentPos ] of keys ) {
    for ( const [ entity2, target ] of keys ) {
        if ( entity === entity2 ) {
            continue
        }

        if ( entity2 === '@' ) {
            continue
        }

        const swappedStuff = cache[`${entity2}:${entity}`]
        if ( swappedStuff ) {
            cache[`${entity}:${entity2}`] = swappedStuff
            continue
        }

        const keys = {}
        if ( entity !== '@' ) {
            keys[entity] = true
        }

        const distance = BFS( {
            currentPos,
            target,
            keys: coolKeychain
        } )

        if ( distance === undefined ) {
            continue
        }

        cache[`${entity}:${entity2}`] = {
            distance: distance.length,
            requiredKeys: distance
                .map( coord => rawField[coord] )
                .filter( entity => entity.match( /[A-Z]/ ) )
                .reduce( ( prev, door ) => ( { ...prev, [door.toLowerCase()]: true } ), {} ),
            otherKeys: distance
                .map( coord => rawField[coord] )
                .filter( entity => entity !== entity2 && entity.match( /[a-z]/ ) )
                .reduce( ( prev, key ) => ( { ...prev, [key]: true } ), {} ),
        }
    }
}
console.timeEnd()

function BFS( {
    currentPos = '',
    target = '',
    visited = {},
    keys = {}
} ) {

    const queue = [ currentPos ]
    const distances = {
        [currentPos]: [  ]
    }

    while ( queue.length > 0 ) {
        const shit = queue.shift()
        if ( shit === target ) {
            return distances[target]
        }

        const options = graph[shit]
            .filter( option => {
                if ( visited[option] ) {
                    return false
                }

                const entity = rawField[option]
                const isDoor = entity.match( /[A-Z]/ )
                const haveNoKey = !keys[entity.toLowerCase()]
                if ( isDoor && haveNoKey ) {
                    return false
                }

                return true
            } )

        options.forEach( option => {
            visited[option] = true
            if ( !distances[option] ) {
                distances[option] = [ shit ]
            }
            distances[option] = distances[shit].concat( option )
        } )

        queue.push( ...options )
    }
}

let steps = 0

// let minPathLength = Number.MAX_SAFE_INTEGER
let minPathLengths = {}
for ( let i = 0 ; i < 30 ; i++ ) {
    minPathLengths[i] = Number.MAX_SAFE_INTEGER
}

function solvePuzzle( {
    currentPos = '',
    pathLength = 0,
    pathWhole = [],
    keys = {},
    depth = 1
} ) {
    const requiredKeys = Object.entries( locations )
        .filter( ( [ entity ] ) => !keys[entity] && entity.match( /[a-z]/ ) )

    if ( requiredKeys.length === 0 ) {
        if ( pathLength < minPathLengths[depth] ) {
            minPathLengths[depth] = pathLength
            // console.log( pathLength )
            // console.log( minPathLengths )
        }

        return pathLength
    }

    const options = Object.keys( cache )
        .filter( path => {
            if ( path[0] !== currentPos ) {
                return false
            }
            if ( keys[path[2]] ) {
                return false
            }

            const { requiredKeys } = cache[path]
            for ( const key in requiredKeys ) {
                if ( !keys[key] ) {
                    return false
                }
            }

            if ( pathLength + cache[path].distance >= minPathLengths[depth] ) {
                return false
            }

            return true
        } )

    // if ( steps < 4 ) {
    //     console.log( currentPos, pathLength )
    //     steps++
    // }

    if ( minPathLengths[depth] === 136 ) {
        console.log( pathWhole, pathLength )
        // let fuck
    }

    const routes = options
        .map( path => {
            // console.log( cache[path].otherKeys )
            const res = solvePuzzle( {
                currentPos: path[2],
                pathLength: pathLength + cache[path].distance,
                pathWhole: pathWhole.concat( path[2] ),
                keys: {
                    ...keys,
                    [path[2]]: true,
                    ...cache[path].otherKeys
                },
                depth: depth + 1
                // keyPath: [ ...keyPath, key ]
            } )

            return res
        } )
        .filter( Boolean )

    const distances = routes.map( pathLength => pathLength )
    const minDistance = Math.min( ...distances )
    const minDistanceIndex = routes.findIndex( pathLength => pathLength === minDistance )

    return routes[minDistanceIndex]
}

function initialInfo() {
    console.log( util.inspect( {
        cache,
        keys,
        coolKeychain,
        locations
    }, null, 4 ) )
}

function solve() {
    console.time()
    const solution = solvePuzzle( {
        currentPos: '@'
    } )
    console.timeEnd()
    console.log( { solution } )
}

initialInfo()
solve()