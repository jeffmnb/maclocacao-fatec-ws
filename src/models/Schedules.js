const mongoose = require('mongoose');

const Schedule = mongoose.model('Schedule', {
    imovel: {
        type: Object,
        required: [true, 'Imovel obrigatorio']
    },
    dataInicio: {
        type: String,
        required: [true, 'Data de inicio obrigatorio']
    },
    dataFim: {
        type: String,
        required: [true, 'Data final obrigatorio']
    },
    HorarioInicio: {
        type: String,
        required: [true, 'Hora de entrada obrigatorio']
    },
    HorarioFinal: {
        type: String,
        required: [true, 'Hora de saida obrigatorio']
    },
    dadosLocatario: {
        type: Object,
        required: [true, 'Dados do locatario obrigatorio']
    },
    statusPagamento: {
        type: Boolean,
        required: [true, 'Status de pagamento obrigatorio']
    },
});

module.exports = Schedule;