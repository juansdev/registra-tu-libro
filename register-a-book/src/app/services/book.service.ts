import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { global } from "./global";
import { Book } from "../models/book";

@Injectable()
export class BookService{
  public url: string;

  constructor(
    private _http: HttpClient
  ){
    this.url = global.url;
  }

  register(book:Book):Observable<any>{
    let params = JSON.stringify(book);
    let headers = new HttpHeaders().set("Content-Type","application/json");
    return this._http.post(this.url+"book",params,{headers:headers});
  }

  getBooksByAuthor(authorId:string,page=1):Observable<any>{
    let headers = new HttpHeaders().set("Content-Type","application/json");
    return this._http.get(this.url+"author-books/"+authorId+"/"+page,{headers:headers});
  }

  getBooksByEditorial(editorialId:string,page=1):Observable<any>{
    let headers = new HttpHeaders().set("Content-Type","application/json");
    return this._http.get(this.url+"editorial-books/"+editorialId+"/"+page,{headers:headers});
  }

  getBook(bookId:string):Observable<any>{
    return this._http.get(this.url+"book/"+bookId);
  }

  update(bookId:string,book:Book):Observable<any>{
    let params = JSON.stringify(book);
    let headers = new HttpHeaders().set("Content-Type","application/json");
    return this._http.put(this.url+"book/"+bookId,params,{headers:headers});
  }

  delete(bookId:string):Observable<any>{
    let headers = new HttpHeaders().set("Content-Type","application/json");
    return this._http.delete(this.url+"book/"+bookId,{headers:headers});
  }

  getBooks(page=1):Observable<any>{
    return this._http.get(this.url+"books/"+page);
  }

  search(searchString:string):Observable<any>{
    return this._http.get(this.url+"search/"+searchString);
  }
}
