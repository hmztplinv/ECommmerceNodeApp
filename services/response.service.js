const response = async(res,callBack)=>{
    try{
        await callBack();
    }
    catch(err){
        res.status(500).json({success: false, message: err.message});
    }
}

module.exports = response;