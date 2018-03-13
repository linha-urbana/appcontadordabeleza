import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AppServiceProvider } from '../../providers/app-service/app-service';
import { Usuario } from '../../models/usuario';
import { UsuarioServiceProvider } from '../../providers/usuario-service/usuario-service';

/**
 * Generated class for the UpdateEmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-email',
  templateUrl: 'update-email.html',
})
export class UpdateEmailPage {
  usuario: Usuario;
  password: string = "";
  new_email: string = "";
  confirm_email: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private auth: AuthServiceProvider, private toastCtrl: ToastController,
    private appService: AppServiceProvider, private userService: UsuarioServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateEmailPage');
    this.usuario = this.appService.getUsuario();
  }

  setMsg(message: string): void {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  onSubmit(formData) {
    if (formData.valid) {
      // Verifica se o email foi digitado igualmente no campo de confirmação.
      if (this.confirm_email != this.new_email) {
        this.setMsg('Os emails informados não coincidem.');
      }
      else {
        // Precisamos fazer login primeiro para alterar o email
        this.auth.afAuth.auth.signInWithEmailAndPassword(this.usuario.email, this.password)
          .then((user) => {
            // Após logado com sucesso, então fazemos a atualização do email
            user.updateEmail(this.new_email)
              .then((sucess) => {
                // Email atualizado com sucesso
                console.log('Update email successful');
                this.setMsg("Email atualizado com sucesso.");

                // Atualiza o perfil com o novo email cadastrado
                this.atualizaPerfil(this.new_email);
              })
              .catch((error) => {
                // Ocorreu um erro ao atualizar o email.
                console.error(error);
                switch (error.code) {
                  case "auth/invalid-email": this.setMsg("O endereço de e-mail está mal formatado."); break;
                  case "auth/user-disabled": this.setMsg("Infelizmente não conseguimos concluir sua solicitação."); break;
                  case "auth/email-already-in-use": this.setMsg("Já existe uma conta com o endereço de email informado."); break;
                  case "auth/operation-not-allowed": this.setMsg("No momento o cadastro só é permitido pela administração."); break;
                  case "auth/too-many-requests": this.setMsg("Bloqueamos todos os pedidos deste dispositivo devido a atividades incomuns. Tente mais tarde."); break;
                  default: this.setMsg("Não foi possível efetuar o seu cadastro no momento. Tente novamente mais tarde."); break;
                }
              });
          })
          .catch((err) => {
            // Ocorreu um erro ao efetuar o login
            console.error(err);
            switch (err.code) {
              case "auth/user-disabled": this.setMsg("Infelizmente não conseguimos concluir sua solicitação."); break;
              case "auth/wrong-password": this.setMsg("A senha informada é inválida."); break;
              default: this.setMsg("Não foi possível completar sua solicitação.");
            }
          });
      }
    }
  }

  atualizaPerfil(new_email: string) {
    // Alteramos o email antes de salvar o perfil
    this.usuario.email = new_email;
    // Atualizados o perfil com o usuário atualizado
    this.userService.updateItem(this.usuario)
      .then((success) => {
        // Perfil atualizado com sucesso.
        this.setMsg("Perfil atualizado com sucesso. Efetue login novamente.");
        this.auth.signOut();
      })
      .catch((err) => {
        // Ocorreu um erro ao atualizar o perfil.
        console.error(err)
        this.setMsg("Não foi possível atualizar o seu perfil no momento.");
      })
  }

}
