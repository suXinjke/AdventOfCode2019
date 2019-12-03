const fs = require( 'fs' )
const path = require( 'path' )

const INPUT = fs
    .readFileSync( path.join( __dirname, 'day02_input.txt' ) )
    .toString()
    .trim()
    .split( /,\s*/g )
    .map( line => Number( line ) )

// 9, [ 1, 0, 0, 0, 99 ]    -> [ 2, 0, 0, 0, 99 ]
// 0, [ 2, 4, 4, 5, 99, 0 ] -> [ 2, 4, 4, 5, 99, 9801 ]
function executeInstruction( ip = 0, memory = [ 1, 0, 0, 3, 99 ] ) {
    memory = [ ...memory ]

    const opcode = memory[ip]

    const firstOperandAddress   = memory[ip+1]
    const secondOperandAddress  = memory[ip+2]
    const destinationAddress    = memory[ip+3]
    const firstOperand          = memory[firstOperandAddress]
    const secondOperand         = memory[secondOperandAddress]

    switch ( opcode ) {
        case 1:
            memory[destinationAddress] = firstOperand + secondOperand
            break
        case 2:
            memory[destinationAddress] = firstOperand * secondOperand
            break
        default:
            break
    }

    return memory
}

function executeProgram( program = [ 1, 0, 0, 3, 99 ], noun = 12, verb = 2 ) {
    let memory = [ ...program ]
    memory[1] = noun
    memory[2] = verb

    let ip = 0
    while ( memory[ip] !== 99 ) {
        memory = executeInstruction( ip, memory )
        ip += 4
    }

    return memory[0]
}

function part1() {
    return executeProgram( INPUT )
}

const MAGIC_NUMBER = 19690720
function part2_bruteforce() {
    for ( let noun = 0 ; noun <= 99 ; noun++ ) {
        for ( let verb = 0 ; verb <= 99 ; verb++ ) {
            const result = executeProgram( INPUT, noun, verb )

            if ( result === MAGIC_NUMBER ) {
                return 100 * noun + verb
            }
        }
    }

    return 'Failure'
}

/* If you look at what you get while bruteforcing, you will notice the pattern
    { noun: 0, verb: 0, result: 1210687 }
    { noun: 0, verb: 1, result: 1210688 }
    { noun: 0, verb: 2, result: 1210689 }
    { noun: 1, verb: 0, result: 1450687 }
    { noun: 1, verb: 1, result: 1450688 }
    { noun: 1, verb: 2, result: 1450689 }
    { noun: 2, verb: 0, result: 1690687 }
    { noun: 2, verb: 1, result: 1690688 }
    { noun: 2, verb: 2, result: 1690689 }

    Each noun increases the output in a linear manner,
    and verb does it too. It's basically a linear equation with
    two variables, like:

    nounDifference * noun + verb = output

    nounDifference is calculated below, and
    thus allows to calculate the noun and verb.
*/
function part2_foamyBrutefarce() {
    const result1 = executeProgram( INPUT, 0, 0 )
    const result2 = executeProgram( INPUT, 1, 0 )

    const nounDifference = result2 - result1

    const noun = Math.floor( ( MAGIC_NUMBER - result1 ) / nounDifference )
    const verb = Math.floor( ( MAGIC_NUMBER - result1 ) % nounDifference )

    return 100 * noun + verb
}

console.log( 'Part 1 solution:', part1() )
console.log( 'Part 2 solution (bruteforce):', part2_bruteforce() )
console.log( 'Part 2 solution (foamy brutefarce):', part2_foamyBrutefarce() )
