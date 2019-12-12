const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day12_input.txt' ) )
    .toString()
    .trim()
    .split( /\r?\n/ )

const moons = INPUT.map( line => {
    return line.slice( 1, -1 ).split( ', ' ).reduce( ( prev, data ) => {
        const [ coord, value ] = data.split( '=' )
        return {
            ...prev,
            [coord]: Number( value )
        }
     }, {} )
} ).map( coords => ( {
    pos: coords,
    vel: { x: 0, y: 0, z: 0 }
} ) )

function gcd( a, b ) {
    if ( a == 0 ) {
        return b
    }

    return gcd( b % a, a )
}

function lcm( a, b ) {
    return ( a * b ) / gcd( a, b )
}

function lcm_multi( input ) {
    for ( let i = 0 ; i < input.length - 1 ; i++ ) {
        input[i+1] = lcm( input[i], input[i+1] )
    }

    return input[input.length-1]
}

function stepOnce( moons ) {
    // calculate velocities
    for ( let i = 0 ; i < moons.length ; i++ ) {
        const origin = moons[i]
        for ( let j = 0 ; j < moons.length ; j++ ) {
            if ( i === j ) {
                continue
            }

            const target = moons[j];
            [ 'x', 'y', 'z' ].forEach( coord => {
                if ( target.pos[coord] > origin.pos[coord] ) {
                    origin.vel[coord]++
                } else if ( target.pos[coord] < origin.pos[coord] ) {
                    origin.vel[coord]--
                }
            } )
        }
    }

    // move!
    for ( let i = 0 ; i < moons.length ; i++ ) {
        const origin = moons[i];

        [ 'x', 'y', 'z' ].forEach( coord => {
            origin.pos[coord] += origin.vel[coord]
        } )
    }
}

function part1( moons, steps ) {
    moons = JSON.parse( JSON.stringify( moons ) )

    for ( let i = 0 ; i < steps ; i++ ) {
        stepOnce( moons )
    }

    const pot = moons.map( ({ pos }) => Object.values( pos ).reduce( ( sum, coord ) => sum + Math.abs( coord ), 0 ) )
    const kin = moons.map( ({ vel }) => Object.values( vel ).reduce( ( sum, coord ) => sum + Math.abs( coord ), 0 ) )

    let sum = 0
    for ( let b = 0 ; b < pot.length ; b++ ) {
        const pSum = pot[b]
        const kSum = kin[b]
        sum += pSum * kSum
    }

    return sum
}

function part2( moons ) {
    moons = JSON.parse( JSON.stringify( moons ) )

    const moonPlots = {}
    const periods = {}

    const coords = [ 'x', 'y', 'z' ]

    const minSequenceRepeats = 2

    while ( true ) {

        if ( Object.keys( periods ).length === moons.length * 3 ) {
            const lcms = []
            moons.forEach( ( moon, index ) => {
                lcms.push( lcm_multi( [
                    periods[`${index},x`],
                    periods[`${index},y`],
                    periods[`${index},z`]
                ] ) )
            } )

            return lcm_multi( lcms )
        }

        for ( let moonIndex = 0 ; moonIndex < moons.length ; moonIndex++ ) {

            const moon = moons[moonIndex]
            coords.forEach( coord => {
                const hash = `${moonIndex},${coord}`

                if ( periods[hash] ) {
                    return
                }

                if ( !moonPlots[hash] ) {
                    moonPlots[hash] = []
                }
                moonPlots[hash].push( moon.pos[coord] )

                if ( isRepeatingSequence( moonPlots[hash], minSequenceRepeats ) ) {
                    if ( !periods[hash] ) {
                        const periodLength = moonPlots[hash].length / minSequenceRepeats
                        periods[hash] = periodLength
                        console.log( `Length of repeating sequence for ${hash} is ${periodLength}` )
                    }
                }
            } )
        }

        stepOnce( moons )
    }
}

function isRepeatingSequence( shit = [], minSequenceRepeats ) {
    if ( shit.length < minSequenceRepeats ) {
        return false
    }

    if ( shit.length % minSequenceRepeats !== 0 ) {
        return false
    }

    const sliceSize = shit.length / minSequenceRepeats

    for ( let bigOffset = 0 ; bigOffset < sliceSize ; bigOffset++ ) {
        let elem
        for ( let smallOffset = 0 ; smallOffset < sliceSize * minSequenceRepeats ; smallOffset += sliceSize ) {
            const offset = smallOffset + bigOffset
            if ( elem !== undefined && shit[offset] !== elem ) {
                return false
            }

            elem = shit[offset]
        }
    }

    return true
}

console.log( 'Part 1 answer:', part1( moons, 1000 ) )
console.log( 'Part 2 answer:', part2( moons ) )