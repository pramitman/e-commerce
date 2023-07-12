import { sleeve } from "../../common"

var mongoose = require('mongoose')

const cuffMasterSchema = new mongoose.Schema({
    sleeve : {type : String, enum : sleeve},
    name : {type : String},
    photo : {type : String},
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true })

export const cuffMasterModel = mongoose.model('cuff_master', cuffMasterSchema)
