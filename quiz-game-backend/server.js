const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 25850;

app.use(bodyParser.json());
app.use(cors());

let questions = require('./questions.json');

app.get('/questions', (req, res) => {
    res.json(questions);
});

app.post('/questions', (req, res) => {
    const newQuestion = req.body;
    newQuestion.id = questions.length ? parseInt(questions[questions.length - 1].id) + 1 : 1;

    newQuestion.respostes = newQuestion.respostes.map((respuesta, index) => ({
        id: index + 1,  
        etiqueta: respuesta.etiqueta
    }));

    questions.push(newQuestion);
    fs.writeFileSync('./questions.json', JSON.stringify(questions, null, 2));
    res.status(201).json(newQuestion);
});

app.put('/questions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedQuestion = req.body;

    updatedQuestion.respostes = updatedQuestion.respostes.map((respuesta, index) => ({
        id: index + 1,  
        etiqueta: respuesta.etiqueta
    }));

    const index = questions.findIndex(question => question.id === id);
    if (index !== -1) {
        questions[index] = updatedQuestion;
        fs.writeFileSync('./questions.json', JSON.stringify(questions, null, 2));
        res.json(questions[index]);
    } else {
        res.status(404).send('Question not found');
    }
});


app.delete('/questions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = questions.length;
    questions = questions.filter(question => question.id !== id);

    if (questions.length < initialLength) {
        fs.writeFileSync('./questions.json', JSON.stringify(questions, null, 2));
        res.status(204).send();
    } else {
        res.status(404).send('Question not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
