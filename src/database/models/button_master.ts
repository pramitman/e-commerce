var mongoose = require('mongoose')
// import mongoose from 'mongoose'
const buttonMasterSchema = new mongoose.Schema({
    name : {type : String},
    photo : {type : String},
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true })

export const buttonMasterModel = mongoose.model('button_master', buttonMasterSchema)
