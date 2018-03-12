import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ListDocumentsPage } from '../list-documents/list-documents';
import { Categoria } from '../../models/categorias';

/**
 * Generated class for the MessagePushPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message-push',
  templateUrl: 'message-push.html',
})
export class MessagePushPage {

  title: String;
  message1: String;
  message2: String;
  message3: String;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.title = navParams.get("title");
    this.message1 = navParams.get("message1");
    this.message2 = navParams.get("message2");
    this.message3 = navParams.get("message3");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePushPage');
  }

  goImpostos() {
    let cat: Categoria = { nome: "Impostos", icone: "impostos" };
    this.navCtrl.pop();
    this.navCtrl.push(ListDocumentsPage, { categoria: cat });
  }
}
