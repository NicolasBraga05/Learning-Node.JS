const fs = require('fs')

console.log('Inicio')

const a = '10'

fs.writeFileSync('arquivo.txt', a)

console.log('Fim')