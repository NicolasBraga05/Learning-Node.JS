
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
        choices: ['Criar conta: ','Consultar saldo: ','Depositar: ','Sacar: ','Transferir: ','Sair do programa: ']
    }
]).then((answer) => {
    const action = answer['action']

    if(action === 'Criar conta: ') {
        createAccount()
    } else if(action ==='Depositar: ') {
        deposit()

    } else if(action === 'Consultar saldo: ') {
        getAccountbalance()

    } else if(action === 'Sacar: ') {
        withdraw()

    } else if(action === 'Transferir: ') {
        transacao()

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
            message: 'Digite um nome para a sua conta: ',
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
    console.log(chalk.green(`Foi depositado o valor de (R$${amount}) na sua conta`),
)
    
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
    
}

// show account balance / mostrando valor da conta
function getAccountbalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Informe o nome da conta: '
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        // verificando se conta existe
        if(!checkAccount(accountName)) {
            return getAccountbalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgGreen.blue(`A conta (${accountName}) tem o saldo de: [R$${accountData.balance}]`))
        operation()

    }).catch(err => console.log(err))
}
// withdraw an amount from user account
function withdraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Informe o nome da conta: '
        }]).then((answer) => {
            const accountName = answer['accountName']

            if(!checkAccount(accountName)) {
                return withdraw()
            }

            inquirer.prompt([
                {
                    name: 'amount',
                    message: 'Qual o valor do saque: '
                }
            ]).then((answer) => {
                const amount = answer['amount']

                removeAmount(accountName ,amount)

            }).catch(err => console.log(err))

        })
        .catch(err => console.log(err))
}

// verificando e removendo valor da conta

function removeAmount(accountName, amount) {

    const accountData = getAccount(accountName)

    if(!amount) {
        console.log(chalk.bgRed('Ocorreu um erro, tente novamente mais tarde!'))
        return withdraw()
    }

    if(accountData.balance < amount) {

        console.log(chalk.bgRed.black.bold(`Saldo indisponivel!, valor solicitado para sacar (R$${amount}) | saldo na conta (R$${accountData.balance})`))
        return withdraw()
    }  
    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )
    console.log(chalk.green.bold(`Saque realizado: R$${amount} na sua conta (${accountName})`))
    operation()
}

// transacao de contas

function transacao() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Informe o nome da sua conta: '
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if(!accountName) {
            console.log(chalk.bgRed.black.bold('Ocorreu um erro! tente novamente mais tarde'))
            return transacao()
        }

        // verify if account exists
        if(!checkAccount(accountName)) {
            return transacao()
        }
        else {
            inquirer.prompt([
                {
                    name: 'accountName2',
                    message: 'Informe o nome da conta que deseja realizar uma transferencia: '
                }
            ]).then((answer) => {

                const accountName2 = answer['accountName2']

                if(!accountName2) {
                    console.log(chalk.bgRed.black.bold('Ocorreu uma erro! tente novamente mais tarde'))
                    return transacao()
                }

                if(!checkAccount(accountName2)) {
                    console.log(chalk.bgRed.black.bold('Informe um nome de conta valido para transferir!'))
                    return transacao()
                }
                inquirer.prompt([
                    {
                        name: 'amount',
                        message: 'Qual o valor da transferencia: '
                    },
                ]).then((answer) => {
                    const amount = answer['amount']
                    const accountData = getAccount(accountName)
                    const accountData2 = getAccount(accountName2)
            
                    if(accountData.balance < amount) {
                        console.log(chalk.bgRed.black.bold(`Saldo indisponivel! o valor da transferencia (R$${amount}) eh maior que o saldo na conta (${accountName}) = (R$${accountData.balance})`))
                        return transacao()
                    }
                    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
                    accountData2.balance = parseFloat(accountData2.balance) + parseFloat(amount)

                    fs.writeFileSync(
                        `accounts/${accountName}.json`,
                        JSON.stringify(accountData),

                        function(err){
                            console.log(err)
                        },
                    )
                    fs.writeFileSync(
                        `accounts/${accountName2}.json`,
                        JSON.stringify(accountData2),
                        function(err){
                            console.log(err)
                        },
                    )
                    console.log(chalk.green.bold(`Transacao de(R$${amount}) realizada com sucesso!`))
                    operation()

                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        }
    }).catch(err => console.log(err))
}