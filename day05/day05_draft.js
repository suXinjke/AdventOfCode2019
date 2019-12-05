// I wasted 10-20 minutes because I copy pasted noun/verb crap from day2 and you can see it commented

const fs = require( 'fs' )
const path = require( 'path' )

const whatever = fs
    .readFileSync( path.join( __dirname, 'day05_input.txt' ) )
    .toString()
    .trim()
    .split( ',' )

// const whatever = [ '1002', '4', '3', '4', '33' ]
// const whatever = [ '3', '2', '3', '4', '33' ]
// const whatever = [ '3', '0', '4', '0', '99' ]
// const whatever = [ 3,9,8,9,10,9,4,9,99,-1,8 ].map( String )
// console.log( whatever )

// 9, [ 1, 0, 0, 0, 99 ]    -> [ 2, 0, 0, 0, 99 ]
// 0, [ 2, 4, 4, 5, 99, 0 ] -> [ 2, 4, 4, 5, 99, 9801 ]

// const testProg = [ '1002', '4', '3', '4', '33' ]

function executeInstruction( ip = 0, memory = testProg ) {
    memory = [ ...memory ]

    const STUFF = memory[ip].padStart( 5, '0' )
    // const opcode = memory.slice( ip, -2 )
    const opcode = STUFF.slice( -2 )
    const [ thirdParamMode, secondParamMode, firstParamMode ] = STUFF.slice( 0, STUFF.length -2 ).padStart( 3, '0' )
    console.log( { STUFF, thirdParamMode, secondParamMode, firstParamMode, opcode } )
    // console.log( opcode )

    const firstOperandAddress   = memory[ip+1]
    const secondOperandAddress  = memory[ip+2]
    const thirdOperandAddress    = memory[ip+3]
    const destinationAddress    = memory[ip+3]

    // console.log( memory )
    // console.log( firstParamMode )
    // console.log( ip )
    // console.log( firstOperandAddress )
    const firstOperand          = firstParamMode === '0' ? memory[firstOperandAddress] : firstOperandAddress
    const secondOperand         = secondParamMode === '0' ? memory[secondOperandAddress] : secondOperandAddress
    const thirdOperand          = thirdParamMode === '0' ? memory[thirdOperandAddress] : thirdOperandAddress

    switch ( opcode ) {
        case '01':
            // console.log( 'w' )
            memory[destinationAddress] = (Number(firstOperand) + Number(secondOperand)).toString()
            return { memory, ip: ip + 4, output: null }
        case '02':
            // console.log( { thirdParamMode, secondParamMode, firstParamMode, opcode } )
            // console.log( { firstOperandAddress, secondOperandAddress, destinationAddress } )
            // console.log( { firstOperand, secondOperand } )
            // console.log( String(Number(firstOperand) * Number(secondOperand)) )
            // console.log( firstOperand )
            // console.log( secondOperand )
            // console.log( shit )
            // // console.log( memory, ip )
            memory[destinationAddress] = (Number(firstOperand) * Number(secondOperand)).toString()
            // console.log( memory, ip )
            return { memory, ip: ip + 4, output: null }
        case '03':
            // console.log( 'w' )
            memory[firstOperandAddress] = '5'
            return { memory, ip: ip + 2, output: null }
        case '04':
            // console.log( 'w' )
            // console.log( { STUFF, thirdParamMode, secondParamMode, firstParamMode, opcode } )
            console.log( opcode )
            console.log( memory[firstOperand] )
            console.log( ip )
            return { memory, ip: ip + 2, output: firstOperand }
        case '05':
            if ( firstOperand !== '0' ) {
                return { memory, ip: Number(secondOperand) }
            }
            return { memory, ip: ip + 3 }
        case '06':
            if ( firstOperand === '0' ) {
                return { memory, ip: Number(secondOperand) }
            }
            return { memory, ip: ip + 3 }
        case '07':
            if ( Number(firstOperand) < Number(secondOperand) ) {
                memory[destinationAddress] = '1'
            } else {
                memory[destinationAddress] = '0'
            }
            return { memory, ip: ip + 4 }
        case '08':
            if ( Number(firstOperand) === Number(secondOperand) ) {
                memory[destinationAddress] = '1'
            } else {
                memory[destinationAddress] = '0'
            }
            return { memory, ip: ip + 4 }
        case '99':
        default:
            // console.log( 'w' )
            return { memory, ip, output: null, halt: true }
    }
}

// console.log( executeInstruction() )
// executeInstruction()

function executeProgram( program = testProg, noun = 12, verb = 2 ) {
    let memory = [ ...program ]
    // memory[1] = noun
    // memory[2] = verb

    let ip = 0
    while ( memory[ip] !== 99 ) {
        // console.log( ip )
        // console.log( memory.slice( ip, ip + 4 ) )
        // console.log( ip )
        console.log( memory[6] )

        const result = executeInstruction( ip, memory )

        // console.log( result )
        // console.log( result.ip )
        // ip +=
        memory = result.memory
        ip = result.ip
        if ( typeof result.output === 'string' && result.out !== '0' ) {
            console.log( result.output )
            // return
        }
        // console.log( memory )
        if ( result.halt ) {
            console.log( result.halt )
            break
        }
        // console.log( 5 )
    }

    return memory[0]
}

executeProgram( whatever )
