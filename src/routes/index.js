import express from 'express';
const app = express();

app.use(express.json()); // Aquí agregamos los paréntesis para invocar la función

const students = [
    {id:1, name: 'Benito'},
    {id:2, name: 'Pedro'}
]

app.get('/', (req, res) => {
    res.send('Node JS API en la ruta /')
})

app.get('/api/students', (req, res) => {
    res.send(students)
})

const port = process.env.PORT || 5173; // La variable debe ser en mayúsculas
app.listen(port, () => console.log(`Escuchando puerto ${port}`));
