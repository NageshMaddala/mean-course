import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private postId: string;
  post: Post;
  // @Output() postCreated = new EventEmitter<Post>();

  // onAddPost() {
  //   const post: Post = { title: this.enteredTitle, content: this.enteredContent };
  //   this.postCreated.emit(post);
  // }

  onSavePost(form: NgForm) {

    if (form.invalid) {
      return;
    }

    const post: Post = { id: null, title: form.value.title, content: form.value.content };
    // this.postCreated.emit(post);

    if (this.mode === 'create') {
      this.postsService.addPost(post.title, post.content);
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }
    form.resetForm();
  }

  // ActivatedRoute gives the information about the route
  // and how user reached this component
  constructor(public postsService: PostsService, public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        //this.post = this.postsService.getPost(this.postId);
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = { id: postData._id, title: postData.title, content: postData.content };
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
}
