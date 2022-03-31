import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Book } from 'src/app/models/book';
import { AuthorService } from 'src/app/services/author.service';
import { BookService } from 'src/app/services/book.service';
import { EditorialService } from 'src/app/services/editorial.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css'],
  providers: [
    AuthorService,
    BookService,
    EditorialService
  ]
})
export class AddBookComponent implements OnInit {

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
    this.page_title = "Crear nuevo libro";
    this.book = new Book("","","","",1,"","");
    this.status = "";
    this.message_error = "";
    this.is_edit = false;
  }

  ngOnInit(): void {
    this.getAuthors();
    this.getEditorials();
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

  onSubmit(form:any){
    this._bookService.register(this.book).subscribe(
      response=>{
        if(response.status==="success"){
          this.status = "success";
          this.book = response.book;
          this._router.navigate(["/panel/libro"]);
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
