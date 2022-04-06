const { eachDayOfInterval, parseISO, nextDay } = require('date-fns');
const express = require('express');
const req = require('express/lib/request');
const { json } = require('express/lib/response');

const router = express.Router();

const Properties = require('../models/Properties');

const Schedules = require('../models/Schedules');

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



//faz o agendamento de um imovel
router.post('/agendamento', async (req, res) => {
    try {

        const body = req.body;

        //pega agendamentos do imovel selecionado
        let SchedulesOfPropSelected = await Schedules.find({ 'imovel._id': body.imovel._id });

        let permSchedule = true;

        if (SchedulesOfPropSelected.length == 0) {
            const newSchedule = await new Schedules(body).save();
            res.json({ error: false, newSchedule });
            return console.log('salvo por nao ter dados no banco');
        };

        let intervalScheduleUser = eachDayOfInterval({
            start: parseISO(body.dataInicio),
            end: parseISO(body.dataFim)
        });


        for (let i = 0; i < intervalScheduleUser.length; i++) {

            SchedulesOfPropSelected.map((item) => {

                let intervalScheduleItem = eachDayOfInterval({
                    start: parseISO(item.dataInicio),
                    end: parseISO(item.dataFim)
                });

                let scheduleExist = intervalScheduleItem.some(any => JSON.stringify(any) == JSON.stringify(intervalScheduleUser[i]));

                if (scheduleExist) {
                    permSchedule = false;
                }
            })
        };

        if (!permSchedule) {
            return res.json({ error: true, message: 'Uma ou mais datas já alugadas.' });
        } else {
            const newSchedule = await new Schedules(body).save();
            res.json({ error: false, newSchedule });
        }

    } catch (error) {
        res.json({ error: true, message: error.message });
    }
});


//cancela um determinado agendamento
router.delete('/cancelchedule/:idSchedule', async (req, res) => {

    try {

        const idProp = req.params.idSchedule;

        const response = await Schedules.findByIdAndDelete(idProp);

        res.json({ error: false, message: 'Agendamento cancelado com sucesso!' });

    } catch (error) {
        res.json({ error: true, message: error.message });
    }
})



module.exports = router;