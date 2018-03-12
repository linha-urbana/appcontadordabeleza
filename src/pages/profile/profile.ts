import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import { AppServiceProvider } from '../../providers/app-service/app-service';
import { EditProfilePage } from '../edit-profile/edit-profile';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  usuario: Usuario;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appService: AppServiceProvider) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.usuario = this.appService.getUsuario();
  }

  editarPerfil() {
    this.navCtrl.push(EditProfilePage);
  }

  getEnderecoCompleto(bairro, cidade, cep) {
    var endereco = "";

    if (bairro) {
      endereco += bairro;
    }
    if (cidade) {
      endereco += ", " + cidade;
    }
    if (cep) {
      endereco += " - " + cep;
    }
    return endereco;
  }

}
