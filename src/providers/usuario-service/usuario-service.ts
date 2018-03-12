import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Usuario } from './../../models/usuario';

@Injectable()
export class UsuarioServiceProvider {

  private basePath: string = '/usuarios';

  // items  armazenados na lista Firebase
  items: AngularFireList<Usuario> = null;

  // item  armazenado na lista Firebase
  item: AngularFireObject<Usuario> = null;

  constructor(private db: AngularFireDatabase) {
    this.items = this.db.list(this.basePath);
    this.item = this.db.object(this.basePath);
  }

  // Return a single observable item
  getClientes() {

    return this.db.list(
      this.basePath,
      ref =>
        ref.orderByChild("isFuncionario").equalTo(false)
    ).snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          const data = action.payload.val() as Usuario;
          data.$key = action.payload.key;
          return data;
        });
      });
  }

  // Return a list items observable item
  getItemsList(query = {}): AngularFireList<Usuario> {
    return this.items;
  }

  // Return a single observable item
  getItem(key: string): AngularFireObject<Usuario> {
    const itemPath = `${this.basePath}/${key}`;
    return this.db.object(itemPath);
  }

  // Return a single observable item by email
  getItemByEmail(email: string) {

    let items = this.db.list(
      this.basePath,
      ref =>
        ref.orderByChild("email").equalTo(email)
    );

    return items.snapshotChanges()
      .map(actions => {
        return actions.map(action => ({
          key: action.key,
          userJson: action.payload.val()
        }));
      });
  }


  // Return a single observable item by cpf
  getItemByCPF(cpf: string) {

    let items = this.db.list(
      this.basePath,
      ref =>
        ref.orderByChild("cpf_cnpj").equalTo(cpf)
    );

    return items.snapshotChanges()
      .map(actions => {
        return actions.map(action => ({
          key: action.key,
          userJson: action.payload.val()
        }));
      });
  }

  createItem(item: Usuario) {
    return this.items.push(item);
  }
  // Update an existing item
  updateItem(usuario: Usuario) {
    const key = usuario.$key;              
    delete usuario.$key;

    return this.items.update(key, usuario)
      // .then((sucess) => console.log(sucess))
      // .catch(error => this.handleError(error))
  }
  // Deletes a single item
  deleteItem(key: string) {
    return this.items.remove(key)
      .then()
      .catch(error => this.handleError(error))
  }
  // Deletes the entire list of items
  deleteAll(): void {
    this.items.remove()
      .catch(error => this.handleError(error))
  }
  // Default error handling for all actions
  private handleError(error) {
    console.log(error)
  }

}
