var mongoose = require('mongoose')

const hemMasterSchema = new mongoose.Schema({
    name : {type : String},
    photo : {type : String},
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true })

export const hemMasterModel = mongoose.model('hem_master', hemMasterSchema)
