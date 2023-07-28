// import express from 'express';
// const app = express();
//
// app.use(express.json()); // Aquí agregamos los paréntesis para invocar la función
//
// const students = [
//     {id:1, name: 'Benito'},
//     {id:2, name: 'Pedro'}
// ]
//
// app.get('/', (req, res) => {
//     res.send('Node JS API en la ruta /')
// })
//
// app.get('/api/students', (req, res) => {
//     res.send(students)
// })
//
//
// const port = process.env.PORT || 5173; // La variable debe ser en mayúsculas
// app.listen(port, () => console.log(`Escuchando puerto ${port}`));

///////////////////////////////////////////////////

// const express = require('express');
// const app = express();
//
// app.get('/realizar-proceso', (req, res) => {
//   // Realiza el proceso que necesitas en el backend
//   console.log('Hola desde el backend');
//
//   // Envía una respuesta al frontend con el resultado
//   res.send('Proceso realizado en el backend');
// });
//
// app.listen(5173, () => {
//   console.log('Servidor backend escuchando en http://localhost:5173');
// });

/////////////////////////////////////////////////////

const express = require('express');
const cors = require('cors');
const {OpenAIEmbeddings} = require("langchain/embeddings");
const {FaissStore} = require("langchain/vectorstores/faiss");
const {JSONLoader} = require("langchain/document_loaders/fs/json");
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Puerto de tu backend

app.use(bodyParser.json());
app.use(cors());

// Ruta que responde a la solicitud del frontend
app.get('/tu-endpoint', (req, res) => {
  // Proceso que deseas realizar en el backend
  console.log('Hola desde el backend');
  res.send('Proceso en backend completado'); // Envía una respuesta al frontend (puede ser cualquier otro tipo de datos)
});

app.post('/cargar-contexto', async (req, res) => {
  try {
    // Obtener los parámetros enviados desde el frontend utilizando Axios
    const { pregunta, key } = req.body;

    const loaderJson = new JSONLoader('datos.json');
    const docsJson = await loaderJson.load();

    const vectorStore = await FaissStore.fromDocuments(
      docsJson,
      new OpenAIEmbeddings({
        openAIApiKey: key,
      })
    );

    const similaryContext = await vectorStore.similaritySearch(pregunta, 1);

    console.log('Backend dice :' + similaryContext)
    // Enviar el resultado al frontend
    res.json({ result: similaryContext });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});