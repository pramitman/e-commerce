var mongoose = require('mongoose')
// import mongoose from 'mongoose'
const collarMasterSchema = new mongoose.Schema({
    name : {type : String},
    photo : {type : String},
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true })

export const collarMasterModel = mongoose.model('collar_master', collarMasterSchema)
