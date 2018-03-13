import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Usuario } from './../../models/usuario';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppServiceProvider } from '../../providers/app-service/app-service';
import { AlertController } from 'ionic-angular';
import { UsuarioServiceProvider } from '../../providers/usuario-service/usuario-service';
import { UpdateEmailPage } from '../update-email/update-email';
import { UpdatePasswordPage } from '../update-password/update-password';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  usuario: Usuario;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private appService: AppServiceProvider, public alertCtrl: AlertController, 
    private userService: UsuarioServiceProvider, private toastCtrl: ToastController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');

    this.usuario = this.appService.getUsuario();
  }

  onSubmit(formData) {
    // Autenticação simples dos campos do formulário
    if (formData.valid) {
      let confirm = this.alertCtrl.create({
        message: 'Confirma atualização do seu perfil?',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
            }
          },
          {
            text: 'Confirmo',
            handler: () => {
              this.userService.updateItem(
                this.usuario
              ).then(
                (success) => {
                  this.setMsg("Cliente atualizado com sucesso.");
                }).catch(
                (err) => {
                  this.setMsg("Não foi possível atualizar o cliente no momento. Tente novamente mais tarde.");
                })
            }
          }
        ]
      });
      confirm.present();
    }
  }

  setMsg(message: string): void {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  openChangeEmail() {
    this.navCtrl.push(UpdateEmailPage);
  }
  openChangePassword() {
    this.navCtrl.push(UpdatePasswordPage);
  }

}
