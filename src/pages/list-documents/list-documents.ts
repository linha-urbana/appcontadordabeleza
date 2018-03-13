import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, Platform } from 'ionic-angular';
import { Categoria } from '../../models/categorias';
import { Documento } from '../../models/documento';
import { Observable } from 'rxjs';
import { DocumentoServiceProvider } from '../../providers/documento-service/documento-service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ContactPage } from '../contact/contact';

import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the ListDocumentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-documents',
  templateUrl: 'list-documents.html',
})
export class ListDocumentsPage {

  items: Observable<Documento[]>;

  categoria: Categoria;
  documentos: Documento[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private docService: DocumentoServiceProvider,
    public toastCtrl: ToastController,
    public actionsheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    private iab: InAppBrowser,
    private platform: Platform) {

    this.categoria = navParams.get("categoria");

    // Carrega a lista com os documentos da categoria
    this.populaDocumentos();
  }

  populaDocumentos() {
    // Captura a coleção firebase dos documentos
    // this.items = this.userService.getClientes();
    this.items = this.docService.getDocumentosByCategoryCliente(this.categoria);

    // Converte a coleção para os objetos documento
    this.items.subscribe(documentos => {

      this.documentos = documentos;

      if (this.documentos.length <= 0) {
        this.setMsg("Ainda não foi lançado nenhum documento.");
      }

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListDocumentsPage');
  }

  setMsg(message: string): void {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  entreContato() {
    this.navCtrl.push(ContactPage);
  }

  baixarDocumento(doc: Documento) {
    var url = doc.url;
    if (this.platform.is('android')) {
      if (url !== undefined && url !== null) {
        if (url.toLowerCase() !== 'html') {
          url = 'https://docs.google.com/viewer?url=' + encodeURIComponent(url);
        }
      }
    } else {
      url = encodeURIComponent(url);
    }
    const browser = this.iab.create(url, '_blank', 'location=no');
    browser.on('loaderror').subscribe((sucess) => {
      this.setMsg("Não foi possível abrir o arquivo.")
    });
    browser.on('loadstop').subscribe((sucess) => {
      this.setMsg("Não foi possível abrir o arquivo.")
    });
  }

  compartilharDocumento(doc: Documento) {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Compartilhar documento',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Email',
          icon: 'mail',
          handler: () => {
            this.sharedBy('email', doc);
          }
        },
        {
          text: 'Facebook',
          icon: 'logo-facebook',
          handler: () => {
            this.sharedBy('facebook', doc);
          }
        },
        {
          text: 'Twitter',
          icon: 'logo-twitter',
          handler: () => {
            this.sharedBy('twitter', doc);
          }
        },
        {
          text: 'Instagram',
          icon: 'logo-instagram',
          handler: () => {
            this.sharedBy('instagram', doc);
          }
        },
        {
          text: 'WhatsApp',
          icon: 'logo-whatsapp',
          handler: () => {
            this.sharedBy('whatsapp', doc);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel', // will always sort to be on the bottom
          // icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  sharedBy(appname: string, doc: Documento) {

    var message: 'Estou compartilhando com você um documento através do App Contadora da Beleza. Com este aplicativo além da facilidade de compartilhar meus documentos direto do contador, também posso solicitar documentos e falar com a equipe online de forma instantânea!';
    var subject: 'Um documento foi compartilhado com você através do App Contador da Beleza.';

    this.socialSharing.canShareVia(
      appname,
      message,
      subject,
      '',
      doc.url
    ).then(() => {
      // Success!
      this.socialSharing.shareVia(
        appname,
        message,
        subject,
        '',
        doc.url
      ).then(() => {
        // Success!
        this.setMsg("Compartilhado com sucesso.");
      }).catch((error) => {
        // Error!
        console.log(error);
        this.setMsg("Não foi possível completar o compartilhamento.");
      });
    }).catch((error) => {
      // Error!
      console.log(error);
      this.setMsg("Não é possivel compartilhar na opção selecionada.");
    });
  }

}
