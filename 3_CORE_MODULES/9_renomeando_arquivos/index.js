const fs = require('fs')

const arqAntigo = 'novoarquivo.txt'
const arqNovo = 'arquivo.txt'

fs.rename(arqAntigo, arqNovo, function (err) {
    if(err) {
        console.log(err)
        return
    } 
    console.log(`O arquivo (${arqAntigo}) foi renomeado para (${arqNovo})`)
})