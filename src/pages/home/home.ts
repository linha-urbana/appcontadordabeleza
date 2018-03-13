import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';

import { categoriasHome, Categoria, categoriasDP } from './../../models/categorias';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { SigninPage } from '../signin/signin';
import { CategoryPage } from '../category/category';
import { ListDocumentsPage } from '../list-documents/list-documents';
import { AppServiceProvider } from '../../providers/app-service/app-service';
import { UsuarioServiceProvider } from '../../providers/usuario-service/usuario-service';
import { Usuario } from '../../models/usuario';
import { ContactPage } from '../contact/contact';
import { NewsPage } from '../news/news';
import { MessagePushPage } from '../message-push/message-push';
import { InAppBrowser } from '@ionic-native/in-app-browser';

declare var FCMPlugin;

// import { FCM } from '@ionic-native/fcm';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // Categorias de opções de serviços a serem mostrados
  categorias: any;

  // Subcategorias da opção "Departamento pessoal"
  subcat: any;

  constructor(
    public navCtrl: NavController,
    public authService: AuthServiceProvider,
    private appService: AppServiceProvider,
    private userService: UsuarioServiceProvider,
    // private fcm: FCM,
    private alertCtrl: AlertController,
    private platform: Platform,
    private iab: InAppBrowser
  ) {

    // Atualize minha lista de opções com as categorias e subcategorias fornecidas.
    this.categorias = categoriasHome;
    this.subcat = categoriasDP;

    this.onNotification(this.alertCtrl, this.navCtrl);

    // Fique atento a mudança no estado de login do cliente.
    // Se ele sair, então leve-o de volta à página de login.
    var mySubscribe = this.authService.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.navCtrl.setRoot(SigninPage);
        mySubscribe.unsubscribe();
      }
      else if (!this.appService.usuario) {
        this.carregarUsuario(auth.email);
      }
    });
  }

  goMessagePush(data) {
    console.log('on goMessagePush');
    this.navCtrl.push(MessagePushPage, { 
      message1: data.message1, 
      message2: data.message2, 
      message3: data.message3, 
      title: data.label 
    });
  }

  async onNotification(alertCtrl, navCtrl) {
    console.log('onNotification');
    try {
      await this.platform.ready();

      if (this.platform.is('android') || this.platform.is('ios') && (typeof (FCMPlugin) != 'undefined')) {

        var that = this;

        FCMPlugin.subscribeToTopic('vencimento_impostos');

        // FCMPlugin.getToken((token) => {
        //   console.log('Token: ', token);
        // }, (error) => {
        //   console.log('error retrieving token: ' + error);
        // });

        FCMPlugin.onNotification(function (data) {
          if (data.wasTapped) {
            //Notification was received on device tray and tapped by the user.
            that.goMessagePush(data);
          } else {
            //Notification was received in foreground. Maybe the user needs to be notified.
            alertCtrl.create({
              title: data.label,
              message: data.excerpt,
              buttons: [
                {
                  text: 'Ignorar',
                  role: 'cancel'
                },
                {
                  text: 'Visualizar',
                  handler: () => {
                    //TODO: Your logic here
                    // that.navCtrl.push(ListDocumentsPage, { message: data.message });
                    that.goMessagePush(data);
                  }
                }]
            }).present();
          }
        });

        // FCMPlugin.unsubscribeFromTopic('vencimento_impostos');
      }
    }
    catch (e) {
      console.error('error FCMPlugin: ', e);
    }
  }

  ionViewCanEnter() {

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
            this.appService.setUsuario(usuario);

            // Desinscreva para não voltarmos aqui ;)
            mySubscribe.unsubscribe();
          }
          else {
            // Fui cadastrado como funcionário, então não há nada de interessante pra mim aqui... Exclua meu login e me informe sobre isso!
            this.authService.signOut();

            // Desinscreva para não voltarmos aqui ;)
            mySubscribe.unsubscribe();
          }

        }
        else {
          // Ainda não fui cadastrado? Então por gentileza me avise.
          this.authService.signOut();

          // Desinscreva para não voltarmos aqui ;)
          mySubscribe.unsubscribe();
        }
      });
  }

  openChat(){
    var url = 'javascript:jivo_api.open();';
    // const browser = this.iab.create(doc.url, '_self', 'location=no');
    this.iab.create(url, '_self', 'location=no');
    // window.open(doc.url, 'location=no');
  }

  abraArquivos(cat: Categoria) {
    // Se eu clique em departamento pessoal, então me mostre suas subcategorias
    if (cat.nome === "Departamento Pessoal") {
      this.navCtrl.push(CategoryPage, { categoria: cat });
    }
    else if (cat.nome === "Informações") {
      this.navCtrl.push(ContactPage);
    }
    else if (cat.nome === "Notícias") {
      this.navCtrl.push(NewsPage);
    }
    else if (cat.nome === "Nota Fiscal") {
      window.open('https://isscuritiba.curitiba.pr.gov.br/iss/default.aspx');
    }
    else {
      this.navCtrl.push(ListDocumentsPage, { categoria: cat });
    }
  }

}
