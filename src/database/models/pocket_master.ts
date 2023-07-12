var mongoose = require('mongoose')
// import mongoose from 'mongoose'
const pocketMasterSchema = new mongoose.Schema({
    name : {type : String},
    photo : {type : String},
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true })

export const pocketMasterModel = mongoose.model('pocket_master', pocketMasterSchema)
