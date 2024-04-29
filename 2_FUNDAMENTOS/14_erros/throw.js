const x = 10

// checar se X é um numero
if(!Number.isInteger(x)){
    throw new Error('O valor de X não é um numero inteiro!')
} else {
    console.log('Continuando o codigo...')
}

