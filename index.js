
const express = require('express');
const morgan = require("morgan");
const cors = require('cors');

const app = express();
let body;

app.use(express.json());
app.use(cors());

let persons = [
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
];

morgan.token('log', function(req, res){
    return JSON.stringify(body);
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :log"))

// Displaying message
app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
    );
})

// Get All
app.get('/api/persons/', (request, response) => {
    response.json(persons);
});

// Get By
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    console.log(id);
    const person = persons.find(person => person.id === id);
    // Handle undefined results in find method
    if (person)
        response.json(person);
    else
        response.status(404).end();
})

// DELETE 
app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    person = persons.filter(person => person.id === id);
    response.status(204).end();
})

// POST 
app.post("/api/persons", (request, response) => {
    body = request.body;
    const newId = Math.floor(Math.random() * 999);
    const exist = persons.some(x => x.name == body.name);
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "The number or name is missing"
        })
    } else if (exist) {
        return response.status(400).json({
            error: `Cannot be two registers with the same name (${body.name})`
        })
    } else {
        const person = {
            name: body.name,
            number: body.number,
            id: newId
        }

        persons = persons.concat(person);
        response.json(person);
    }


})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint "})
}
app.use(unknownEndpoint);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})