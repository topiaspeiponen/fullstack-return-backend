require('dotenv').config()
const { response } = require("express");
const express = require("express");
const morgan = require('morgan')
const app = express();


app.use(express.json());
morgan.token('reqBody', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time  ms :reqBody'))
app.use(express.static('build'))
const Person = require('./models/person')

/** 
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
];*/

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then(persons => {
      console.log('persons found ', persons)
      res.json(persons)
    })
    .catch(error => next(error))
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person)
    })
    .catch(error => next(error))
});
app.post("/api/persons", (req, res, next) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "missing name or number"
          });
    }

    /*if (persons.some(person => person.name === body.name)) {
        return res.status(406).json({
            error: "name must be unique"
          });
    }*/

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    //const newPerson = {...initialPerson, id: Math.floor(Math.random() * 9000000) }

    newPerson.save()
      .then(result => {
        res.json(`${newPerson.name} was succesfully added`);
      })
      .catch(error => next(error))
   
  });

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true})
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      console.log('person deleted ', result)
      res.status(204).end()
    })
    .catch(error => next(error))
});

app.get("/info", (req, res, next) => {
  Person.find({}).then(persons => {
    const timestamp = new Date();
    const infoElement = `<p>Phonebook has info for ${persons.length} people</p><p>${timestamp}</p>`;
    res.send(infoElement);
  })
  .catch(error => next(error))
  
});

const errorHandler = (error, req, res, next) => {
  console.error('error handler encountered error: ', error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else {
    return res.status(400).send({ error: 'bad request'})
  }
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
