import { apiResponse, generateUniqueId } from "../../common";
import { variantModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper"

const ObjectId = require("mongoose").Types.ObjectId

export const add_variant = async(req, res)=>{
    reqInfo(req)
    let body = req.body, userId:any = null
    try{
      
        while(!userId){
            let temp = generateUniqueId();
            const copy =  await variantModel.findOne({uniqueId : temp , isDeleted : false});
           if(!copy) userId = temp;
        }
        body.uniqueId = userId;
        const response = await new variantModel(body).save()
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.addDataError,{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("variant"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_variant_by_id = async(req, res)=>{
    reqInfo(req)
    let body = req.body
    try{
        const response = await variantModel.findOneAndUpdate({_id: ObjectId(body._id), isDeleted:false}, body, {new:true})
        if(!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError("variant"),{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("variant"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_variant_by_id = async(req, res)=>{
    reqInfo(req)
    let {id} = req.params
    try{
        const response = await variantModel.findOneAndUpdate({_id: ObjectId(id), isDeleted: false}, {isDeleted: true},{new:true})
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound("variant"),{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("variant"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_variant = async(req, res) => {
    reqInfo(req)
    let {page, limit, search} = req.body, response:any, match = req.body
    try{
        match.isDeleted = false
        // const populate = [{path:"fabId"}, {path:"collarId"}, {path:"buttonId"}]
        response = await variantModel.find(match)
        // .populate(populate)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
          
        const count = response.length
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('variant'), {
            variant_data: response,
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

export const get_by_id_variant = async(req, res)=>{
    reqInfo(req)
    let {id}=req.params
    try{
        const populate = [{path : "variants.fabId"}, {path : "variants.collars.collarStyleId"}, {path : "variants.buttons.buttonStyleId"}]
        const response = await variantModel.findOne({uniqueId : id, isDeleted : false}).populate(populate)
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound("variant"),{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("variant"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}