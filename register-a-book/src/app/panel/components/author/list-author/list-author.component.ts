import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthorService } from "../../../../services/author.service";
import { BookService } from "../../../../services/book.service";

@Component({
  selector: 'app-list-author',
  templateUrl: './list-author.component.html',
  styleUrls: ['./list-author.component.css'],
  providers: [
    AuthorService,
    BookService
  ]
})
export class ListAuthorComponent implements OnInit {

  public page_title:string;
  public status:string;
  public authors:any;
  public books:any;
  public message_error:string;

  //Valores de paginación
  public no_paginate:boolean;
  public totalPages: any;
  public page;
  public next_page;
  public prev_page;
  public number_pages:Array<number>;

  constructor(
    private _authorService: AuthorService,
    private _bookService: BookService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.page_title = "Lista de autor";
    this.status = "";
    this.message_error = "";
    this.books = [];

    //Valores de paginación
    this.page = "";
    this.next_page = 1;
    this.prev_page = 1;
    this.number_pages = [];
    this.no_paginate = true;
  }

  ngOnInit(): void {
    this._route.params.subscribe(params=>{
      let page = +params["page"];
      if(!page){
        page = 1;
        this.prev_page = 1;
        this.next_page = 2;
      }
      this.getAuthors(page);
    });
  }

  getAuthors(page=1){
    this._authorService.getAuthors(page).subscribe(
      response=>{
        if(response.authors){
          this.authors = response.authors;
          this.status = "success";
          //Navegación de paginación
          this.totalPages = response.totalPage;
          let number_pages = [];
          for (let index = 0; index < this.totalPages; index++) {
            number_pages.push(index+1);
          }
          this.number_pages = number_pages;
          if(page>=2)this.prev_page = page-1;
          else this.prev_page = 1;
          if(page< this.totalPages) this.next_page = page+1;
          else this.next_page = this.totalPages;
          if(this.totalPages) this.no_paginate = false;
        }
        else{
          this.status = "error";
          this.message_error = response.message;
        }
      },
      err=>{
        console.log(<any>err);
        this.status = "error";
        this.message_error = err.error.message;
      }
    )
  }

  getBooksByAuthor(authorId:string,page=1){
    this._bookService.getBooksByAuthor(authorId,page).subscribe(
      response=>{
        if(response.books){
          this.books = response.books;
          this.status = "success";
        }
        else{
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

  deleteAuthor(authorId:any){
    this._authorService.delete(authorId).subscribe(
      response=>{
        this.getAuthors();
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
