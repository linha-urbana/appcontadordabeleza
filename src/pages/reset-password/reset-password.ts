import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireAuth,
    public toastCtrl: ToastController) {
  }

  onSubmit(formData) {
    // Digitei todos os inputs requeridos?
    if (formData.valid) {
      // Então envie um email de redefinição da senha por favor.
      this.af.auth.sendPasswordResetEmail(formData.value.email)
        .then((success) => {
          // Enviado com sucessso? Então me informe sobre o que fazer
          this.setMsg("Sucesso! Siga as instruções enviadas por e-mail para redefinir uma nova senha.");
          this.navCtrl.pop();
        })
        .catch((err) => {
          // Não foi enviado? Então me informe o que aconteceu
          switch (err.code) {
            case "auth/invalid-email": this.setMsg("O endereço de e-mail está mal formatado."); break;
            case "auth/user-not-found": this.setMsg("Não há registro de usuário correspondente a este endereço de email."); break;
            case "auth/user-disabled": this.setMsg("Infelizmente não conseguimos concluir sua solicitação."); break;
            case "auth/wrong-password": this.setMsg("A senha informada é inválida."); break;
          }
        })
    }
  }

  setMsg(message: string): void {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

}
