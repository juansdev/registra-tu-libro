import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Editorial } from "../models/editorial";
import { global } from "./global";

@Injectable()
export class EditorialService{
  public url: string;

  constructor(
    private _http:HttpClient
  ){
    this.url = global.url;
  }

  register(editorial:Editorial): Observable<any>{
    //Convertir el objeto del usuario a un json string.
    const params = JSON.stringify(editorial);

    //Definir las cabeceras
    const headers = new HttpHeaders().set("Content-Type","application/json");

    //Hacer petición ajax
    return this._http.post(this.url+"editorial",params,{headers:headers});
  }

  update(editorial:Editorial,editorialId:string):Observable<any>{
    let params = JSON.stringify(editorial);
    let headers = new HttpHeaders().set("Content-Type","application/json");
    return this._http.put(this.url+"editorial/"+editorialId,params,{headers:headers});
  }

  getEditorials(page=1):Observable<any>{
    return this._http.get(this.url+"editorials/"+page);
  }

  getEditorial(editorialId:string):Observable<any>{
    return this._http.get(this.url+"editorial/"+editorialId);
  }

  delete(editorialId:string):Observable<any>{
    let headers = new HttpHeaders().set("Content-Type","application/json");
    return this._http.delete(this.url+"editorial/"+editorialId,{headers:headers});
  }

}
