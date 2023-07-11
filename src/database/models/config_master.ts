var mongoose = require('mongoose')
// import mongoose from 'mongoose'
const configMasterSchema = new mongoose.Schema({
    cover : {type : String},
    button : {type : String},
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true })

export const configMasterModel = mongoose.model('config_master', configMasterSchema)
