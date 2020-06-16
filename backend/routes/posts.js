const express=require('express');
const checkAuth=require('../middlewear/check-auth');
const router=express.Router();
const posts=require('../controllers/post');
const extractFile=require('../middlewear/file')


router.post('',checkAuth,extractFile,posts.createPost)

router.put('/:id',checkAuth,extractFile,posts.updatePost)

router.get('',posts.getPosts);

router.get('/:id',posts.getsinglePost)

router.delete("/:id",checkAuth,posts.deletePost);

module.exports=router;