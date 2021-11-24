import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // @Input() posts: Post[] = [];

  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;

  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" },
  // ];

  constructor(public postsService: PostsService) { }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnInit() {
    //this.posts = this.postsService.getPosts();
    this.isLoading = true;
    //trigger the request
    //and whenever we get the response from the service it would send the data to the subject
    //and subject would call next on it and pass the whole response data
    //the subscriber would receive this data and deal with it appropriately
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostsUpdateListener().subscribe(
      (posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      }
    );
  }
}
