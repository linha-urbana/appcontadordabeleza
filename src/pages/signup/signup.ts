import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UsuarioServiceProvider } from '../../providers/usuario-service/usuario-service';
import { IMessage } from '../../providers/app-service/i-message';
import { TermsPage } from '../terms/terms';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  usuario: Usuario;
  terms_check: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    private af: AngularFireAuth,
    private userService: UsuarioServiceProvider,
    public toastCtrl: ToastController) {
  }

  // Cliquei para me cadastrar
  onSubmit(formData) {
    console.log('Cliquei para me cadastrar');

    // Verifique se preenchi todos os inputs requeridos
    if (formData.valid) {
      // Tente criar um login de acesso com o email e senha informado
      this.authService.emailSignUp(formData.value.email, formData.value.senha)
        .then((sucess) => {
          // Conseguiu cadastrar meu login? Agora verifique se algum funcionário já cadastrou meus dados pessoais pela dashboard
          console.log('Conseguiu cadastrar meu login');
          var mySubscribe = this.userService.getItemByEmail(
            formData.value.email
          ).subscribe(items => {           
            if (items.length > 0) {
              console.log('Já fui cadastrado');
              // Já fui cadastrado? Então carregue meus dados para o usuário atual do sistema
              // ** Como é somente um usuário por email, então poupamos loops **
              this.usuario = items[0].userJson as Usuario;
              this.usuario.$key = items[0].key;

              // Antes de me redirecionar, verifique se sou um cliente ou funcionário
              if (!this.usuario.isFuncionario) {
                console.log('Eu não sou um funcionário');
                // Eu não sou um funcionário, então me redirecione para a tela inicial
                this.cadastreiComSucesso();
              }
              else {
                console.log('Fui cadastrado como funcionário');
                // Fui cadastrado como funcionário, então não há nada de interessante pra mim aqui... Exclua meu login e me informe sobre isso!
                this.excluirUsuario();
                this.setMsg("Você não tem permissões para acessar por aqui.");
                this.navCtrl.pop();
              }

              // Desinscreva para não voltarmos aqui ;)
              mySubscribe.unsubscribe();
            }
            else {
              console.log('Ainda não fui cadastrado');
              // Ainda não fui cadastrado? Então por gentileza salve meus dados no banco
              this.usuario = new Usuario();
              this.usuario.email = formData.value.email;
              this.usuario.nome = formData.value.nome;
              this.usuario.telefone = formData.value.telefone;
              this.usuario.isFuncionario = false;

              this.userService.createItem(this.usuario)
                .then((sucess) => {
                  console.log('Sucess: ', sucess);
                  this.cadastreiComSucesso();
                })

              // Desinscreva para não voltarmos aqui ;)
              mySubscribe.unsubscribe();
            }
          });
        })
        .catch((err) => {
          console.log('Aconteceu algum erro na solicitação com o firebase')
          // Aconteceu algum erro na solicitação com o firebase. Leia o código retornado e traduza pra mim
          switch (err.code) {
            case "auth/invalid-email": this.setMsg("O endereço de e-mail está mal formatado."); break;
            case "auth/user-not-found": this.setMsg("Não há registro de usuário correspondente a este endereço de email."); break;
            case "auth/user-disabled": this.setMsg("Infelizmente não conseguimos concluir sua solicitação."); break;
            case "auth/wrong-password": this.setMsg("A senha informada é inválida."); break;
            case "auth/weak-password": this.setMsg("A senha deve ter pelo menos 6 caracteres."); break;
            case "auth/email-already-in-use": this.setMsg("Já existe uma conta com o endereço de email informado."); break;
            case "auth/operation-not-allowed": this.setMsg("No momento o cadastro só é permitido pela administração."); break;
            case "auth/too-many-requests": this.setMsg("Bloqueamos todos os pedidos deste dispositivo devido a atividades incomuns. Tente mais tarde."); break;
            default: this.setMsg("Não foi possível efetuar o seu cadastro no momento. Tente novamente mais tarde."); break;
          }
        })
    }
  }

  cadastreiComSucesso() {
    console.log('cadastreiComSucesso')
    this.enviarEmail();
    this.authService.signOut();
    this.setMsg("Parabéns! Seu cadastro foi realizado com sucesso.");
    this.navCtrl.pop();
  }

  enviarEmail(){
    // // Capture as informações do formulário
    // var message: IMessage = {
    //   name: this.usuario.nome,
    //   phone: this.usuario.telefone,
    //   email: this.usuario.email,
    //   message: formData.value.mensagem,
    // };

    // // Envie o email desejado
    // this.sendEmail(message);
  }

  // Desloga o usuário e exclui seu login
  excluirUsuario() {
    console.log('excluirUsuario')
    // this.authService.signOut();
    this.af.auth.currentUser.delete()
      .then(function () {
        // User deleted.
        console.log('User deleted')
      }).catch(function (error) {
        // An error happened.
        console.log('An error happened or delete user')
      });
  }

  setMsg(message: string): void {
    console.log('setMsg')
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  openTermsAccept() {
    this.navCtrl.push(TermsPage);
  }
}
