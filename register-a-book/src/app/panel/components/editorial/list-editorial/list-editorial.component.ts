import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { EditorialService } from "../../../../services/editorial.service";
import { BookService } from "../../../../services/book.service";

@Component({
  selector: 'app-list-editorial',
  templateUrl: './list-editorial.component.html',
  styleUrls: ['./list-editorial.component.css'],
  providers: [
    EditorialService
  ]
})
export class ListEditorialComponent implements OnInit {

  public page_title:string;
  public status:string;
  public editorials:any;
  public message_error:string;
  public books:any;

  //Valores de paginación
  public no_paginate:boolean;
  public totalPages: any;
  public page;
  public next_page;
  public prev_page;
  public number_pages:Array<number>;

  constructor(
    private _bookService: BookService,
    private _editorialService: EditorialService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.page_title = "Lista de editoriales";
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
      this.getEditorials(page);
    });
  }

  getEditorials(page=1){
    this._editorialService.getEditorials(page).subscribe(
      response=>{
        if(response.editorials){
          this.editorials = response.editorials;
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

  deleteEditorial(editorialId:any){
    this._editorialService.delete(editorialId).subscribe(
      response=>{
        this.getEditorials();
        this.status = "success";
      },
      err=>{
        console.log(<any>err);
        this.status = "error";
        this.message_error = err.error.message;
      }
    )
  }
  getBooksByEditorial(editorialId:string,page=1){
    this._bookService.getBooksByEditorial(editorialId,page).subscribe(
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
    )
  }

}
