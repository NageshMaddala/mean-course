import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {

  }

  getPosts() {
    //spread operator returns copy of array
    //return [...this.posts];
    // use httpclient module for http requests

    // we can cast to the expected response type
    this.http.get<{ message: string, posts: any }>('http://localhost:9086/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null, title: title, content: content };

    // FormData object provided by javascript,
    // it allows us to combile text values and blob
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    //title would the file name
    postData.append("image", image, title);

    this.http.post<{ message: string, post: Post }>('http://localhost:9086/api/posts'
      , postData)
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        console.log(responseData.message);
        //update the locally cache only after
        //receiving the 201 from server
        const postId = responseData.post.id;
        post.id = postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
    //this.posts.push(post);
    //this.postsUpdated.next([...this.posts]);
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:9086/api/posts/" + postId)
      .subscribe(() => {
        console.log('Deleted');
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      })
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      //formdata
      postData = new FormData();
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      //jsondata
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    // const post: Post = { id: id, title: title, content: content, imagePath: null };
    this.http.put("http://localhost:9086/api/posts/" + id, postData)
      .subscribe((response) => {
        console.log(response);
        // below code is redundant
        // because on home page, we get the whole list from the backend
        const updatePosts = [...this.posts];
        const oldPostIndex = updatePosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ""
        };
        updatePosts[oldPostIndex] = post;
        this.posts = updatePosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  // getPost(id: string) {
  //   return { ...this.posts.find(p => p.id === id) };
  // }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>
      ("http://localhost:9086/api/posts/" + id);
  }
}
