const express = require('express')
const crypto = require('node:crypto')
const cors= require('cors')
const movies = require('./movies.json')
const { validateMovie, validatepartialmovie } = require('./schemas/movies')
const app = express()

app.disable('x-powered-by')
app.use(express.json())
app.use(cors({
    origin: [
        "http://localhost:"
    ]
}))

app.get('/', (req, res) => {
    res.json({
        mesagge: 'Hoola Mundo'
    })
})
app.get('/movies', (req, res) =>{
 const { genre } = req.query
    if(genre){
       const filterMovies = movies.filter(
           movie=>movie.genre.some(genre=> genre.toLowerCase()=== genre.toLowerCase()))
            return res.json(filterMovies)
}
    res.status(200).json(movies)
})
app.get('/movies/:id', (req, res) => {

    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)
    res.status(404).json({ mesagge: 'Movie not found' })
})

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)
    if (result.error) {
        return res.status(400).json({
            error: JSON.
                parse(result.error.message)
        })
    }
    const newmovie = {
        id: crypto.randomUUID(),
        ...result.data
    }
    movies.push(newmovie);
    res.status(201).json(newmovie)
})
app.patch('/movies/:id', (req, res) => {
    const result = validatepartialmovie(req.body);
    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params;
    const movieID = movies.findIndex(movie => movie.id === id)
    if (movieID === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }
    const updatemovie = {
        ...movies[movieID],
        ...result.data
    }
    movies[movieID] = updatemovie
    return res.json(updatemovie)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`Sever listening on port ${PORT}`)
})
///Idempotencia
///propiedad de realizar una accion determinadas varias veces y aun asi conseguir siempre el mismo resultado que se obtendria al hacerlo una vez
///POST crear un nuevo elemento o recurso en el servidor NO idenpotente
///PUT acualizar totalmente un elemento ya existente o crearlo si no existe Si idempotente por lo que se pasa la id
///PATCH actualizar parcialmente un elemento/recurso Si y no idempotente por lo que se pasa la id

