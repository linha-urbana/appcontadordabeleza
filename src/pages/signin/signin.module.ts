import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SigninPage } from './signin';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SigninPage,
  ],
  imports: [
    IonicPageModule.forChild(SigninPage),
    FormsModule
  ],
  exports:  [
    SigninPage
  ]
})
export class SigninPageModule {}
