import { apiResponse} from "../../common";
import { pocketMasterModel, variantModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper"

const ObjectId = require('mongoose').Types.ObjectId

export const add_pocket_master = async(req, res)=>{
    reqInfo(req)
    let body = req.body
    try{
        const response = await new pocketMasterModel(body).save()
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.addDataError,{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("pocket"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_pocket_master_by_id = async(req, res)=>{
    reqInfo(req)
    let body = req.body
    try{
        const response = await pocketMasterModel.findOneAndUpdate({_id:ObjectId(body._id), isDeleted:false}, body, {new:true})
        if(!response) return res.status(405).json(new apiResponse(405, responseMessage?.updateDataError("pocket"),{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("pocket"),response,{}))
    }catch(error){ 
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_pocket_master_by_id = async(req, res)=>{
    reqInfo(req)
    let {id} = req.params
    try{
        const response = await pocketMasterModel.findOneAndUpdate({_id:ObjectId(id), isDeleted: false}, {isDeleted: true}, {new:true})
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound("pocket"),{},{}))
        const variants = await variantModel.find({"variants.pockets.pocketStyleId": ObjectId(id),isDelted : false});
        await variantModel.updateMany({ "variants.pockets.pocketStyleId": ObjectId(id), isDeleted: false },
            { $pull: { "variants.$[].pockets": { pocketStyleId: ObjectId(id) } } }
        );
         
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("pocket"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_pocket_master = async(req, res) => {
    reqInfo(req)
    let {page, limit, search} = req.body, response:any, match = req.body
    try{
        match.isDeleted = false

        response = await pocketMasterModel.find(match)
        .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
          
            const count = response.length
            return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('pocket'), {
                pocketMaster_data: response,
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

export const get_by_id_pocket_master = async(req, res)=>{
    reqInfo(req)
    let {id}=req.params
    try{
        const response = await pocketMasterModel.findOne({_id:ObjectId(id), isDeleted : false})
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound("pocket"),{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("pocket"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}