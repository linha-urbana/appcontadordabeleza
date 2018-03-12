import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagePushPage } from './message-push';

@NgModule({
  declarations: [
    MessagePushPage,
  ],
  imports: [
    IonicPageModule.forChild(MessagePushPage),
  ],
})
export class MessagePushPageModule {}
