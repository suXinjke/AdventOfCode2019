const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day18_input.txt' ) )
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
const shit = Object.entries( locations )
    .filter( ( [ entity ] ) => entity === '@' || entity.match( /[a-z]/ ) )
const allKeys = shit
    .map( ( [ entity ] ) => entity )
    .filter( entity => entity !== '@' )
    .reduce( ( prev, key ) => ( { ...prev, [key]: true } ), {} )

// console.log( shit )
console.time()
for ( const [ entity, currentPos ] of shit ) {
    for ( const [ entity2, target ] of shit ) {
        if ( entity === entity2 ) {
            continue
        }

        if ( entity2 === '@' ) {
            continue
        }

        const keys = {}
        if ( entity !== '@' ) {
            keys[entity] = true
        }

        const distance = pathFind2( {
            currentPos,
            target,
            // keys
            keys: allKeys
        } )

        if ( distance === undefined ) {
            continue
        }

        // const keyHash = Object.keys( keys ).sort().join('')

        // cache[`${keyHash}:${entity}:${entity2}`] = distance
        cache[`${entity}:${entity2}`] = {
            distance: distance.length,
            requiredKeys: distance
                .map( coord => rawField[coord] )
                .filter( entity => entity.match( /[A-Z]/ ) )
                .reduce( ( prev, door ) => ( { ...prev, [door.toLowerCase()]: true } ), {} )

            }
        // console.log( Object.keys( cache ).length )
    }
}
console.timeEnd()
// console.log( cache )
console.log( Object.keys( cache ).length )


function pathFind2( {
    currentPos = '',
    target = '',
    path = [],
    visited = {},
    doors = {},
    keys = {}
} ) {

    const queue = [ currentPos ]
    const distances = {
        [currentPos]: [  ]
    }

    while ( queue.length > 0 ) {
        const shit = queue.shift()
        if ( shit === target ) {
            // console.log( distances )
            // return distances[target].filter( pp => pp !== currentPos )
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

                // if ( isDoor ) {
                //     doors[entity] = true
                // }
                return true
            } )

        options.forEach( option => {
            visited[option] = true
            // distances[option] = distances[shit] + 1
            if ( !distances[option] ) {
                distances[option] = [ shit ]
            }
            distances[option] = distances[shit].concat( option )
        } )

        queue.push( ...options )
    }
}

// console.log( locations )
// console.log( pathFind( {
//     currentPos: locations['@'],
//     target: locations['j'],
//     keys: {
//         c: 'true'
//     }
// } ) )
// console.log( locations )
// console.log( pathFind2( {
//     currentPos: locations['@'],
//     target: locations['a'],
//     keys: {
//         c: 'true'
//     }
// } ) )

function pathFind( {
    currentPos = '',
    target = '',
    path = [],
    visited = {},
    doors = {},
    keys = {}
} ) {
    if ( currentPos === target ) {
        return path
    }

    const options = graph[currentPos]
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
        .map( option => pathFind( {
            currentPos: option,
            target,
            path: [ ...path, option ],
            visited: {
                ...visited,
                [currentPos]: true
            },
            keys
        } ) )
        .filter( path => path )

    const distances = options.map( path => path.length )
    const minDistance = Math.min( ...distances )
    const minDistanceIndex = options.findIndex( option => option.length === minDistance )

    if ( minDistanceIndex === -1 ) {
        return void 0//!
    } else {
        return options[minDistanceIndex]
    }
}

// const solutions = []
let minPathLength = Number.MAX_SAFE_INTEGER
let steps = 0

function solvePuzzle( {
    currentPos = '',
    pathLength = 0,
    keys = {},
    keyPath = [],
    depth = 1,
    record = Number.MAX_SAFE_INTEGER
} ) {
    const requiredKeys = Object.entries( locations )
        .filter( ( [ entity ] ) => !keys[entity] && entity.match( /[a-z]/ ) )

    // console.log( { pathLength, shit: Object.keys( keys ).length, keys } )
    // console.log( { keys, requiredKeys } )
    // console.log( requiredKeys.length )

    if ( requiredKeys.length === 0 ) {
        // console.log( pathLength, minPathLength )
        if ( pathLength < minPathLength ) {
            minPathLength = pathLength
            console.log( minPathLength )
        }
        // minPathLength = Math.min( pathLength, minPathLength )
        return {
            keyPath,
            pathLength
        }
    }

    const options = requiredKeys
        .map( ( [ key, keyLocation ] ) => {
            // const viablePath = pathFind( {
            //     currentPos,
            //     path,
            //     target: keyLocation,
            //     keys
            // } )
            const keyHash = Object.keys( keys ).sort().join('')
            const hash = `${keyHash}:${rawField[currentPos]}:${key}`
            const cachedPathLength = cache[hash]
            // console.log( hash, cachedPathLength, key )
            const viablePathLength = cachedPathLength || pathFind2( {
                currentPos,
                target: keyLocation,
                keys
            } )
            if ( !cachedPathLength ) {
                cache[hash] = viablePathLength
                // console.log( hash )
                // console.log( Object.keys( cache ).length )
                // console.log( cache[hash] )
            }

            // console.log( { currentPos, viablePathLength } )

            if ( viablePathLength > minPathLength ) {
                return {
                    viablePathLength: undefined
                }
            }

            return {
                key,
                keyLocation,
                viablePathLength
            }
        } )
        .filter( ( { viablePathLength } ) => viablePathLength !== undefined )

    // console.log( options )

    const routes = options
        .map( ( { key, keyLocation, viablePathLength } ) => {
            // console.log( { key, keyLocation, viablePath } )

            // if ( viablePath.length >= minPathLength ) {
            //     return undefined
            // }

            const res = solvePuzzle( {
                currentPos: keyLocation,
                pathLength: pathLength + viablePathLength,
                keys: {
                    ...keys,
                    [key]: true
                },
                keyPath: [ ...keyPath, key ],
                depth: depth + 1
            } )

            return res
        } )
        .filter( Boolean )

    // if ( routes.length === 0 ) {
    //     return {
    //         path: null
    //     }
    // }
    // console.log( routes )
    const distances = routes.map( ( { pathLength } ) => pathLength )
    const minDistance = Math.min( ...distances )
    const minDistanceIndex = routes.findIndex( ( { pathLength } ) => pathLength === minDistance )
    // console.log( routes )
    // console.log( routes )
    // console.log( routes )
    // console.log( distances )

    // console.log( { keys, depth } )
    // if ( depth < 16 && routes[minDistanceIndex] ) {
    //     console.log( { keyPath: routes[minDistanceIndex].path.length, route: routes[minDistanceIndex].keyPath } )
    // }
    // steps++
    // if ( steps % 2 && routes[minDistanceIndex] ) {
    //     console.log( {
    //         steps,
    //         keyPath: routes[minDistanceIndex].path.length,
    //         route: routes[minDistanceIndex].keyPath
    //     } )
    // }
    return routes[minDistanceIndex]
}

function solvePuzzle2( {
    currentPos = '',
    pathLength = 0,
    keys = {},
    keyPath = []
} ) {
    const requiredKeys = Object.entries( locations )
        .filter( ( [ entity ] ) => !keys[entity] && entity.match( /[a-z]/ ) )

    // console.log( { currentPos, pathLength, keys, requiredKeys }  )
    // console.log( requiredKeys.length )

    if ( requiredKeys.length === 0 ) {
        // console.log( pathLength )
        if ( pathLength < minPathLength ) {
            minPathLength = pathLength
            console.log( minPathLength )
        }

        return {
            // keyPath,
            pathLength
        }
    }

    const options = Object.keys( cache )
        .filter( path => {
            if ( path[0] !== currentPos ) {
                return false
            }
            if ( keys[path[2]] ) {
                return false
            }

            const dest = path[2]
            const { requiredKeys } = cache[path]
            for ( const key in requiredKeys ) {
                if ( !keys[key] ) {
                    return false
                }
            }

            if ( pathLength + cache[path].distance > minPathLength ) {
                return false
            }

            // console.log( { path, currentPos, dest, requiredKeys } )
            // if ( !keys[dest] ) {
            //     return false
            // }

            return true
        } )

    const routes = options
        .map( path => {
            const res = solvePuzzle2( {
                currentPos: path[2],
                pathLength: pathLength + cache[path].distance,
                keys: {
                    ...keys,
                    [path[2]]: true
                },
                // keyPath: [ ...keyPath, key ]
            } )

            return res
        } )
        .filter( Boolean )

    // console.log( routes )

    // console.log( routes )
    const distances = routes.map( ( { pathLength } ) => pathLength )
    const minDistance = Math.min( ...distances )
    const minDistanceIndex = routes.findIndex( ( { pathLength } ) => pathLength === minDistance )

    return routes[minDistanceIndex]
}

console.time()
const solution = solvePuzzle2( {
    // currentPos: locations['@'],
    currentPos: '@',
    // keys: { 'b': true }
} )
console.timeEnd()
if ( solution ) {
    // console.log( solution )
    const { pathLength, keyPath } = solution
    console.log( {
        // shortPath,
        keyPath,
        pathLength: pathLength
    } )
} else {
    console.log( 'no way out' )
}

// console.log( locations )
// console.log( rawField )
// console.log( graph )
// console.log( pathFind( {
//     currentPos: locations['a'],
//     target: locations['b'],
//     keys: {
//         'A': true
//     }
//     // target: locations['h']
// } ) )

// console.log( locations )



// console.log( { entity, entity2, distance } )
// console.log( cache )

// console.time()
// const solution = solvePuzzle( {
//     currentPos: locations['@'],
//     // keys: { 'b': true }
// } )
// console.timeEnd()
// if ( solution ) {
//     // console.log( solution )
//     const { pathLength, keyPath } = solution
//     console.log( {
//         // shortPath,
//         keyPath,
//         pathLength
//     } )
// } else {
//     console.log( 'no way out' )
// }

// function getAllPermutations(string) {
//     var results = [];

//     if (string.length === 1) {
//       results.push(string);
//       return results;
//     }

//     for (var i = 0; i < string.length; i++) {
//       var firstChar = string[i];
//       var charsLeft = string.substring(0, i) + string.substring(i + 1);
//       var innerPermutations = getAllPermutations(charsLeft);
//       for (var j = 0; j < innerPermutations.length; j++) {
//         results.push(firstChar + innerPermutations[j]);
//       }
//     }
//     return results;
//   }

// console.log( getAllPermutations( '1234567890' ) )

// console.log( shit.length )
// console.log( solutions )