const mongoose = require('mongoose');

const Properties = mongoose.model('Properties', {
    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    permAnimais: {
        type: Boolean,
        required: true
    },
    fotos: {
        type: Array,
        required: false //MUDAR PARA TRUE DEPOIS!
    },
    dono: {
        nome: {
            type: String,
            required: true
        },
        telefone: {
            type: String,
            required: true
        }
    },
    nota: {
        numLikes: {
            type: Number,
            required: true
        },
        notaFinal: {
            type: Number,
            required: true
        }
    }
});

module.exports = Properties;
