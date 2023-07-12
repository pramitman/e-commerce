import { apiResponse} from "../../common";
import { frontMasterModel, variantModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper"

const ObjectId = require('mongoose').Types.ObjectId

export const add_front_master = async(req, res)=>{
    reqInfo(req)
    let body = req.body
    try{
        const response = await new frontMasterModel(body).save()
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.addDataError,{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("front"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_front_master_by_id = async(req, res)=>{
    reqInfo(req)
    let body = req.body
    try{
        const response = await frontMasterModel.findOneAndUpdate({_id:ObjectId(body._id), isDeleted:false}, body, {new:true})
        if(!response) return res.status(405).json(new apiResponse(405, responseMessage?.updateDataError("front"),{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("front"),response,{}))
    }catch(error){ 
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_front_master_by_id = async(req, res)=>{
    reqInfo(req)
    let {id} = req.params
    try{
        const response = await frontMasterModel.findOneAndUpdate({_id:ObjectId(id), isDeleted: false}, {isDeleted: true}, {new:true})
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound("front"),{},{}))
        const variants = await variantModel.find({"variants.fronts.frontStyleId": ObjectId(id),isDelted : false});
        await variantModel.updateMany({ "variants.fronts.frontStyleId": ObjectId(id), isDeleted: false },
            { $pull: { "variants.$[].fronts": { frontStyleId: ObjectId(id) } } }
        );
         
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("front"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_front_master = async(req, res) => {
    reqInfo(req)
    let {page, limit, search} = req.body, response:any, match = req.body
    try{
        match.isDeleted = false

        response = await frontMasterModel.find(match)
        .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
          
            const count = response.length
            return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('front'), {
                frontMaster_data: response,
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

export const get_by_id_front_master = async(req, res)=>{
    reqInfo(req)
    let {id}=req.params
    try{
        const response = await frontMasterModel.findOne({_id:ObjectId(id), isDeleted : false})
        if(!response) return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound("front"),{},{}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("front"),response,{}))
    }catch(error){
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}