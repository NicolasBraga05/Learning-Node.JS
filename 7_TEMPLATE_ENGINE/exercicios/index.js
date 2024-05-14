const express = require('express')
const exphbs = require('express-handlebars')

const app = express()


app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {

    const nomes = {
        name: 'Nicolas',
        age: 19,
    }

    res.render('home', {nomes: nomes})

})


app.get('/blog', (req, res) => {
    res.render('blog')
})

app.listen(3000, () => {
    console.log('App funcionando...')
})