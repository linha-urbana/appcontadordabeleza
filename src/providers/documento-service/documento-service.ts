import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Documento } from '../../models/documento';
import * as firebase from 'firebase/app';
import { Categoria } from '../../models/categorias';
import { AuthServiceProvider } from '../auth-service/auth-service';

@Injectable()
export class DocumentoServiceProvider {

  private basePath: string = '/documentos';

  uploads: AngularFireList<Documento[]>;

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthServiceProvider
  ) { }

  getDocumentosByCategory(categoria: Categoria) {
    return this.db.list(
      `${this.basePath}/`,
      ref => ref.orderByChild("categoria").equalTo(categoria.nome),
    ).snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          const data = action.payload.val() as Documento;
          data.$key = action.payload.key;
          return data;
        });
      });
  }

  getDocumentosByCategoryCliente(categoria: Categoria) {
    return this.db.list(
      `${this.basePath}/`,
      ref => ref.orderByChild("categoria_clienteEmail").equalTo(categoria.nome + "_" + this.authService.currentUserEmail),
    ).snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          const data = action.payload.val() as Documento;
          data.$key = action.payload.key;
          return data;
        });
      });
  }

  getAllDocumentos() {
    return this.db.list(
      `${this.basePath}/`
    ).snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          const data = action.payload.val() as Documento;
          data.$key = action.payload.key;
          return data;
        });
      });
  }

  getItemRB(documentoKey: string) {
    return this.db.object(`${this.basePath}/${documentoKey}`)
      .snapshotChanges()
      .map(action => {
        const data = action.payload.val() as Documento;
        data.$key = action.payload.key;
        return data;
      });
  }

  public downloadFile(filename): void {
    let storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${filename}`)
      .getDownloadURL().then((url) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
            /* Create a new Blob object using the response
            *  data of the onload object.
            */
            const blob = new Blob([xhr.response], { type: 'octet/stream' });
            const a: any = document.createElement('a');
            a.style = 'display: none';
            document.body.appendChild(a);
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          };
          xhr.open('GET', url);
          xhr.send();
        }).catch(function(error) {
          // Handle any errors
          console.log(error);
        });
      }

}