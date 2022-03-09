const express = require('express');

const router = express.Router();

const User = require('../models/User');

const bcrypt = require('bcryptjs');

const Yup = require('yup');

const messagebird = require('messagebird')('BQis0I9PD9f41xYpVtUBmCiEI');


//cadastro do usuario
router.post('/cadastro', async (req, res) => {
    const body = req.body;

    const schema = Yup.object().shape({
        email: Yup.string().required().email(),
        senha: Yup.string().required().min(6)
    });

    if (!(await schema.isValid(body))) {
        return res.json({ error: true, message: 'Dados inválidos.' });
    };

    body.senha = await bcrypt.hash(body.senha, 7);

    const emailExist = await User.findOne({ email: body.email });

    if (emailExist) {
        return res.json({ error: true, message: 'Este email já possui uma conta.' })
    } else {

        try {
            const newUser = await new User(body).save();
            res.json({ error: false, message: 'Usuário cadastrado com sucesso!', newUser });
        } catch (err) {
            return res.json({ error: true, message: err.message });
        }
    };
});


//login do usuario
router.post('/login', async (req, res) => {
    const body = req.body;

    try {
        const user = await User.findOne({ email: body.email });

        if (!user) {
            return res.json({ error: true, message: 'Usuário não encontrado.' });
        };

        if (!(await bcrypt.compare(body.senha, user.senha))) {
            return res.json({ error: true, message: 'Senha incorreta.' });
        };

        res.json({ error: false, user });

    } catch (err) {
        res.json({ error: true, message: err.message });
    };

});


//envia validacao sms
router.post('/enviasmsvalidacao', async (req, res) => {
    const number = req.body.telefone;

    messagebird.verify.create(number, {
        originator: 'Code',
        template: 'Seu código de verificação para Maclocação é %token.'
    }, function (err, response) {
        if (err) {
            console.log(err);
            res.json({ error: true, message: 'Não foi possível enviar SMS' });
        } else {
            console.log(response);
            res.json({ id: response.id });
        }
    })
});


//valida sms mandado
router.post('/smsvalidacao', (req, res) => {
    var id = req.body.id;
    var token = req.body.token;

    messagebird.verify.verify(id, token, (err, response) => {
        if (err) {
            res.json({ error: true, id: id });
        } else {
            res.json({ error: false, message: 'SMS validado com sucesso' })
        }
    })
})

module.exports = router;