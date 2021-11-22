import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
    this.http.get<{ message: string, posts: Post[] }>('http://localhost:9086/api/posts')
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http.post<{ message: string }>('http://localhost:9086/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        //update the locally cache only after
        //receiving the 201 from server
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
    //this.posts.push(post);
    //this.postsUpdated.next([...this.posts]);
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
