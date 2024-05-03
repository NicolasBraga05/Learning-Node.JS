
// modulos externos
const chalk = require('chalk')
const inquirer = require('inquirer')

// modulos internos
const fs = require('fs')

function operation() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que voce deseja fazer: ',
        choices: ['Criar conta: ','Consultar saldo: ','Depositar: ','Sacar: ','Sair do programa: ']
    }
]).then((answer) => {
    const action = answer['action']

    if(action === 'Criar conta: ') {
        createAccount()
    } else if(action ==='Depositar: ') {
        deposit()

    } else if(action === 'Consultar saldo: ') {

    } else if(action === 'Sacar: ') {

    } else if(action === 'Sair do programa: ') {
        console.log(chalk.bgBlue.black('Obrigado por usar o accounts!'))
        process.exit()
    }

}).catch((err) => console.log(err))
}
operation()

// create an account
function createAccount() {
    console.log(chalk.bgGreen.black('Parabens por escolher nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir: '))
    buildAccount()
}


function buildAccount() {

    inquirer
    .prompt([
        {
            name: 'accountName',
            message: 'Digite para a sua conta: ',
        },
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        console.info(accountName)

        if(!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black.bold('Esta conta ja existe, escolha outro nome!'),
            )
            buildAccount()
            return
        
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function(err) {
            console.log(err)
        },)

        console.log(chalk.green('Parabens, sua conta foi criada!'))
        operation()

    })
    .catch((err) => console.log(err))
}

// add an amount to user account
function deposit() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta: '
    }]).then((answer) => {
        
        const accountName = answer['accountName']
    // verify if account exists
        if(!checkAccount(accountName)) {
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message:'Qual o valor do deposito: ',
            },
        ]).then((answer) => {
            const amount = answer['amount']

            // add an amount
            addAmount(accountName, amount)
            operation()
        })
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
}


function checkAccount(accountName) {

    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed('Esta conta nao existe, insira um nome valido!'))
        return false
    }

    return true

}


function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if(!amount) {
        console.log(chalk.bgRed('Ocorreu um erro, tente novamente mais tarde!'),
    )
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )
    console.log(chalk.green(`Foi depositado o valor de (R${amount}) na sua conta`),
)
    
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
    
}