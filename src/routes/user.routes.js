const express = require('express');

const router = express.Router();

const User = require('../models/User');

const Properties = require('../models/Properties');

const bcrypt = require('bcryptjs');

const Yup = require('yup');
const { log } = require('npmlog');

const messagebird = require('messagebird')('IsfZk3AuRJOMMppmSUuGhIik0');


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

    const telefoneExist = await User.findOne({ telefone: body.telefone });

    if (telefoneExist) {
        return res.json({ error: true, message: 'Este telefone já possui uma conta' });
    };

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
            return res.json({ error: true, message: 'Usuário ou senha invádido.' });
        };

        if (!(await bcrypt.compare(body.senha, user.senha))) {
            return res.json({ error: true, message: 'Usuário ou senha invádido.' });
        };

        res.json({ error: false, user });

    } catch (err) {
        res.json({ error: true, message: err.message });
    };

});


//atualiza dados user
router.put('/edita/:id', async (req, res) => {
    try {
        const body = req.body;
        const id = req.params.id;

        const userRefreshed = await User.findByIdAndUpdate(id, body);

        res.json({ error: false, userRefreshed });

    } catch (error) {
        res.json({ error: true, message: error.message });
    }
});



//envia validacao sms (recover)
router.post('/enviasmsvalidacao', async (req, res) => {

    const number = req.body.telefone;
    res.json(number);

    const telefoneExist = await User.findOne({ telefone: number });

    if (!telefoneExist) {
        return res.json({ error: true, message: '' });
    }

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


//troca de telefone
router.post('/enviasmsvalidacaotroca', async (req, res) => {

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
            res.json({ response });
        }
    })
});


//valida sms mandado (senha)
router.post('/smsvalidacao', async (req, res) => {
    var id = req.body.id;
    var token = req.body.token;
    var telefoneNumber = req.body.telefone;

    const userExist = await User.findOne({ telefone: telefoneNumber });

    if (!userExist) {
        return res.json({ error: true, message: 'Este telefone não possui uma conta' });
    };

    messagebird.verify.verify(id, token, (err, response) => {
        if (err) {
            res.json({ error: true, id: id });
        } else {
            res.json({ error: false, message: 'SMS validado com sucesso' });
        }
    })
});


//valida sms mandado (troca de telefone)
router.post('/smsvalidacaotelefone', async (req, res) => {
    var id = req.body.id;
    var token = req.body.token;
    var telefoneNumber = req.body.telefone;
    var idUser = req.body.idUser;

    messagebird.verify.verify(id, token, async (err, response) => {
        if (err) {
            res.json({ error: true, id: id });
        } else {

            const data = { telefone: telefoneNumber };

            const response = await User.findByIdAndUpdate(idUser, data);

            res.json({ error: false, message: 'SMS validado com sucesso', response });
        }
    })
});



//user adiconar favorito;
router.put('/addfavorites/:idUser', async (req, res) => {
    try {

        const idUser = req.params.idUser;

        let user = await User.findById(idUser);

        let allProps = user.imoFavoritos;

        const propExist = allProps.some(item => item._id == req.body._id);

        if (propExist) {
            return res.json({ error: true, message: 'Imóvel já cadastrado' });
        };

        console.log(allProps);
        console.log(req.body);

        const userRefreshed = await User.findByIdAndUpdate(idUser, { imoFavoritos: [...allProps, req.body] });

        res.json({ error: false, userRefreshed });

    } catch (error) {
        res.json({ error: true, message: error.message });
    }
});


///remover favorito
router.put('/removefavorite/:idUser', async (req, res) => {

    const idUser = req.params.idUser;

    const body = req.body;


    try {

        const user = await User.findById(idUser);

        let allFavorites = user.imoFavoritos;

        const propExist = allFavorites.filter(item => item._id == body._id);

        if (propExist) {
            const newFavorites = allFavorites.filter(item => item._id != body._id);

            const dataRefreshed = await User.findByIdAndUpdate(idUser, { imoFavoritos: newFavorites });

            res.json({ error: false, message: 'Imóvel deletado com sucesso' });
        };

    } catch (error) {
        res.json({ error: true, message: error.message });
    }
});


//busca favoritos
router.get('/callfavorites/:id', async (req, res) => {

    try {

        const userId = req.params.id;

        const user = await User.findById(userId);

        res.json({ error: false, favoriteProps: user.imoFavoritos });

    } catch (error) {
        res.json({ error: true, message: error.message });
    }

});



//troca foto de perfil
router.put('/trocafoto/:idUser', async (req, res) => {

    try {

        const body = req.body;

        const idUser = req.params.idUser;

        const newFoto = await User.findByIdAndUpdate(idUser, { foto: body.foto });

        res.json({ error: false, newFoto });

    } catch (error) {

        res.json({ error: true, message: error.message });
    }

});



//carregar imoveis do user
router.get('/imoveis/:idUser', async (req, res) => {

    const userId = req.params.idUser;

    try {

        let allProps = await Properties.find({});

        const propsUser = allProps.filter(item => item.dono.id == userId);

        res.json({ error: false, propsUser });

    } catch (error) {
        res.json({ error: true, message: error.message });
    }

});

module.exports = router;