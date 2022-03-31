import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Editorial } from 'src/app/models/editorial';
import { EditorialService } from 'src/app/services/editorial.service';

@Component({
  selector: 'app-add-editorial',
  templateUrl: './add-editorial.component.html',
  styleUrls: ['./add-editorial.component.css']
})
export class AddEditorialComponent implements OnInit {

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
    this.page_title = "Crear nueva editorial";
    this.editorial = new Editorial("","","","","",-1);
    this.status = "";
    this.message_error = "";
    this.is_edit = false;
  }

  ngOnInit(): void {
  }

  onSubmit(form:any){
    this._editorialService.register(this.editorial).subscribe(
      response=>{
        if(response.status==="success"){
          this.status = "success";
          this.editorial = response.editorial;
          this._router.navigate(["/panel/editorial"]);
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
