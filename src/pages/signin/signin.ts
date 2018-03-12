import { ResetPasswordPage } from './../reset-password/reset-password';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { ToastController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { Usuario } from '../../models/usuario';
import { UsuarioServiceProvider } from '../../providers/usuario-service/usuario-service';
import { AppServiceProvider } from '../../providers/app-service/app-service';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  state: string = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    public toastCtrl: ToastController,
    private userService: UsuarioServiceProvider,
    private appService: AppServiceProvider) { }

  onSubmit(formData) {

    // Os inputs requeridos foram preenchidos?
    if (formData.valid) {

      // Tente fazer o login no sistema
      this.authService.emailLogin(formData.value.email, formData.value.senha)
        .then((success) => {
          this.carregarUsuario(formData.value.email);
        })
        .catch((err) => {
          // Não consegui logar? Me diga o porque!
          switch (err.code) {
            case "auth/invalid-email": this.setMsg("O endereço de e-mail está mal formatado."); break;
            case "auth/user-not-found": this.setMsg("Não há registro de usuário correspondente a este endereço de email."); break;
            case "auth/user-disabled": this.setMsg("Infelizmente não conseguimos concluir sua solicitação."); break;
            case "auth/wrong-password": this.setMsg("A senha informada é inválida."); break;
            default: this.setMsg("O endereço de e-mail está mal formatado.");
          }
        })
    }
  }

  private carregarUsuario(email: string) {
    // Conseguiu efetuar  meu login? Agora verifique se eu sou um funcionário ou um cliente para prosseguir
    var mySubscribe = this.userService.getItemByEmail(email)
      .subscribe(items => {
        if (items.length > 0) {
          // Já fui cadastrado? Então carregue meus dados para o usuário atual do sistema
          // ** Como é somente um usuário por email, então poupamos loops **
          var usuario = items[0].userJson as Usuario;
          usuario.$key = items[0].key;
          // Antes de me redirecionar, verifique se sou um cliente ou funcionário
          if (!usuario.isFuncionario) {
            // Eu não sou um funcionário, então me redirecione para a tela inicial
            this.entreiComSucesso(usuario);

            // Desinscreva para não voltarmos aqui ;)
            mySubscribe.unsubscribe();
          }
          else {
            // Fui cadastrado como funcionário, então não há nada de interessante pra mim aqui... Exclua meu login e me informe sobre isso!
            this.authService.signOut();
            this.setMsg("Você não tem permissões para acessar por aqui.");

            // Desinscreva para não voltarmos aqui ;)
            mySubscribe.unsubscribe();
          }

        }
        else {
          // Ainda não fui cadastrado? Então por gentileza me avise.
          this.authService.signOut();
          this.excluirUsuario();
          this.setMsg("Não encontramos nenhum usuário com os dados informados.");

          // Desinscreva para não voltarmos aqui ;)
          mySubscribe.unsubscribe();
        }
      });
  }

  // Desloga o usuário e exclui seu login
  excluirUsuario() {
    // this.authService.signOut();
    this.authService.afAuth.auth.currentUser.delete()
      .then(function () {
        // User deleted.
      }).catch(function (error) {
        // An error happened.
      });
  }

  entreiComSucesso(usuario: Usuario) {
    this.appService.setUsuario(usuario);
    this.navCtrl.setRoot(HomePage)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }

  setMsg(message: string): void {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  ionViewCanEnter() {
    // Me redirecione se já estiver logado
    if (this.authService.authenticated) {
      this.carregarUsuario(this.authService.currentUserEmail);
    }
  }

  meCadastre() {
    this.navCtrl.push(SignupPage);
  }

  esqueciSenha() {
    this.navCtrl.push(ResetPasswordPage);
  }

}
