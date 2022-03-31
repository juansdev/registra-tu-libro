import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Author } from 'src/app/models/author';
import { AuthorService } from 'src/app/services/author.service';

@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.css'],
  providers: [
    AuthorService
  ]
})
export class AddAuthorComponent implements OnInit {

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
    this.page_title = "Crear nuevo autor";
    this.author = new Author("","","","","");
    this.status = "";
    this.message_error = "";
    this.is_edit = false;
  }

  ngOnInit(): void {
  }

  onSubmit(form:any){
    this._authorService.register(this.author).subscribe(
      response=>{
        if(response.status==="success"){
          this.status = "success";
          this.author = response.author;
          this._router.navigate(["/panel/autor"]);
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


