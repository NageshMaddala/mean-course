import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "../angular-material.module";
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    // CommonModule added by angular, it provides directives like ngIf and others
    // similar to BrowserModule
    CommonModule,
    FormsModule,
    AngularMaterialModule
  ]
})
export class AuthModule { }
