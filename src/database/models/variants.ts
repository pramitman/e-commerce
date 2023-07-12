var mongoose = require('mongoose')
// import mongoose from 'mongoose'
const variantSchema = new mongoose.Schema({
    uniqueId : {type : String},
    variants : [
            {
                fabId : {type : mongoose.Schema.Types.ObjectId, ref:"fabric_master"},
                collars : [{
                    collarStyleId : {type : mongoose.Schema.Types.ObjectId, ref : "collar_master"},
                    photo : {type : String}
                }],     
                buttons : [{
                    buttonStyleId : {type : mongoose.Schema.Types.ObjectId, ref : "button_master"},  
                    photo : {type : String}
                }],
                cuffs : [{
                    cuffStyleId : {type : mongoose.Schema.Types.ObjectId, ref : "cuff_master"},  
                    photo : {type : String}
                }],
                pockets : [{
                    pocketStyleId : {type : mongoose.Schema.Types.ObjectId, ref : "pocket_master"},  
                    photo : {type : String}
                }],
            }
        ],
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true })

export const variantModel = mongoose.model('variant', variantSchema)
