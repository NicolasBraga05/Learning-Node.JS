const Pet = require('../models/Pet')

// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {

    static async create(req, res) {
        
        const {name, age, color, weight} = req.body

        const image = req.files

        const available = true


        // images upload


        // validations
        if(!name) {
            res.status(422).json({
                message: 'O name é obrigatorio!'
            })
            return
        }
        
        if(!age) {
            res.status(422).json({
                message: 'A idade é obrigatoria!'
            })
            return
        }

        if(!color) {
            res.status(422).json({
                message: 'A cor é obrigatoria!'
            })
            return
        }

        if(!weight) {
            res.status(422).json({
                message: 'O peso é obrigatorio!'
            })
            return
        }

        if(image.length === 0) {
            res.status(422).json({
                message: 'A imagem é obrigatoria!'
            })
            return
        }

        // get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        // create a pet
        const pet = new Pet({
            name,
            age,
            color,
            weight,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            },
        })

        image.map((image) => {
            pet.images.push(image.filename)
        })
        try {
            const newPet = await pet.save()
            res.status(201).json({
                message: 'Pet cadastrado com sucesso!', newPet})
        } catch (error) {
            res.status(500).json({message: error})
        }
    }

    static async getAll(req, res) {

        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({
            pets: pets,
        })
    }

    static async getAllUserPets(req, res) {

        // get user from token

        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'user._id': user._id }).sort('-createdAt')

        res.status(200).json({
            pets,
        })
    }

    static async getAllUserAdoptions(req, res) {

        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'adopter._id': user._id}).sort('-createdAt')

        res.status(200).json({
            pets,
        })
    }

    static async getPetById(req, res) {

        const id = req.params.id

        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID invalido!'})
            return
        }
        
        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({message: 'Pet nao encontrado!'})
            return
        }
        res.status(200).json({pet: pet})
        
    }

    static async removePetById(req, res) {

        const token = getToken(req)
        const user = await getUserByToken(token)

        const id = req.params.id
        

        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID invalido'})
            return
        }

        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado!'})
            return
        }

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Houve um problema em processar a sua solitacao, tente novamente mais tarde!'})
            return
        }
        await Pet.deleteOne({_id: id})
        res.status(200).json({message: 'Pet deletado com sucesso!'})
    }

    static async editPet(req, res) {

        // get owner pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        const id = req.params.id

        const image = req.files

        const updatedData = {}

        const {name, age, color, weight, available} = req.body

        if(!ObjectId.isValid(id)) {
            res.status(422).json({
                message: 'ID invalido'
            })
        }

        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado!'})
            return
        }

        if(pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: 'Houve um problema em processar a sua solitacao, tente novamente mais tarde!'})
            return
        }

        if(!name) {
            res.status(422).json({
                message: 'O name é obrigatorio!'
            })
            return
        } else{
            updatedData.name = name
        }
        
        if(!age) {
            res.status(422).json({
                message: 'A idade é obrigatoria!'
            })
            return
        } else{
            updatedData.age = age
        }

        if(!color) {
            res.status(422).json({
                message: 'A cor é obrigatoria!'
            })
            return
        } else{
            updatedData.color = color
        }
        

        if(!weight) {
            res.status(422).json({
                message: 'O peso é obrigatorio!'
            })
            return
        } else{
            updatedData.weight = weight
        }
        
        if(image) { 
            updatedData.image = []
            image.map((image) => {
                updatedData.image.push(image.filename)
            })
        }

        try {

            // returns user updated data
            await Pet.findByIdAndUpdate(
                id,
                updatedData
            )

            res.status(200).json({
                message: 'Pet atualizado com sucesso!'
            })

        } catch(error) {
            res.staus(500).json({
                message: `Nao foi possivel realizar a atualização: ${error}`
            })
            return
        }
    }

    static async schedule(req, res) {

        const id = req.params.id

        const token = getToken(req)
        const user = await getUserByToken(token)


        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado!'})
            return
        }
        
        if(pet.user._id.equals(user._id)){

            res.status(422).json({
                message: 'Você não pode agendar uma visita para o seu próprio Pet!'
            })
            return
        }

        if(pet.adopter) {
            if(pet.adopter._id.equals(user._id)){
                res.status(422).json({
                    message: 'Você já agendou uma visita para este Pet!'
                })
                return
            }
        }

        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }
        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo o numero ${pet.user.phone}`})
    }

    static async concludeAdoption(req, res) {

        const id = req.params.id
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({
                message: 'Pet não encotrado!'
            })
            return
        }
        

        if(pet.user._id.toString() !== user._id.toString()){
            res.status(422).json({
                message: 'Houve um problema, tente novamente mais tarde!'
            })
            return
        }
        pet.available = false

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message: 'Parabens! o ciclo de adoção foi finalizado com sucesso!'
        })
    }
}