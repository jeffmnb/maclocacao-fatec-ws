const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./src/routes/user.routes');

const app = express();

app.use(bodyParser.json())
app.use(cors());

app.use('/user', userRoutes);


mongoose.connect('mongodb://localhost:27017/maclocacao', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Banco de dados conectado!');
}).catch((err) => {
    console.log(err.message);
});



app.listen(8000, () => {
    console.log('Servidor rodando');
})