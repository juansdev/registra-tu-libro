import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Author } from "../models/author";
import { global } from "./global";

@Injectable()
export class AuthorService{
  public url: string;

  constructor(
    private _http:HttpClient
  ){
    this.url = global.url;
  }

  register(author:Author): Observable<any>{
    //Convertir el objeto del usuario a un json string.
    const params = JSON.stringify(author);

    //Definir las cabeceras
    const headers = new HttpHeaders().set("Content-Type","application/json");

    //Hacer petición ajax
    return this._http.post(this.url+"author",params,{headers:headers});
  }

  update(author:Author,authorId:string):Observable<any>{
    let params = JSON.stringify(author);
    let headers = new HttpHeaders().set("Content-Type","application/json");
    return this._http.put(this.url+"author/"+authorId,params,{headers:headers});
  }

  getAuthors(page=1):Observable<any>{
    return this._http.get(this.url+"authors/"+page);
  }

  getAuthor(authorId:string):Observable<any>{
    return this._http.get(this.url+"author/"+authorId);
  }

  delete(authorId:string):Observable<any>{
    let headers = new HttpHeaders().set("Content-Type","application/json");
    return this._http.delete(this.url+"author/"+authorId,{headers:headers});
  }

}
