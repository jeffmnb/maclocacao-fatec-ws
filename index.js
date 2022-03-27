const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./src/routes/user.routes');
const propertiesRoutes = require('./src/routes/properties.routes');

const app = express();

app.use(cors());

app.use(bodyParser.json({
    limit: '300mb'
}));

app.use(bodyParser.urlencoded({
    limit: '300mb',
    parameterLimit: 300000,
    extended: true
}));

app.use('/user', userRoutes);
app.use('/properties', propertiesRoutes);


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