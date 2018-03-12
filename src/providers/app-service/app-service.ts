import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Usuario } from './../../models/usuario';
import { IMessage } from './i-message';

@Injectable()
export class AppServiceProvider {

  private emailUrl = 'http://contadordabeleza.com.br/email/send-email.php';

  usuario: Usuario;

  eventUsuario = new EventEmitter<Usuario>();

  constructor(private http: HttpClient) {
    console.log('Hello AppServiceProvider Provider');
  }

  setUsuario(newUsuario: Usuario) {
    this.usuario = newUsuario;
    this.eventUsuario.emit(newUsuario);
  }

  getUsuario(): Usuario {
    return this.usuario;
  }

  sendEmail(message: IMessage): Observable<IMessage> | any {
    return this.http.post(this.emailUrl, message, {
      responseType: 'text' })
      .map(response => {
        return response;
      })
      .catch(error => {
        return Observable.throw(error)
      })
  }

}
