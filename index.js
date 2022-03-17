const { response } = require("express");
const express = require("express");
const morgan = require('morgan')
const app = express();

app.use(express.json());
morgan.token('reqBody', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time  ms :reqBody'))
app.use(express.static('build'))


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
app.post("/api/persons", (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "missing name or number"
          });
    }

    if (persons.some(person => person.name === body.name)) {
        return res.status(406).json({
            error: "name must be unique"
          });
    }

    const initialPerson = {
        name: body.name,
        number: body.number
    }

    const newPerson = {...initialPerson, id: Math.floor(Math.random() * 9000000) }

    persons.push(newPerson)
    res.json(`${newPerson.name} was succesfully added`);
   
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
