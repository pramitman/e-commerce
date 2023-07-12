import { apiResponse} from "../../common";
import { yokeMasterModel, variantModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper"

const ObjectId = require('mongoose').Types.ObjectId

export const add_yoke_master = async(req, res)=>{
    reqInfo(req)
    let body = req.body
    try{
        const response = await new yokeMasterModel(body).save()
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.addDataError,{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("yoke"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_yoke_master_by_id = async(req, res)=>{
    reqInfo(req)
    let body = req.body
    try{
        const response = await yokeMasterModel.findOneAndUpdate({_id:ObjectId(body._id), isDeleted:false}, body, {new:true})
        if(!response) return res.status(405).json(new apiResponse(405, responseMessage?.updateDataError("yoke"),{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("yoke"),response,{}))
    }catch(error){ 
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_yoke_master_by_id = async(req, res)=>{
    reqInfo(req)
    let {id} = req.params
    try{
        const response = await yokeMasterModel.findOneAndUpdate({_id:ObjectId(id), isDeleted: false}, {isDeleted: true}, {new:true})
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound("yoke"),{},{}))
        const variants = await variantModel.find({"variants.yokes.yokeStyleId": ObjectId(id),isDelted : false});
        await variantModel.updateMany({ "variants.yokes.yokeStyleId": ObjectId(id), isDeleted: false },
            { $pull: { "variants.$[].yokes": { yokeStyleId: ObjectId(id) } } }
        );
         
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("yoke"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_yoke_master = async(req, res) => {
    reqInfo(req)
    let {page, limit, search} = req.body, response:any, match = req.body
    try{
        match.isDeleted = false

        response = await yokeMasterModel.find(match)
        .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
          
            const count = response.length
            return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('yoke'), {
                yokeMaster_data: response,
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

export const get_by_id_yoke_master = async(req, res)=>{
    reqInfo(req)
    let {id}=req.params
    try{
        const response = await yokeMasterModel.findOne({_id:ObjectId(id), isDeleted : false})
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound("yoke"),{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("yoke"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}