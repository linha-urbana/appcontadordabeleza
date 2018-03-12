import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Categoria } from '../../models/categorias';
import { ListDocumentsPage } from '../list-documents/list-documents';

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {

  categoria: Categoria;
  subcategorias: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.categoria = navParams.get("categoria");
    this.subcategorias = [
      { nome: "Holerites", icone: "holerites" },
      { nome: "Folha de Pagamento", icone: "folha-pagamento" },
      { nome: "Registros", icone: "solicitacoes" },
      { nome: "D.P - Impostos", icone: "impostos" },
      { nome: "Admissões", icone: "admissoes" },
      { nome: "Rescisões", icone: "rescisoes" },
    ]

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }

  abraArquivos(cat: Categoria) {
    // Se eu clique em departamento pessoal, então me mostre suas subcategorias
    this.navCtrl.push(ListDocumentsPage, { categoria: cat });
  }

}
