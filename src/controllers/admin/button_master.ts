import { apiResponse, generatePassword, generateUserId } from "../../common";
import { buttonMasterModel, variantModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper"

const ObjectId = require('mongoose').Types.ObjectId

export const add_button_master = async(req, res)=>{
    reqInfo(req)
    let body = req.body
    try{
        const response = await new buttonMasterModel(body).save()
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.addDataError,{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("button"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_button_master_by_id = async(req, res)=>{
    reqInfo(req)
    let body = req.body, {user} = req.headers
    try{
        body.updatedBy = ObjectId(user?._id)
        const response = await buttonMasterModel.findOneAndUpdate({_id:ObjectId(body._id), isDeleted:false}, body, {new:true})
        if(!response) return res.status(405).json(new apiResponse(405, responseMessage?.updateDataError("button"),{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("button"),response,{}))
    }catch(error){ 
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_button_master_by_id = async(req, res)=>{
    reqInfo(req)
    let {id} = req.params
    try{
        const response = await buttonMasterModel.findOneAndUpdate({_id:ObjectId(id), isDeleted: false}, {isDeleted: true}, {new:true})
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound("button"),{},{}))
        await variantModel.updateMany({ "variants.collars.buttonStyleId": ObjectId(id), isDeleted: false },
        { $pull: { "variants.$[].buttons": { buttonStyleId: ObjectId(id) } } }
          );
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("button"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_button_master = async(req, res) => {
    reqInfo(req)
    let {page, limit, search} = req.body, response:any, match = req.body
    try{
        match.isDeleted = false

        response = await buttonMasterModel.find(match)
        .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
          
            const count = response.length
            return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('button'), {
                buttonMaster_data: response,
                state: {
                    page: page ,
                    limit: limit ,
                    page_limit: Math.ceil(count / limit) || 1,
                }
            }, {}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_by_id_button_master = async(req, res)=>{
    reqInfo(req)
    let {id}=req.params
    try{
        const response = await buttonMasterModel.findOne({_id:ObjectId(id), isDeleted : false})
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound("button"),{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("button"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}