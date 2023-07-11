const mongoose = require('mongoose')

const adminSchema: any = new mongoose.Schema({
    name : {type  : String},
    email: { type: String, required: true },
    phoneNumber: { type: String},
    password: { type: String },
    // profilePhoto : {type : String},
   
    // otp: { type: Number, default: null },
    // otpExpireTime: { type: Date, default: null },
    // isEmailVerified: { type: Boolean, default: false },
   
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isLoggedIn : { type : Boolean , defailt : false},

}, { timestamps: true })

export const adminModel = mongoose.model('admin', adminSchema);