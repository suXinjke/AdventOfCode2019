const [ lowerBound, upperBound ] = '359282-820401'
    .split( '-' )
    .map( Number )

let PART_1_SOLUTIONS = 0
let PART_2_SOLUTIONS = 0

for ( let i = lowerBound ; i <= upperBound ; i++ ) {
    const passwordString = String( i )
    const passwordByDigits = passwordString.split( '' )
    const uniqueDigits = new Set( passwordByDigits )

    // reminder it's possible to compare ASCII codes too
    const ascending = passwordByDigits
        .every( ( _, index, password ) => index > 0 ? password[index] >= password[index-1] : true )

    // doesn't fit 100%
    if ( !ascending ) {
        continue
    }

    let part1Done = false
    let part2Done = false

    for ( const digit of uniqueDigits ) {
        const matches = passwordString.match( new RegExp( `${digit}+`, 'g' ) )

        for ( const match of matches ) {
            if ( match.length > 1 && !part1Done ) {
                part1Done = true
                PART_1_SOLUTIONS++
            }
            if ( match.length === 2 && !part2Done ) {
                part2Done = true
                PART_2_SOLUTIONS++
            }
        }
    }
}

console.log( 'Part 1 answer:', PART_1_SOLUTIONS )
console.log( 'Part 2 answer:', PART_2_SOLUTIONS )
