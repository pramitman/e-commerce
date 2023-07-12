import { apiResponse} from "../../common";
import { cuffMasterModel, variantModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper"

const ObjectId = require('mongoose').Types.ObjectId

export const add_cuff_master = async(req, res)=>{
    reqInfo(req)
    let body = req.body
    try{
        const response = await new cuffMasterModel(body).save()
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.addDataError,{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("cuff"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_cuff_master_by_id = async(req, res)=>{
    reqInfo(req)
    let body = req.body
    try{
        const response = await cuffMasterModel.findOneAndUpdate({_id:ObjectId(body._id), isDeleted:false}, body, {new:true})
        if(!response) return res.status(405).json(new apiResponse(405, responseMessage?.updateDataError("cuff"),{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("cuff"),response,{}))
    }catch(error){ 
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_cuff_master_by_id = async(req, res)=>{
    reqInfo(req)
    let {id} = req.params
    try{
        const response = await cuffMasterModel.findOneAndUpdate({_id:ObjectId(id), isDeleted: false}, {isDeleted: true}, {new:true})
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound("cuff"),{},{}))
        const variants = await variantModel.find({"variants.cuffs.cuffStyleId": ObjectId(id),isDelted : false});
        await variantModel.updateMany({ "variants.cuffs.cuffStyleId": ObjectId(id), isDeleted: false },
            { $pull: { "variants.$[].cuffs": { cuffStyleId: ObjectId(id) } } }
        );
         
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("cuff"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_cuff_master = async(req, res) => {
    reqInfo(req)
    let {page, limit, search} = req.body, response:any, match = req.body
    try{
        match.isDeleted = false

        response = await cuffMasterModel.find(match)
        .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
          
            const count = response.length
            return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('cuff'), {
                cuffMaster_data: response,
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

export const get_by_id_cuff_master = async(req, res)=>{
    reqInfo(req)
    let {id}=req.params
    try{
        const response = await cuffMasterModel.findOne({_id:ObjectId(id), isDeleted : false})
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound("cuff"),{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("cuff"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}