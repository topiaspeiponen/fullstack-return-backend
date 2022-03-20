require('dotenv').config()
const { response } = require("express");
const express = require("express");
const cors = require('cors')
const morgan = require('morgan')
const app = express();


app.use(express.json());
app.use(cors())
morgan.token('reqBody', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time  ms :reqBody'))
app.use(express.static('build'))
const Person = require('./models/person')


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

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save()
      .then(() => {
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

  Person.findByIdAndUpdate(req.params.id, person, 
    {
      new: true,
      runValidators: true,
      context: 'query'
    })
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
  console.error('error handler encountered error: ', error.message, error.name, error.name === 'ValidationError')
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else {
    return res.status(400).send({ error: 'bad request'})
  }
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
