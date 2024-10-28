import api from '../../../utils/api'

import styles from './AddPet.module.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* components */
import PetForm from '../../form/PetForm.js'

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage'


function AddPet() {
    const [token] = useState(localStorage.getItem('token') || '')
    const {setFlashMessage} = useFlashMessage()
    const navigate = useNavigate()

    async function registerPet(pet) {
        let msgType = 'success'

        const formData = new FormData()

        await Object.keys(pet).forEach((key) => {
            if (key === 'images') {
                for (let i = 0; i < pet[key].length; i++) {
                    formData.append('images', pet[key][i])
                }
            } else {
                formData.append(key, pet[key])
            }
        })

        const data = await api.post('/pets/create', formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        })
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            msgType = 'error'
            return error.response.data
        })

        setFlashMessage(data.message, msgType)

        if (msgType !== 'error') {
            navigate('/pets/mypets')
        }
    }

    // Mover o return para fora de registerPet
    return (
        <section className={styles.addpet_header}>
            <div>
                <h1>Cadastre um pet</h1>
                <p>Depois ele ficará disponível para adoção</p>
            </div>
            <PetForm handleSubmit={registerPet} btnText='Cadastrar Pet' />
        </section>
    )
}

export default AddPet
