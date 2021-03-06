const express = require('express');
const req = require('express/lib/request');

const router = express.Router();

const Properties = require('../models/Properties');

//cadastro de imoveis
router.post('/cadastro', async (req, res) => {

    const body = req.body;

    try {

        const propertieExist = await Properties.findOne({ nome: body.nome, 'dono.nome': body.dono.nome });

        if (propertieExist) {
            return res.json({ error: true, message: 'Usuário já criou um imovel com este nome' });
        };

        const newProperties = await new Properties(body).save();

        res.json({ error: false, newProperties });

    } catch (error) {
        res.json({ error: true, message: error.message });
    }
});


//resgata todos os imoveis
router.get('/', async (req, res) => {

    try {

        const allProperties = await Properties.find({});

        res.json({ error: false, allProperties });

    } catch (error) {
        res.json({ error: true, message: error.message });
    }

});


//exclui algum imovel
router.delete('/delimo', async (req, res) => {
    try {
        const id = req.body.id;

        await Properties.findByIdAndDelete(id);

        res.json({ error: false, message: 'Deletado com sucesso!' });
    } catch (err) {
        res.json({ error: false, message: err.message });
    }
});


//resgata pela categoria
router.post('/propcategoria', async (req, res) => {

    try {

        const category = req.body.title;

        const propsWithCategory = await Properties.find({ 'actions.title': category });

        res.json({ error: false, propsWithCategory });

    } catch (error) {
        res.json({ error: true, message: error.message });
    }

});


module.exports = router;