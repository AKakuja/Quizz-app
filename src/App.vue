<template>
  <div>
    <h1>Quiz Game Admin</h1>

    <h2>Questions List</h2>
    <ul>
      <li v-for="question in questions" :key="question.id">
        {{ question.pregunta }}
        <ul>
          <li v-for="respuesta in question.respostes" :key="respuesta.id">
            {{ respuesta.etiqueta }}
          </li>
        </ul>
        <img :src="question.imatge" alt="Question Image" v-if="question.imatge" class="question-image" />
        <button @click="editQuestion(question)">Edit</button>
        <button @click="deleteQuestion(question.id)">Delete</button>
      </li>
    </ul>

    <h2>Add New Question</h2>
    <form @submit.prevent="addQuestion">
      <input v-model="newQuestion.pregunta" placeholder="Enter new question" required />
      <div v-for="(respuesta, index) in newQuestion.respostes" :key="index">
        <input v-model="respuesta.etiqueta" placeholder="Enter answer" required />
      </div>
      <button type="button" @click="addAnswer">Add Answer</button>
      <select v-model="newQuestion.resposta_correcta">
        <option v-for="(respuesta, index) in newQuestion.respostes" :key="index" :value="index">
          {{ respuesta.etiqueta }}
        </option>
      </select>
      <input v-model="newQuestion.imatge" placeholder="Enter image URL" />
      <button type="submit">Add Question</button>
    </form>

    <div v-if="editQuestionData">
      <h2>Edit Question</h2>
      <form @submit.prevent="updateQuestion">
        <input v-model="editQuestionData.pregunta" required />
        <div v-for="(respuesta, index) in editQuestionData.respostes" :key="index">
          <input v-model="respuesta.etiqueta" required />
        </div>
        <select v-model="editQuestionData.resposta_correcta">
          <option v-for="(respuesta, index) in editQuestionData.respostes" :key="index" :value="index">
            {{ respuesta.etiqueta }}
          </option>
        </select>
        <input v-model="editQuestionData.imatge" placeholder="Enter image URL" />
        <button type="submit">Update Question</button>
      </form>
    </div>
  </div>
</template>

<script>

import { getPreguntes } from './communicationManager.js'

export default {
  name: 'App',
  data () {
    return {
      questions: [],
      newQuestion: {
        pregunta: '',
        respostes: [
          { etiqueta: '' },
          { etiqueta: '' },
          { etiqueta: '' },
          { etiqueta: '' }
        ],
        resposta_correcta: 0, // Ajustado para trabajar con índices 0-3
        imatge: ''
      },
      editQuestionData: null
    }
  },
  methods: {
    async fetchQuestions () {
      try {
        this.questions = await getPreguntes()
      } catch (error) {
        console.error('Error fetching questions:', error)
      }
    },
    async addQuestion () {
      try {
        // Asegurarse de que las respuestas tengan siempre IDs 1, 2, 3, 4
        this.newQuestion.respostes = this.newQuestion.respostes.map((respuesta, index) => ({
          id: index + 1, // Asignar IDs fijos del 1 al 4
          etiqueta: respuesta.etiqueta
        }))

        await fetch('http://localhost:3000/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.newQuestion)
        })

        // Resetear el formulario después de agregar la pregunta
        this.newQuestion = {
          pregunta: '',
          respostes: [
            { etiqueta: '' },
            { etiqueta: '' },
            { etiqueta: '' },
            { etiqueta: '' }
          ],
          resposta_correcta: 0,
          imatge: ''
        }

        this.fetchQuestions()
      } catch (error) {
        console.error('Error adding question:', error)
      }
    },
    editQuestion (question) {
      this.editQuestionData = JSON.parse(JSON.stringify(question))
    },
    async updateQuestion () {
      try {
        this.editQuestionData.respostes = this.editQuestionData.respostes.map((respuesta, index) => ({
          id: index + 1, // Fijar IDs de respuestas del 1 al 4
          etiqueta: respuesta.etiqueta
        }))

        await fetch(`http://localhost:3000/questions/${this.editQuestionData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.editQuestionData)
        })

        // Limpiar los datos después de actualizar la pregunta
        this.editQuestionData = null
        this.fetchQuestions()
      } catch (error) {
        console.error('Error updating question:', error)
      }
    },
    async deleteQuestion (id) {
      try {
        const response = await fetch(`http://localhost:3000/questions/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          this.fetchQuestions()
        } else {
          console.error('Error deleting question:', response.statusText)
        }
      } catch (error) {
        console.error('Error deleting question:', error)
      }
    },
    addAnswer () {
      if (this.newQuestion.respostes.length < 4) {
        this.newQuestion.respostes.push({ etiqueta: '' })
      } else {
        alert('No puedes agregar más de 4 respuestas')
      }
    }
  },
  created () {
    this.fetchQuestions()
  }
}
</script>

<style>
ul {
  list-style: none;
}
li {
  list-style: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.question-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
