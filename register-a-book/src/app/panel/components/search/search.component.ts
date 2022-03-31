import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.html'],
  providers: [
    BookService
  ]
})
export class SearchComponent implements OnInit {

  public page_title: string;
  public books: any;
  public status: string;
  public message_error: string;
  public search:any;

  //Valores de paginación
  public no_paginate:boolean;
  public totalPages: any;
  public page;
  public next_page;
  public prev_page;
  public number_pages:Array<number>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _bookService: BookService
  ) {
    this.page_title = "";
    this.status = "";
    this.message_error = "";
    this.search = "";

    //Valores de paginación
    this.page = "";
    this.next_page = 1;
    this.prev_page = 1;
    this.number_pages = [];
    this.books = [];
    this.no_paginate = true;
  }

  ngOnInit(): void {
    this._route.params.subscribe(params=>{
      const search = params["search"];
      this.page_title = "Resultados encontrados de: "+search;
      this.getBooks(search);
    })
  }

  getBooks(search:any){
    this._bookService.search(search).subscribe(
      response=>{
        if(response.bookMatchByAuthor || response.bookMatchByEditorial || response.matchByBook) {
          this.books = [];
          //Añadir al objeto Book todas las coincidas por Libro
          for (let index = 0; index < response.matchByBook.length; index++) {
            this.books.push(response.matchByBook[index]);
          }
          //Añadir al objeto Book todas las coincidas por Autor
          for (let index = 0; index < response.bookMatchByAuthor.length; index++) {
            this.books.push(response.bookMatchByAuthor[index]);
          }
          //Añadir al objeto Book todas las coincidas por Editorial
          for (let index = 0; index < response.bookMatchByEditorial.length; index++) {
            this.books.push(response.bookMatchByEditorial[index]);
          }
          this.status = "success";
          this.search = search;
        }
        else {
          console.log(<any>response);
          this.status = "error";
          this.message_error = response.message;
        }
      },
      err=>{
        console.log(<any>err);
        this.status = "error";
        this.message_error = err.error.message;
      }
    );
  }

  deleteBook(bookId:any){
    this._bookService.delete(bookId).subscribe(
      response=>{
        this.getBooks(this.search);
        this.status = "success";
      },
      err=>{
        console.log(<any>err);
        this.status = "error";
        this.message_error = err.error.message;
      }
    )
  }

}
