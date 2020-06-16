import { Component,Input,OnInit, OnDestroy } from '@angular/core';
import {Post} from '../post.model';
import { PostsService} from '../posts.service';
import {Subscription} from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
@Component(
    {
        selector:'app-post-list',
        templateUrl:'./post-list.component.html',
        styleUrls:['./post-list.component.css']
    }
)

export class PostListComponent implements OnInit, OnDestroy{
posts:Post[]=[];
isLoading=false;
postSub:Subscription
totalPosts=0;
postsperPage=2;
currentpage=1;
pagesizeOptions=[1,2,3,5,10];
private authstatusSub:Subscription;
userisAuthenticated=false;
userId:string;

constructor( public postsservice:PostsService,private authservice:AuthService)
{
    

}
ngOnInit()
{
    this.isLoading=true;
    this.postsservice.getPosts(this.postsperPage,this.currentpage);
    this.userId=this.authservice.getUserId();
    this.postSub=this.postsservice.getPostUpdatedListener().subscribe(
        (postData:{posts:Post[],postCount:number})=>
        {
           this.totalPosts=postData.postCount
           this.isLoading=false;
           this.posts=postData.posts;
        }
    )
    this.userisAuthenticated=this.authservice.getAuth()
    this.authstatusSub=this.authservice.getauthstatusListener().subscribe(isAuthenticated=>{
          this.userisAuthenticated=isAuthenticated;
          this.userId=this.authservice.getUserId();
    })
}
onChangePage(pageData:PageEvent)
{
    this.isLoading=true;
    this.currentpage=pageData.pageIndex+1;
    this.postsperPage=pageData.pageSize;
    this.postsservice.getPosts(this.postsperPage,this.currentpage);
}

onDelete(postId:string)
{
    this.isLoading=true;
    this.postsservice.deletePost(postId).subscribe(()=>{
        this.postsservice.getPosts(this.postsperPage,this.currentpage)
    },
    ()=>{
        this.isLoading=false
    });
}

ngOnDestroy()
{
    this.postSub.unsubscribe();
    this.authstatusSub.unsubscribe();
}

}