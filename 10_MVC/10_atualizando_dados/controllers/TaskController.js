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

    static async showTask(req, res) {

        const tasks =  await Task.findAll({raw: true})

        res.render('tasks/all', {tasks})

    }

    static async removeTask(req, res) {

        const id = req.body.id

        await Task.destroy({where: {id: id}})

        res.redirect('/tasks')
    }

    static async updateTask(req, res) {
        const id = req.params.id
        
        const task = await Task.findOne({where:{id:id}, raw: true})

        res.render('tasks/edit', {task: task})
    }

    static async updateTaskPost(req, res) {
        const id = req.body.id
        
        const task = {
            title: req.body.title,
            description: req.body.description
        }

        await Task.update(task, {where: {id: id}})

        res.redirect('/tasks')

    }
}
