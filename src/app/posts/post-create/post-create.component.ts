import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  // @Output() postCreated = new EventEmitter<Post>();

  // onAddPost() {
  //   const post: Post = { title: this.enteredTitle, content: this.enteredContent };
  //   this.postCreated.emit(post);
  // }

  onAddPost(form: NgForm) {

    if (form.invalid) {
      return;
    }

    const post: Post = { id: null, title: form.value.title, content: form.value.content };
    // this.postCreated.emit(post);
    this.postsService.addPost(post.title, post.content);
    form.resetForm();
  }

  constructor(public postsService: PostsService) {

  }

  ngOnInit() {

  }
}
