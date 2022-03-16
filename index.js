const express = require('express')
const app = express()

let persons = [
          {
            "name": "Arto Hellas",
            "number": "040-123456",
            "id": 1
          },
          {
            "name": "Ada Lovelace",
            "number": "39-44-5323523",
            "id": 2
          },
          {
            "name": "Dan Abramov",
            "number": "12-43-234345",
            "id": 3
          },
          {
            "name": "Marry Poppendick",
            "number": "39-23-6423122",
            "id": 4
          }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
    const timestamp = new Date();
    const infoElement = `<p>Phonebook has info for ${persons.length} people</p><p>${timestamp}</p>`;
    res.send(infoElement);
  })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})