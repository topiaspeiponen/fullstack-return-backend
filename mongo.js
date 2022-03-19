const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url =
  `mongodb+srv://admin:${password}@cluster0.lkkuw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personSchema)

// get persons from db
if (process.argv.length === 3) {
    Person
    .find({})
    .then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
// add person into db
else if (process.argv.length === 5) {
    const newPerson = new Person({
        name: personName,
        number: personNumber
    })
    
    newPerson.save().then(result => {
        console.log(`added ${newPerson.name} number ${newPerson.number} to phonebook`)
        mongoose.connection.close()
    })
}

