const { response } = require('express')
const express = require('express')
const { type } = require('os')
const app = new express()
const PORT = 3001
const path = require('path')
const morgan = require('morgan')

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.use(express.json())




// app.use(morgan('tiny'))
morgan.token('person', function (req, res) {
  
  let name = req.body.name
  let number = req.body.number
  // console.log(req.body.number)

   return JSON.stringify({name, 
          number
  })
  
  })
app.use(morgan(':method :url :response-time :person', {
  skip: function (req, res) { return req.method !== "POST" }
}))

app.use(morgan('tiny', {
  skip: function (req, res) { return req.method === "POST" }
}))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html') 
})

app.get('/info', (req, res) => {
    res.send(`<div>Phonebook has info for ${phonebook.length}</div><div>${Date()}</div>`)
})

app.get('/api/persons', (req, res) => {
    res.json(phonebook)
})

app.get('/api/persons/:id', (req, res)=> {
    const id = Number(req.params.id)
    const entry = phonebook.find(elem => {
        return elem["id"] === id
    })
    if(entry){
        res.json(entry)
    }
    else{
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const content = req.body
    
    if (!content.name || !content.name){
        return res.status(400).json({ 
          error: 'content missing' 
        }) 
      }

      
    const id = Math.floor(Math.random() * 100000)
    const name = content.name
    const number = content.name

      const person = {
        id,
        name,
        number
    }
    
    const entry = phonebook.find(elem => {
        return elem["name"] === name
    })

    if(entry){
        return res.status(400).json({ 
            error: 'name must be unique' 
          }) 
    }


    // console.log(person)
    phonebook.push(person)


    res.json(phonebook)
})


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id) 
    phonebook = phonebook.filter((elem) => {
        return elem["id"] !== id
    })  

    res.status(204).end()

})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})