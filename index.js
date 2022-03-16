const { response } = require("express");
const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Marry Poppendick",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    console.log(req.params, id, person);
    res.json(person);
  } else {
    return res.status(404).json({
      error: "not found"
    });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    console.log(req.params, id);
    const newPersons = persons;
    persons = newPersons.filter(person => person.id !== id)
    console.log(persons)
    res.json(`${person.name} was deleted succesfully`);
  } else {
    return res.status(404).json({
      error: "not found"
    });
  }
});

app.get("/info", (req, res) => {
  const timestamp = new Date();
  const infoElement = `<p>Phonebook has info for ${persons.length} people</p><p>${timestamp}</p>`;
  res.send(infoElement);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
