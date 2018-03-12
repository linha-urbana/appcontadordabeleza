// Componentes e módulos necessários
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from "@ionic-native/splash-screen";

// Páginas do app
import { HomePage } from '../pages/home/home';
import { SplashPage } from '../pages/splash/splash';

// Modelos de objetos
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { ListDocumentsPage } from '../pages/list-documents/list-documents';
import { CategoryPage } from '../pages/category/category';
import { NewsPage } from '../pages/news/news';
import { ContactPage } from '../pages/contact/contact';
import { TermsPage } from '../pages/terms/terms';
import { Categoria } from '../models/categorias';
import { ProfilePage } from '../pages/profile/profile';
import { AppServiceProvider } from '../providers/app-service/app-service';

// declare var FCMPlugin;

// Notificações de PUSH
// import { Push, PushObject, PushOptions } from "@ionic-native/push";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // Página de início do app
  rootPage: any = HomePage;

  // Lista de opções do sidemenu
  paginas: Array<{ title: string, component: any, icone: any }>;
  utilidades: Array<{ title: string, component: any, icone: any }>;
  links_uteis: Array<{ title: string, component: any, icone: any }>;

  // Nome do usuário localizado no sidemenu
  nomeUsuario: string;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    private modalCtrl: ModalController,
    private authService: AuthServiceProvider,
    private appService: AppServiceProvider,
    private splashScreen: SplashScreen,
    // public push: Push,
    public alertCtrl: AlertController
  ) {

    this.initializeApp();
  }

  onViewCanEnter() {
  }

  initializeApp() {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // this.pushsetup();
      // this.onNotification();

      // Assim que o aplicativo estiver pronto, criamos um modal usando a página de splash e o iniciamos automaticamente. 
      // let splash = this.modalCtrl.create(SplashPage);
      // splash.present();

      this.statusBar.backgroundColorByHexString("#38B5AF");
    });

    // Vamos inscrever este componente ao usuário do app para atualizar
    // o nome de usuário de forma assíncrona.
    this.nomeUsuario = this.appService.eventUsuario
      .subscribe(user => {
        this.nomeUsuario = user.nome
      });

    // Adicionamos as páginas ao sidemenu, através do *ngFor
    this.paginas = [
      { title: 'Últimas Solicitações', component: ListDocumentsPage, icone: 'solicitacoes' },
      { title: 'Departamento Pessoal', component: CategoryPage, icone: 'departamento-pessoal' },
      { title: 'Nota Fiscal', component: ListDocumentsPage, icone: 'nota-fiscal' },
      { title: 'Impostos', component: ListDocumentsPage, icone: 'impostos' },
      { title: 'Impostos de Renda', component: ListDocumentsPage, icone: 'impostos-renda' },
      { title: 'Alvará', component: ListDocumentsPage, icone: 'alvara' },
      { title: 'CNPJ', component: ListDocumentsPage, icone: 'cnpj' },
      { title: 'Honorários', component: ListDocumentsPage, icone: 'honorarios' },
    ];

    this.utilidades = [
      { title: 'Contrato Empresa', component: ListDocumentsPage, icone: 'contrato-empresa' },
      { title: 'Contrato Parceria', component: ListDocumentsPage, icone: 'contrato-parceria' },
      { title: 'Notícias Financeiras', component: NewsPage, icone: 'noticias' },
    ]

    this.links_uteis = [
      { title: 'Informações Úteis', component: ContactPage, icone: 'informacoes' },
      { title: 'Termos de Uso', component: TermsPage, icone: 'termos-uso' },
    ]
  }

  // onNotification() {
  //   console.log('onNotification');
  //   try {
  //     if (this.platform.is('android') || this.platform.is('ios') && (typeof (FCMPlugin) != 'undefined')) {

  //       FCMPlugin.getToken((token) => {
  //         console.log('Token: ', token);
  //       }, (error) => {
  //         console.log('error retrieving token: ' + error);
  //       });

  //       FCMPlugin.onNotification(function (data) {
  //         console.log('FCMPlugin.onNotification');

  //         if (data.wasTapped) {
  //           //Notification was received on device tray and tapped by the user.
  //           console.log("Received in background: ", JSON.stringify(data));
  //           this.nav.push(ListDocumentsPage, { message: data.message });
  //         } else {
  //           //Notification was received in foreground. Maybe the user needs to be notified.
  //           console.log("Received in foreground: ", JSON.stringify(data));
  //           let youralert = this.alertCtrl.create({
  //             title: data.label,
  //             message: data.message,
  //             buttons: [
  //               {
  //                 text: 'Ignorar',
  //                 role: 'cancel'
  //               },
  //               {
  //                 text: 'Visualizar',
  //                 handler: () => {
  //                   //TODO: Your logic here
  //                   this.nav.push(ListDocumentsPage, { message: data.message });
  //                 }
  //               }]
  //           });
  //           youralert.present();
  //         }
  //       }, (error) => console.error('error onNotification: ', error));
  //     }
  //   }
  //   catch (e) {
  //     console.error('error FCMPlugin: ', e);
  //   }
  // }

  // pushsetup() {
  //   const options: PushOptions = {
  //     android: {
  //       senderID: '971556206505',
  //       forceShow: true,
  //       icon: 'icon',
  //       sound: true,
  //       vibrate: true
  //     },
  //     ios: {
  //       alert: true,
  //       badge: false,
  //       sound: true
  //     },
  //     windows: {}
  //   };

  //   const pushObject: PushObject = this.push.init(options);

  //   // Aqui estamos dando um subscribe para quando um notificação for enviada o nosso app receber e apresentar ela.
  //   pushObject.on("notification").subscribe((notification: any) => {
  //     // Se a notificação foi recebida enquanto o aplicativo estava em primeiro plano
  //     this.nav.push(ListDocumentsPage, { message: notification.message });
  //     // if (notification.additionalData.foreground) {
  //     //   let youralert = this.alertCtrl.create({
  //     //     title: notification.label,
  //     //     message: notification.message,
  //     //     buttons: [{
  //     //       text: 'Ignorar',
  //     //       role: 'cancel'
  //     //     }, {
  //     //       text: 'Visualizar',
  //     //       handler: () => {
  //     //         //TODO: Your logic here
  //     //         this.nav.push(ListDocumentsPage, { message: notification.message });
  //     //         // this.rootPage = ListDocumentsPage;
  //     //       }
  //     //     }]
  //     //   });
  //     //   youralert.present();
  //     // }
  //     // else {
  //     //   //if user NOT using app and push notification comes
  //     //   //TODO: Your logic on click of push notification directly
  //     //   this.nav.push(ListDocumentsPage, { message: notification.message });
  //     //   // this.rootPage = ListDocumentsPage;
  //     //   console.log('Push notification clicked');
  //     // }
  //   });

  //   // Registrando o device no console do Firebase.
  //   pushObject.on('registration').subscribe((data: any) => {
  //     console.log('device token -> ' + data.registrationId);
  //     //TODO - send device token to server
  //   });

  //   pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  // }

  // Quando clicamos em alguma página do sidemenu
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    if (page.title === "Nota Fiscal") {
      window.open('https://isscuritiba.curitiba.pr.gov.br/iss/default.aspx');
    } else {
      var cat: Categoria = {
        nome: page.title,
        icone: page.icone
      }

      // Aqui estamos passando o componente que será aberto e também a categoria de documentos a ser mostrada.
      this.nav.push(page.component, { categoria: cat });
    }
  }

  verPerfil() {
    // Quero ver o meu perfil!
    this.nav.push(ProfilePage);
  }

  queroSair() {
    // Quero sair do sistema, então me leve para a página de login novamente.
    this.authService.signOut();
  }

}
