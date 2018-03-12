import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { WebServiceProvider } from '../../providers/web-service/web-service';
import { Noticia } from '../../models/noticia';

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {

  noticias: Array<Noticia>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private webService: WebServiceProvider,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');

    let loader = this.loadingCtrl.create({
      content: "Por favor aguarde..."
    });
    loader.present();

    this.webService.RecuperaNoticias()
      .subscribe(
      (result: any) => {
        if (result.length > 0) {

          this.noticias = Array<Noticia>();

          for (var i = 0; i < result.length; i++) {
            var news = new Noticia();
            news.titulo = result[i]["title"]["rendered"];
            news.urlNoticia = result[i]["link"];
            news.resumo = result[i]["excerpt"]["rendered"];
            news.urlImagem = result[i]["_embedded"]["wp:featuredmedia"][0]["source_url"];
            news.data = result[i]["date"];

            this.noticias.push(news);
          }
        }

        else {
          this.noticias = null;
        }
        
        loader.dismiss();
      },
      (error) => {
        loader.dismiss();
      });
  }

}
