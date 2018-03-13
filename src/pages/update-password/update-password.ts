import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the UpdatePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-password',
  templateUrl: 'update-password.html',
})
export class UpdatePasswordPage {
  password: string = "";
  new_pass: string = "";
  confirm_pass: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController, private auth: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdatePasswordPage');
  }

  onSubmit(formData) {
    if (formData.valid) {
      // Verifica se a senha foi digitada igualmente no campo de confirmação.
      if (this.confirm_pass != this.new_pass) {
        this.setMsg('As senhas informadas não coincidem.');
      }
      else {
        // Precisamos fazer login primeiro para alterar a senha
        this.auth.afAuth.auth.signInWithEmailAndPassword(this.auth.currentUserEmail, this.password)
          .then((user) => {
            // Após logado com sucesso, então fazemos a atualização da senha
            user.updatePassword(this.new_pass)
              .then((sucess) => {
                // Senha atualizada com sucesso
                console.log('Update password successful');
                this.setMsg("Senha atualizada com sucesso.");
                this.navCtrl.pop();
              })
              .catch((error) => {
                // Ocorreu um erro ao atualizar a senha
                console.error(error);
                switch (error.code) {
                  case "auth/user-disabled": this.setMsg("Infelizmente não conseguimos concluir sua solicitação."); break;
                  case "auth/wrong-password": this.setMsg("A senha informada é inválida."); break;
                  case "auth/weak-password": this.setMsg("A senha deve ter pelo menos 6 caracteres."); break;
                  case "auth/operation-not-allowed": this.setMsg("No momento o cadastro só é permitido pela administração."); break;
                  case "auth/too-many-requests": this.setMsg("Bloqueamos todos os pedidos deste dispositivo devido a atividades incomuns. Tente mais tarde."); break;
                  default: this.setMsg("Não foi possível completar sua solicitação. Tente novamente mais tarde."); break;
                }
              });
          })
          .catch((err) => {
            // Ocorreu um erro ao efetuar o login
            console.error(err);
            switch (err.code) {
              case "auth/user-disabled": this.setMsg("Infelizmente não conseguimos concluir sua solicitação."); break;
              case "auth/wrong-password": this.setMsg("A senha atual informada é inválida."); break;
              default: this.setMsg("Não foi possível completar sua solicitação.");
            }
          });
      }
    }
  }

  setMsg(message: string): void {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
