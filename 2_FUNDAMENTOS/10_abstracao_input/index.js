const inquirer = require('inquirer')
const chalk = require('chalk')

inquirer.prompt([{
    name: 'p1', 
    massage: 'Qual a primeira nota: ',
}, {
    name: 'p2', 
    massage: 'Qual a segunda nota: ',
},
]).then((answers) => {
    console.log(answers)
    const media = ((parseInt(answers.p1) + parseInt(answers.p2)) / 2)
    if(media >= 7){
        console.log(chalk.bgGreen(`Aprovado! A media é: (${media})`))
    } else {
        console.log(chalk.bgRed(`Reprovado! A media é: (${media})`))
    }
    
})
.catch((err) => console.log(err))