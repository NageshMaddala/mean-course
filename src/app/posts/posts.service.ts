import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {

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
            id: post._id
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http.post<{ message: string, postId: string }>('http://localhost:9086/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        //update the locally cache only after
        //receiving the 201 from server
        const postId = responseData.postId;
        post.id = postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
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
}
