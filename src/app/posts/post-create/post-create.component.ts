import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

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
  isLoading = false;
  imagePreview: string;

  //groups all controls
  //also, we can have subgroups under form group
  form: FormGroup;

  // @Output() postCreated = new EventEmitter<Post>();

  // onAddPost() {
  //   const post: Post = { title: this.enteredTitle, content: this.enteredContent };
  //   this.postCreated.emit(post);
  // }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    //allows us to target a single control
    this.form.patchValue({ image: file });
    //reevaluate the form here
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    //to display image on ui
    //convert image to imagedataurl
    //use filereader for that
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {

    if (this.form.invalid) {
      return;
    }
    //dont need to set to false because we are navigating away from this page after adding/updating the post
    this.isLoading = true;
    const post: Post = {
      id: null,
      title: this.form.value.title,
      content: this.form.value.content,
      imagePath: null
    };
    // this.postCreated.emit(post);

    if (this.mode === 'create') {
      //this.postsService.addPost(post.title, post.content);
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title,
        this.form.value.content, this.form.value.image);
    }
    this.form.reset();
  }

  // ActivatedRoute gives the information about the route
  // and how user reached this component
  constructor(public postsService: PostsService, public route: ActivatedRoute) {
  }

  ngOnInit() {
    //add controls to the form here
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        //this.post = this.postsService.getPost(this.postId);
        //show spinner
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          //hide spinner
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
}
