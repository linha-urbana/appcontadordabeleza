import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the WebServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WebServiceProvider {

  private API_URL = 'http://contadordabeleza.com.br/wp-json/wp/v2/posts?_embed'

  constructor(public http: HttpClient) {
    console.log('Hello WebServiceProvider Provider');
  }

  RecuperaNoticias() {
    return this.http.get(this.API_URL);
  }

  RecuperaImagemDestaqueNews(linkImagem: string) {
    return this.http.get(linkImagem);
  }

}
