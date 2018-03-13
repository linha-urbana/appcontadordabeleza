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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // Página de início do app
  rootPage: any;

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
      this.statusBar.backgroundColorByHexString("#38B5AF");
      
      this.splashScreen.hide();

      // Assim que o aplicativo estiver pronto, criamos um modal usando a página de splash e o iniciamos automaticamente. 
      let splashCustom = this.modalCtrl.create(SplashPage);
      splashCustom.onDidDismiss(data => {
        this.rootPage = HomePage;
      });
      splashCustom.present();
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
