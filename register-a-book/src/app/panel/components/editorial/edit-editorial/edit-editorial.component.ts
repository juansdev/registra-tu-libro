import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Editorial } from 'src/app/models/editorial';
import { EditorialService } from 'src/app/services/editorial.service';

@Component({
  selector: 'app-edit-editorial',
  templateUrl: '../add-editorial/add-editorial.component.html',
  styleUrls: ['../add-editorial/add-editorial.component.css'],
  providers: [
    EditorialService
  ]
})
export class EditEditorialComponent implements OnInit {

  public page_title:string;
  public editorial: Editorial;
  public status:string;
  public message_error:string;
  public is_edit: boolean;

  constructor(
    // private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _editorialService: EditorialService
  ) {
    this.page_title = "Editar editorial";
    this.editorial = new Editorial("","","","","",-1);
    this.status = "";
    this.message_error = "";
    this.is_edit = true;
  }

  ngOnInit(): void {
    this.getEditorial();
  }

  getEditorial(){
    this._route.params.subscribe(params=>{
      const editorialId = params["editorialId"];
      this._editorialService.getEditorial(editorialId).subscribe(
        response=>{
          if(!response.editorial){
            this._router.navigate(["/panel/editorial"]);
          }
          else{
            this.editorial = response.editorial;
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
    const editorialId = this.editorial._id;
    this._editorialService.update(this.editorial,editorialId).subscribe(
      response=>{
        if(response.editorial){
          this.status = "success";
          this.editorial = response.editorial;
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
