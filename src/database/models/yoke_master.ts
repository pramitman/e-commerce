var mongoose = require('mongoose')

const yokeMasterSchema = new mongoose.Schema({
    name : {type : String},
    photo : {type : String},
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true })

export const yokeMasterModel = mongoose.model('yoke_master', yokeMasterSchema)
