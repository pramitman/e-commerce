var mongoose = require('mongoose')

const frontMasterSchema = new mongoose.Schema({
    name : {type : String},
    photo : {type : String},
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true })

export const frontMasterModel = mongoose.model('front_master', frontMasterSchema)
