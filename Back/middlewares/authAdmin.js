import jwt from'jsonwebtoken';

//admin authenetication middleware
const authAdmin = async(req, res) =>{
  try{
    //if one has token accept req 
    const {atoken} = req.headers;
    if(!atoken){
      return res.json({success:false,message:"Note Authorized, Login Again"});
    }
    //verify token first decode it
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
      return res.json({success:false,message:"Note Authorized, Login Again"});

    }
    next();



  }
  catch(error){
    console.log(error);
        res.json({success:false, message:error.message});

  }
}
export default authAdmin;