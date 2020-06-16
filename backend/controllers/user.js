
const bcrypt=require('bcrypt')
const User=require('../models/user');
const jwt=require('jsonwebtoken');
exports.createUser=(req,res,next)=>{
    bcrypt.hash(req.body.password, 10).
    then(hash=>{
            const user=new User({
            email:req.body.email,
            password:hash
        })
        user.save().
        then(result=>{
            res.status(201).
            json({
                 message:'User Created',
                 result:result
            })
        }).
        catch(error=>{
            res.status(500).
            json({
                    message:"Invalid authentication credentials"        
            });
        });
    });

}

exports.userLogin=(req,res,next)=>{
    let fetcheduser;
    User.findOne({email:req.body.email}).
    then(user=>{
         if(!user)
         {
             return res.status(401),json({
                 message:"Auth Failed"
             })
         }
        fetcheduser=user
        return bcrypt.compare(req.body.password,user.password)
    }).then(result=>{
           if(!result)
           {
               return res.status(401),json({
                   message:"Auth Failed"
               })
           }
       const token=jwt.sign({email:fetcheduser.email,userId:fetcheduser._id},process.env.JWT_KEY,{expiresIn:'1h'})
       res.status(200).json({
           token:token,
           expiresIn:3600,
           userId:fetcheduser._id
       })
    }).
    catch(err=>{
        console.log(err);
       return res.status(401).json({
           message:"Invalid Authntication Credentials!"
       })
    })
   

}
