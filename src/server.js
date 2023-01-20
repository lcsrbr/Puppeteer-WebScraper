const pup = require('./index')
const express = require('express')
const app = express();

const PORT = 3001;
let NotesLenovo;
app.use(express.json());
app.listen(PORT, async () => {
    NotesLenovo = await pup()
    console.log(`Running server on port: ${PORT}`)
});

app.get('/',async (_req, res) => {
    return res.status(200).json(NotesLenovo)
})

app.get('/:id',async (req, res) => {
    const {id} = req.params
    const filter = NotesLenovo.filter((note) => note.id === Number(id))
    return res.status(200).json(filter)
})


