import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'register-a-book';
  public search:string;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute
  ){
    this.search = "";
  }

  goSearch(){
    this._router.navigate(["/buscar/",this.search])
  }
}
