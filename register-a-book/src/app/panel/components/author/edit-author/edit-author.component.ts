import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Author } from 'src/app/models/author';
import { AuthorService } from 'src/app/services/author.service';

@Component({
  selector: 'app-edit-author',
  templateUrl: '../add-author/add-author.component.html',
  styleUrls: ['../add-author/add-author.component.css'],
  providers: [
    AuthorService
  ]
})
export class EditAuthorComponent implements OnInit {

  public page_title:string;
  public author: Author;
  public status:string;
  public message_error:string;
  public is_edit: boolean;

  constructor(
    // private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authorService: AuthorService
  ) {
    this.page_title = "Editar autor";
    this.author = new Author("","","","","");
    this.status = "";
    this.message_error ="";
    this.is_edit = true;
  }

  ngOnInit(): void {
    this.getAuthor();
    console.log(this.author);
  }

  getAuthor(){
    this._route.params.subscribe(params=>{
      const authorId = params["authorId"];
      this._authorService.getAuthor(authorId).subscribe(
        response=>{
          if(!response.author){
            this._router.navigate(["/panel/autor"]);
          }
          else{
            this.author = response.author;
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
    const authorId = this.author._id;
    this._authorService.update(this.author,authorId).subscribe(
      response=>{
        if(response.author){
          this.status = "success";
          this.author = response.author;
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
