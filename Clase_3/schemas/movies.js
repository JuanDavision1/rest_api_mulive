const z= require('zod')
const movieSchema = z.object({
    title:z.string({
        invalid_type_error:'Must be string',
        required_error:'Movie Title is required'

    }),
    year :z.number().int().positive().max(2024),
    director:z.string(),
    duration:z.number().int().positive(),
    rate:z.number().min(0).positive().default(5),
    poster:z.string().url(),
    genre:z.array(
        z.enum(['Action','Drama','Comedy','Drama','Fantasy','Horror','Thriller','Sci-Fi']),
        {
            invalid_type_error:'Must be string',
            required_error:'Movie Title is required'
        }
        )})

function validateMovie(object) {
    return movieSchema.safeParse(object)
}
function validatepartialmovie(object){
    return movieSchema.partial().safeParse(object)
}
module.exports ={
    validateMovie,
    validatepartialmovie
}