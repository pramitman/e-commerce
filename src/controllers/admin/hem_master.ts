import { apiResponse} from "../../common";
import { hemMasterModel, variantModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper"

const ObjectId = require('mongoose').Types.ObjectId

export const add_hem_master = async(req, res)=>{
    reqInfo(req)
    let body = req.body
    try{
        const response = await new hemMasterModel(body).save()
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.addDataError,{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("hem"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_hem_master_by_id = async(req, res)=>{
    reqInfo(req)
    let body = req.body
    try{
        const response = await hemMasterModel.findOneAndUpdate({_id:ObjectId(body._id), isDeleted:false}, body, {new:true})
        if(!response) return res.status(405).json(new apiResponse(405, responseMessage?.updateDataError("hem"),{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("hem"),response,{}))
    }catch(error){ 
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_hem_master_by_id = async(req, res)=>{
    reqInfo(req)
    let {id} = req.params
    try{
        const response = await hemMasterModel.findOneAndUpdate({_id:ObjectId(id), isDeleted: false}, {isDeleted: true}, {new:true})
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound("hem"),{},{}))
        const variants = await variantModel.find({"variants.hems.hemStyleId": ObjectId(id),isDelted : false});
        await variantModel.updateMany({ "variants.hems.hemStyleId": ObjectId(id), isDeleted: false },
            { $pull: { "variants.$[].hems": { hemStyleId: ObjectId(id) } } }
        );
         
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("hem"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_hem_master = async(req, res) => {
    reqInfo(req)
    let {page, limit, search} = req.body, response:any, match = req.body
    try{
        match.isDeleted = false

        response = await hemMasterModel.find(match)
        .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
          
            const count = response.length
            return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('hem'), {
                hemMaster_data: response,
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

export const get_by_id_hem_master = async(req, res)=>{
    reqInfo(req)
    let {id}=req.params
    try{
        const response = await hemMasterModel.findOne({_id:ObjectId(id), isDeleted : false})
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound("hem"),{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("hem"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}