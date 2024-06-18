const Task = require('../models/Task')


module.exports = class TaskController {
    static createTask(req, res) {
        res.render('tasks/create')
    }

    static async createTaskSave(req, res) {

        const task = {
            title: req.body.title,
            description: req.body.description,
            done: false
        }
        // validacoes
        //processar dados
        
        if(task.title === 'Teste') {
            console.log('Nao é permitido este titulo')
            res.redirect('/tasks/add')
        } else {

        await Task.create(task)

        res.redirect('/tasks')
        }
    }

    static showTask(req, res) {
        res.render('tasks/all')
    }
}
