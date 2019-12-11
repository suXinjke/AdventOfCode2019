const fs = require( 'fs' )
const path = require( 'path' )
const util = require( 'util' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day10_input.txt' ) )
    .toString()
    .trim()
    .split( /\r?\n/ )

const rows = INPUT.map( ( row, rowIndex ) => row.split( '' ).map( ( col, colIndex ) => ( { x: colIndex, y: rowIndex, code: `${colIndex}:${rowIndex}`, chr: col } ) ) )
const cells = rows.reduce( ( sum, cur ) => sum.concat( cur ), [] )
const asteroids = cells.filter( cell => cell.chr === '#' )

const width = INPUT[0].length
const height = INPUT.length

const dict = cells.reduce( ( prev, cur ) => ( {
    ...prev,
    [cur.code]: cur.chr
} ), {
} )

function part1() {

    const sets = []

    for ( const origin of asteroids ) {
        // console.log( x, y, chr )
        const set = new Set()

        for ( const target of asteroids ) {
            if ( origin.x === target.x && origin.y === target.y ) {
                continue
            }

            const preX = target.x - origin.x
            const preY = target.y - origin.y
            const mag = Math.sqrt( preX * preX + preY * preY )
            const vecX = preX / mag
            const vecY = preY / mag
            // console.log( { vecX, vecY, mag, crap: Math.atan2( vecY, vecX ) } )

            set.add( Math.atan2( vecY, vecX ).toFixed( 3 ) )
        }

        sets.push( { set, x: origin.x, y: origin.y } )
    }

    // console.log( sets.map( set => set.size ) )
    const maxVal = Math.max( ...sets.map( set => set.set.size ) )
    const maxIndex = sets.findIndex( set => set.set.size === maxVal )
    return bestSet = sets[maxIndex]
    // const maxIndex = sets.reduce( ( max, { set } ) => set.size > max ? set.size : max, 0 )

}

function part2( origin ) {
    const cells = rows.reduce( ( sum, cur ) => sum.concat( cur ), [] )
    const asteroids = cells.filter( cell => cell.chr === '#' )

    // const origin = cells.filter( cell => cell.chr === 'X' )[0]

    const angles = {

    }

    for ( const target of asteroids ) {
        if ( origin.x === target.x && origin.y === target.y ) {
            continue
        }

        const preX = target.x - origin.x
        const preY = target.y - origin.y
        const mag = Math.sqrt( preX * preX + preY * preY )
        const vecX = preX / mag
        const vecY = preY / mag
        // console.log( { vecX, vecY, mag, crap: Math.atan2( vecY, vecX ) } )

        const angle = Math.atan2( vecY, vecX ).toFixed( 10 )
        if ( !angles[angle] ) {
            angles[angle] = []
        }

        angles[angle].push( { x: target.x, y: target.y, mag } )
    }

    // console.log( angles )
    // Object.values( angles ).forEach( angleGroup => angleGroup.sort( ( a, b ) => a.mag > b.mag ? 1 : -1 ) )
    // console.log( angles )

    const stuff = Object.entries( angles ).map( entry => {
        const [ rad, group ] = entry
        return [ Number( rad ), group ]
    } ).sort( ( a, b ) => a[0] > b[0] ? 1 : -1 )

    // console.log( util.inspect( stuff, true, 4 ) )

    const afterStart = stuff.filter( ( [ rad ] ) => rad < ( -Math.PI / 2 ) - 0.00001 )
    const megaStuff = stuff.filter( ( [ rad ] ) => rad >= ( -Math.PI / 2 ) - 0.00001 ).concat( afterStart )
    // console.log( util.inspect( megaStuff, true, 4 ) )
    // console.log( megaStuff )
    // console.log( Math.PI / 2 )

    let count = 0
    megaStuff.forEach( ( [ rad, group ] ) => {
        if ( group.length > 0 ) {
            const { x, y } = group.pop()
            count++

            if ( count === 200 ) {
                console.log( { count, x: x, y: y } )
                console.log( x * 100 + y )
            }
        }
    } )
    // console.log( stuff )
}

const { x, y } = part1()
part2( { x, y } )

// console.log( width )
// console.log( height )
// console.log( dict )

function printDict( dict, width, height ) {
    let str = ''
    for ( let y = 0 ; y < height ; y++ ) {
        for ( let x = 0 ; x < width ; x++ ) {
            str += dict[`${x}:${y}`]
        }
        str += '\n'
    }

    return str
}
