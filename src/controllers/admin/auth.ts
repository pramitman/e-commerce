"use strict"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { adminModel, userSessionModel } from '../../database'
import { apiResponse } from '../../common'
import { email_verification_mail, forgot_password_mail, reqInfo, responseMessage } from '../../helper'

const ObjectId = require('mongoose').Types.ObjectId
const jwt_token_secret = process.env.JWT_TOKEN_SECRET


export const signUp = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let body = req.body,
            otp,
            otpFlag = 1, // OTP has already assign or not for cross-verification
            authToken = 0
            let  isAlready : any = await adminModel.findOne({ email: body?.email, isDelted: false })
        if (isAlready) return res.status(409).json(new apiResponse(409, responseMessage?.alreadyEmail, {}, {}))
         isAlready = await adminModel.findOne({ phoneNumber: body?.phoneNumber, isDelted: false })
        if (isAlready) return res.status(409).json(new apiResponse(409, "phone number exist already", {}, {}))
        

        if (isAlready?.isBlocked == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))

        const salt = await bcryptjs.genSaltSync(10)
        const hashPassword = await bcryptjs.hash(body.password, salt)
        delete body.password
        body.password = hashPassword
        let response = await new adminModel(body).save()
        response = {
            isEmailVerified: response?.isEmailVerified,
            _id: response?._id,
            email: response?.email,
        }

        return res.status(200).json(new apiResponse(200, responseMessage?.signupSuccess, response, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const login = async (req: Request, res: Response) => { //email or password // phone or password
    let body = req.body,
        response: any
    reqInfo(req)
    try {
        response = await adminModel.findOneAndUpdate({ email: body?.email, isDeleted: false }, { $addToSet: { deviceToken: body?.deviceToken } , isLoggedIn : true }).select('-__v -createdAt -updatedAt')

        if (!response) return res.status(400).json(new apiResponse(400, responseMessage?.invalidUserPasswordEmail, {}, {}))
        if (response?.isBlocked == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))

        const passwordMatch = await bcryptjs.compare(body.password, response.password)
        if (!passwordMatch) return res.status(400).json(new apiResponse(400, responseMessage?.invalidUserPasswordEmail, {}, {}))
        const token = jwt.sign({
            _id: response._id,
            status: "Login",
            generatedOn: (new Date().getTime())
        }, jwt_token_secret)

        await new userSessionModel({
            createdBy: response._id,
        }).save()
        response = {
            isEmailVerified: response?.isEmailVerified,
            _id: response?._id,
            email: response?.email,
            token,
        }
        return res.status(200).json(new apiResponse(200, responseMessage?.loginSuccess, response, {}))

    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}