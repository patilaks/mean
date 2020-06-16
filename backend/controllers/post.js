const Post=require('../models/post');
exports.createPost=(req,res,next)=>{

    let url=req.protocol +'://'+ req.get('host');
    const post=new Post(
        {
            title:req.body.title,
            content:req.body.content,
            imagePath:url+"/images/"+req.file.filename,
            creator:req.userData.userId
        }
    );
    post.save().then(createdPost=>{
       res.status(201).json(
           {
               message:"post created successfully",
               post:{
                   ...createdPost,
                   id:createdPost._id,
               }
           }
       );
    }).
    catch(error=>{
        res.status(500).json({
            message:'Post creation  failed'
        })
    })
  
}


exports.updatePost=(req,res,next)=>{
    let imagePath=req.body.imagePath;
    if(req.file)
    {
       let url=req.protocol +'://'+ req.get('host');
       imagePath=url+"/images/"+req.file.filename
    }
      const post=new Post({
           _id:req.body.id,
           title:req.body.title,
           content:req.body.content,
           imagePath:imagePath,
           creator:req.userData.userId
      });
      
      Post.updateOne({_id:req.params.id,creator:req.userData.userId},post).then(result=>{
          if(result.n>0)
          {
           res.status(200).json({
               message:'updated successfully'
           });
          }
          else
          {
                res.status(401).json({
                 message:'Unauthrizeed User'
            })
          }
        
      }).catch(error=>{
          res.status(500).json({
              message:"Couldn't update post"
          })
      });
   }

   exports.getPosts=(req,res,next)=>{
 
    const pageSize=+req.query.pagesize;
    const currentPage=+req.query.page;
    const postQuery=Post.find();
    let fetchedposts;
    if(pageSize && currentPage)
    { 
        postQuery.skip(pageSize*(currentPage-1))
        .limit(pageSize)

    }
postQuery.then(documents=>{
        fetchedposts=documents
       return Post.count()
  }).then(count=>{
    res.status(200).json({
        message:"posts fetched succesfully",
        posts: fetchedposts,
        maxposts:count
    });
  }).catch(error=>{
     res.status(500).json({
         message:'Fetching post failed'
     })
  });
 
}


exports.getsinglePost=(req,res,next)=>{
    Post.findById(req.params.id).then(post=>{
        if(post)
        {
            res.status(200).json(post);
        }
        else
        {
           res.status(400).json({
               message:"failed to update"
           })
        }
    }).catch(error=>{
     res.status(500).json({
         message:'Fetching post failed'
     })
  });
 }

 exports.deletePost=(req,res,next)=>{
    Post.deleteOne({
        _id:req.params.id,creator:req.userData.userId}).then(result=>{
         console.log(result);
            if(result.n>0)
            {
             res.status(200).json({
                 message:'Deleted successfully'
             });
            }
            else
            {
              res.status(401).json({
                   message:'Unauthorized User'
              })
            }
        
        }).catch(error=>{
            res.status(500).json({
                message:'Deleting post failed'
            })
         });;
   
}

