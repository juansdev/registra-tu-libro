import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Book } from 'src/app/models/book';
import { AuthorService } from 'src/app/services/author.service';
import { BookService } from 'src/app/services/book.service';
import { EditorialService } from 'src/app/services/editorial.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: '../add-book/add-book.component.html',
  styleUrls: ['../add-book/add-book.component.css'],
  providers: [
    AuthorService,
    BookService,
    EditorialService
  ]
})
export class EditBookComponent implements OnInit {

  public page_title:string;
  public book: Book;
  public books: any;
  public authors: any;
  public editorials: any;
  public status:string;
  public message_error:string;
  public is_edit: boolean;

  constructor(
    // private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authorService: AuthorService,
    private _bookService: BookService,
    private _editorialService: EditorialService
  ) {
    this.page_title = "Editar autor";
    this.book = new Book("","","","",1,"","");
    this.status = "";
    this.is_edit = true;
    this.message_error = "";
  }

  ngOnInit(): void {
    this.getAuthors();
    this.getEditorials();
    this.getBook();
  }

  getAuthors(){
    this._authorService.getAuthors().subscribe(
      response=>{
        if(response.authors){
          this.authors = response.authors;
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

  getEditorials(){
    this._editorialService.getEditorials().subscribe(
      response=>{
        if(response.editorials){
          this.editorials = response.editorials;
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

  getBooks(){
    this._bookService.getBooks().subscribe(
      response=>{
        if(response.books){
          this.books = response.books;
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

  getBook(){
    this._route.params.subscribe(params=>{
      const bookId = params["bookId"];
      this._bookService.getBook(bookId).subscribe(
        response=>{
          if(!response.book){
            this._router.navigate(["/panel/book"]);
          }
          else{
            this.book = response.book;
          }
        },
        err=>{
          console.log(<any>err);
          this.status = "error";
          this.message_error = err.error.message;
        }
      );
    });
  }

  onSubmit(form:any){
    const bookId = this.book._id;
    this._bookService.update(bookId,this.book).subscribe(
      response=>{
        if(response.book){
          this.status = "success";
          this.book = response.book;
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

}
