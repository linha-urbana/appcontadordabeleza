import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListDocumentsPage } from './list-documents';

@NgModule({
  declarations: [
    ListDocumentsPage,
  ],
  imports: [
    IonicPageModule.forChild(ListDocumentsPage),
  ],
  exports:  [
    ListDocumentsPage
  ]
})
export class ListDocumentsPageModule {}
