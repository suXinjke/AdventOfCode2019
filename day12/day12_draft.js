const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day12_input.txt' ) )
    .toString()
    .trim()
    .split( /\r?\n/ )

const moons = INPUT.map( line => {
    return line.slice( 1, -1 ).split( ', ' ).reduce( ( prev, coord ) => {
        const stuff = coord.split( '=' )
        return {
            ...prev,
            [stuff[0]]: Number( stuff[1] )
        }
     }, {} )
} ).map( coords => ( {
    pos: coords,
    vel: { x: 0, y: 0, z: 0 }
} ) )

function moonsEqual( orig, targets ) {
    const coords = ['x','y','z']

    for ( let i = 0 ; i < orig.length ; i++ ) {
        const origin = orig[i];
        const target = targets[i];

        for ( const coord of coords ) {
            if ( origin.pos[coord] != target.pos[coord] ) {
                return false
            }

            if ( origin.vel[coord] != target.vel[coord] ) {
                return false
            }
        }
    }

    return true
}

let stepCount = 0

const initialState = JSON.parse( JSON.stringify( moons ) )

function stepOnce( moons ) {
    // calc vels
    for ( let i = 0 ; i < moons.length ; i++ ) {
        const origin = moons[i]
        for ( let j = 0 ; j < moons.length ; j++ ) {
            if ( i === j ) {
                continue
            }

            const target = moons[j];
            ['x','y','z'].forEach( coord => {
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

        ['x','y','z'].forEach( coord => {
            origin.pos[coord] += origin.vel[coord]
        } )
    }
}

function part1( moons, steps ) {
    moons = JSON.parse( JSON.stringify( moons ) )

    for ( let i = 0 ; i < steps ; i++ ) {
        stepOnce( moons )

        if ( i === steps - 1 ) {
            const pot = moons.map( ({ pos }) => Object.values( pos ).reduce( ( sum, coord ) => sum + Math.abs( coord ), 0 ) )
            const kin = moons.map( ({ vel }) => Object.values( vel ).reduce( ( sum, coord ) => sum + Math.abs( coord ), 0 ) )

            let sum = 0
            for ( let b = 0 ; b < pot.length ; b++ ) {
                const psum = pot[b]
                const ksum = kin[b]
                sum += psum * ksum
            }

            return sum
        }
    }
}

function part2( moons ) {
    let steps = 0
    moons = JSON.parse( JSON.stringify( moons ) )

    // const initials = [ moons[0].pos.x, moons[0].pos.y, moons[0].pos.z ]
    // let ending = []
    // const periods = []

    const moonPlots = {}
    const periods = {}

    let done = false

    const hope = 2

    const coords = [ 'x', 'y', 'z' ]

    while ( true ) {

        if ( Object.keys( periods ).length === 12 ) {
            console.log( periods )

            const lcms = []
            moons.forEach( ( moon, index ) => {
                lcms.push( lcm_multi( [
                    periods[`${index},x`],
                    periods[`${index},y`],
                    periods[`${index},z`]
                ] ) )
            } )

            console.log( lcms )
            console.log( lcm_multi( lcms ) )
            break
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

                if ( isRepeatingSequence( moonPlots[hash], hope ) ) {
                    // console.log( moonPlots )
                    // console.log( moonPlots.length / hope )

                    if ( !periods[hash] ) {
                        periods[hash] = moonPlots[hash].length / hope
                        console.log( `found repeating sequence for ${hash}` )
                    }
                }
            } )


        }

        stepOnce( moons )

        steps++
    }

    // console.log( initials )
    // console.log( ending )
    // console.log( periods )
    // for ( let i = 1 ; i < 100 ; i++ ) {
    //     console.log( i, periods.map( per => per * i ) )
    // }
}

function isRepeatingSequence( shit = [], hope ) {

    if ( shit.length < hope ) {
        return false
    }

    if ( shit.length % hope !== 0 ) {
        return false
    }

    const sliceSize = shit.length / hope

    // const slices = []
    // for ( let i = 0 ; i < hope ; i++ ) {
    //     const offset = sliceSize * i
    //     slices.push( shit.slice( offset, offset + sliceSize ) )
    // }
    for ( let i = 0 ; i < sliceSize ; i++ ) {
        let elem
        for ( let offset = 0 ; offset < sliceSize * hope ; offset += sliceSize ) {
            // console.log( { i, offset } )
            // console.log( offset + i )
            // console.log( shit[offset] )
            if ( elem !== undefined && shit[offset + i] !== elem ) {
                return false
            }

            elem = shit[offset + i]
        }
    }

    return true
}

// console.log( isRepeatingSequence( [ 1, 2, 1, 2, 1, 2 ], 3 ) )

// function lcm( input = [ 6, 28, 44 ], limit = 99999999999 ) {
//     const max = Math.max( ...input )

//     let result = max
//     let found = false

//     for ( let i = 0 ; i < limit ; i++ ) {
//         if ( input.every( num => result % num === 0 ) ) {
//             found = true
//             break
//         }
//         // input = input.map( ( num, index ) => num + orig[index] )
//         result += max
//         // input = input.map(

//         console.log( result )
//     }

//     if ( !found ) {
//         throw new Error( 'no lcm' )
//     }

//     return result
// }

// function gcd( input = [ 48, 18, 3 ] ) {

// }

function gcd(a, b) {
    if (a == 0)
        return b;
    return gcd(b % a, a);
}

function gcd_multi(a) {
    for ( let i = 0 ; i < a.length - 1 ; i++ ) {
        a[i+1] = gcd(a[i], a[i+1])
    }

    return a[a.length-1]
}

// console.log( gcd( 54, 24 ) )
// console.log( gcd_multi( [ 54, 24, 2 ] ) )

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

function lcm_multi(a, b) {
    for ( let i = 0 ; i < a.length - 1 ; i++ ) {
        a[i+1] = lcm(a[i], a[i+1])
    }

    return a[a.length-1]
}

// console.log( lcm_multi( [ 186028,167624,193052 ] ) )

// console.log( isRepeatingSequence( [ 1, 1, 1, 1, 1, 1, 1, 1, 1 ], 3 ) )

// console.log( part1( moons, 1000 ) )
console.time()
part2( moons )
console.timeEnd()

// for ( let step = 0 ; step < steps ; step++ ) {
// while ( true ) {

//     // for ( let i = 0 ; i < 1 ; i++ ) {
//     //     const origin = moons[i];

//     //     // ['x','y','z'].forEach( coord => {
//     //     //     origin.pos[coord] += origin.vel[coord]
//     //     // } )

//     //     // console.log( `${stepCount},${origin.pos.x},${origin.pos.y},${origin.pos.z},`
//     //     // console.log( [
//     //     //     stepCount,
//     //     //     i+1,
//     //     //     origin.pos.x,
//     //     //     origin.pos.y,
//     //     //     origin.pos.z,
//     //     //     origin.vel.x,
//     //     //     origin.vel.y,
//     //     //     origin.vel.z
//     //     // ].join( ',' ) )
//     //     console.log( [
//     //         stepCount,
//     //         i+1,
//     //         origin.pos.x,
//     //         origin.pos.y,
//     //         origin.pos.z,
//     //         origin.vel.x,
//     //         origin.vel.y,
//     //         origin.vel.z
//     //     ].join( ',' ) )
//     // }



//     // for ( let i = 0 ; i < moons.length ; i++ ) {
//     //     const origin = moons[i];

//     //     let allMatch =
//     //         origin.pos['x'] === initialState[i].pos['x'] &&
//     //         origin.pos['y'] === initialState[i].pos['y'] &&
//     //         origin.pos['z'] === initialState[i].pos['z'];

//     //     if ( allMatch ) {
//     //         // console.log( `vel all 0 for moon ${i} is at 0 for step ${stepCount}` )
//     //         console.log( `there was some match at moon ${i} for step ${stepCount}` )
//     //         console.log( moons )
//     //     }
//     // }

//     stepCount++

//     // let hash = ''
//     // for ( let i = 0 ; i < moons.length ; i++ ) {
//     //     const origin = moons[i];

//     //     ['x','y','z'].forEach( coord => {
//     //         // origin.pos[coord] += origin.vel[coord]
//     //         hash += origin.pos[coord] + ' ' + origin.vel[coord]
//     //     } )
//     // }
//     // // const hash = JSON.stringify( moons )
//     // // const hash =
//     // if ( !snapshots[hash] ) {
//     //     snapshots[hash] = 0
//     // }
//     // snapshots[hash]++

//     // if ( snapshots[hash] > 1 ) {
//     //     console.log( stepCount - 1 )
//     //     break
//     // }

//     // if ( JSON.stringify( moons ) === initialState ) {
//     // if ( stepCount === 2771 ) {
//     //     console.log( initialState )
//     //     console.log( moons )
//     // }



//     // console.log( moons )
//     // console.log()
//     if ( moonsEqual( initialState, moons ) ) {
//         // console.log( stepCount )
//         break
//     }

//     // 100000
//     // 4686774924
//     if ( stepCount % 100000 === 0 ) {
//         console.log( stepCount )
//     }
//     // snapshots


//     // break
// }

// console.log( moons )