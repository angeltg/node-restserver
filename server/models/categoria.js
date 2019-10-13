const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción de la categoría es necesaria'],
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


mongoose.set('useFindAndModify', false);

module.exports = mongoose.model('categoria', categoriaSchema);