import { Usuario } from './../../models/usuario';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppServiceProvider } from '../../providers/app-service/app-service';
import { IMessage } from '../../providers/app-service/i-message';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  usuario: Usuario;

  constructor(public navCtrl: NavController, public navParams: NavParams, private appService: AppServiceProvider,
    private toastCtrl: ToastController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
    this.usuario = this.appService.getUsuario();
  }

  onSubmit(formData) {
    // Verifique se todos inputs requeridos foram preenchidos mesmo
    if (formData.valid) {
      // Capture as informações do formulário
      var message: IMessage = {
        name: formData.value.nome,
        phone: formData.value.telefone,
        email: formData.value.email,
        message: formData.value.mensagem,
      };

      // Envie o email desejado
      this.sendEmail(message);
    }
  }

  sendEmail(message: IMessage) {
    this.appService.sendEmail(message).subscribe(res => {
      this.setMsg("Sua mensagem foi enviada com sucesso! Agora é só aguardar...");
    }, error => {
      this.setMsg("Não foi possível enviar sua mensagem no momento. Tente novamente mais tarde.");
    })
  }

  setMsg(message: string): void {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
