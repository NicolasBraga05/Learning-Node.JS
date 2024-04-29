const { realpath } = require('fs')

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
})

readline.question("Qual a sua linguagem favorita: ", (language) => {
    if(language  ===  "Python") {
        console.log("Isso nem é linguagem")
    } else {
        console.log(`A minha lingaguem preferida é: ${language}`)
    }
    readline.close()
})