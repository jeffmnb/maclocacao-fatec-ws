const mongoose = require('mongoose');

const Properties = mongoose.model('Properties', {
    nome: {
        type: String,
        required: true
    },
    endereco: {
        cidade: {
            type: String,
            required: true
        },
        rua: {
            type: String,
            required: true
        },
        numero: {
            type: String,
            required: true
        },
        estado: {
            type: String,
            required: true
        }
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
    },
    actions: {
        type: Array,
        required: true
    },
    details: {
        area: {
            type: String,
            required: true
        },
        numBed: {
            type: Number,
            required: true
        },
        numBath: {
            type: Number,
            required: true
        }
    },
    price: {
        type: String,
        required: true
    }
});

module.exports = Properties;
