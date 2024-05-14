const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.get('/dashboard', (req, res) => {

    const items = ['Item a', 'Item b', 'Item c']

    res.render('dashboard', {items})
})


app.get('/', (req, res) => {

    const user = {
        name: 'Nicolas',
        surname: 'Braga',
        age: '19'
    }

    const palavra = 'Lindo'

    const auth = true

    const approved = true

    res.render('home', {user: user, palavra, auth, approved })
})

app.listen(3000, () => {
    console.log('App funcionando...')
})