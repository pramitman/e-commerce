var mongoose = require('mongoose')
// import mongoose from 'mongoose'
const fabricMasterSchema = new mongoose.Schema({
    name : {type : String},
    photo : {type : String},
    uniqueId : {type : String},
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true })

export const fabricMasterModel = mongoose.model('fabric_master', fabricMasterSchema)
