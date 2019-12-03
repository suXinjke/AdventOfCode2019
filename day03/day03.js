const fs = require( 'fs' )
const path = require( 'path' )

const wires = fs
    .readFileSync( path.join( __dirname, 'day03_input.txt' ) )
    .toString()
    .trim()
    .split( /\r\n/g )
    .map( line => line.split( ',' ) )
    .map( wire => wire
        .map( wirePiece => ( {
            direction: wirePiece.slice( 0, 1 ),
            steps: Number( wirePiece.slice( 1 ) )
        } ) )
    )

// While the original problem suggests only two wires, I account for any amount.
// The solution is naive, probably resembling what you'd do in your head/mind,
// but atleast it's in one pass across all wires.
const wirePositions = wires.map( wire => ( { x: 0, y: 0 } ) )
const wireStepsTaken = wires.map( wire => 0 )
const wireHits = {}

let wirePieceIndex = 0
while ( true ) {
    let hasWire = false
    for ( let wireIndex = 0 ; wireIndex < wires.length ; wireIndex++ ) {
        const wire = wires[wireIndex]
        const wirePiece = wire[wirePieceIndex]
        if ( wirePiece ) {
            hasWire = true

            for ( let step = 0 ; step < wirePiece.steps ; step++ ) {
                if ( wirePiece.direction === 'R' ) {
                    wirePositions[wireIndex].x++
                } else if ( wirePiece.direction === 'L' ) {
                    wirePositions[wireIndex].x--
                } else if ( wirePiece.direction === 'U' ) {
                    wirePositions[wireIndex].y++
                } else if ( wirePiece.direction === 'D' ) {
                    wirePositions[wireIndex].y--
                }

                wireStepsTaken[wireIndex]++

                const { x, y } = wirePositions[wireIndex]
                const hash = `${x}:${y}`
                if ( !wireHits[hash] ) {
                    wireHits[hash] = {
                        [wireIndex]: wireStepsTaken[wireIndex]
                    }
                } else {
                    wireHits[hash][wireIndex] = wireStepsTaken[wireIndex]
                }
            }
        }
    }

    wirePieceIndex++

    if ( !hasWire ) {
        break
    }
}

const intersections = Object.entries( wireHits )
    .filter( ( [ _, stepsTakenByWire ] ) => Object.values( stepsTakenByWire ).length > 1 )
    .map( ( [ coords, stepsTakenByWire ] ) => {
        const [ x, y ] = coords.split( ':' )
        return {
            x: Number( x ),
            y: Number( y ),
            stepsTakenByWire
        }
    } )

const manhattanDistances = intersections
    .map( ( { x, y } ) => Math.abs( x ) + Math.abs( y ) )
const combinedStepsTakenUntilIntersection = intersections
    .map( ( { stepsTakenByWire } ) => Object.values( stepsTakenByWire ).reduce( ( stepSum, steps ) => stepSum + steps ) )
const PART_1_ANSWER = Math.min( ...manhattanDistances )
const PART_2_ANSWER = Math.min( ...combinedStepsTakenUntilIntersection )

console.log( 'Part 1 solution:', PART_1_ANSWER )
console.log( 'Part 2 solution:', PART_2_ANSWER )
