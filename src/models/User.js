const mongoose = require('mongoose');

const User = mongoose.model('User', {
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    rg: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    endereco: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true
    },
    foto: {
        type: String,
        required: false
    },
    imoFavoritos: {
        type: Array,
        required: false
    },
    imoPosted: {
        type: Array,
        required: false
    },
    UltPaga: {
        type: Array,
        required: false
    }
});

module.exports = User;