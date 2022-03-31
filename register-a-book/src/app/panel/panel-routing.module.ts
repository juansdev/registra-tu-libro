import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Componentes
// Autor
import { MainAuthorComponent } from "./components/author/main-author/main-author.component";
import { ListAuthorComponent } from "./components/author/list-author/list-author.component";
import { AddAuthorComponent } from "./components/author/add-author/add-author.component";
import { EditAuthorComponent } from "./components/author/edit-author/edit-author.component";
import { DetailAuthorComponent } from "./components/author/detail-author/detail-author.component";
// Editorial
import { MainEditorialComponent } from './components/editorial/main-editorial/main-editorial.component';
import { AddEditorialComponent } from './components/editorial/add-editorial/add-editorial.component';
import { EditEditorialComponent } from './components/editorial/edit-editorial/edit-editorial.component';
import { ListEditorialComponent } from './components/editorial/list-editorial/list-editorial.component';
import { DetailEditorialComponent } from "./components/editorial/detail-editorial/detail-editorial.component";
// Book
import { MainBookComponent } from './components/book/main-book/main-book.component';
import { AddBookComponent } from './components/book/add-book/add-book.component';
import { EditBookComponent } from './components/book/edit-book/edit-book.component';
import { ListBookComponent } from './components/book/list-book/list-book.component';

const panelRoutes: Routes = [
  {
    path:"panel/autor",//Ruta principal
    component: MainAuthorComponent,//Este componente se utilizara en la ruta /panel
    children:[
      {
        path:"",
        component:ListAuthorComponent
      },
      {
        path:"registrar",
        component:AddAuthorComponent
      },
      {
        path:"listado",
        component:ListAuthorComponent
      },
      {
        path:"listado/:page",
        component:ListAuthorComponent
      },
      {
        path:"editar/:authorId",
        component:EditAuthorComponent
      },
      {
        path:"detalle/:authorId",
        component:DetailAuthorComponent
      },
      {
        path:"detalle/:authorId/:page",
        component:DetailAuthorComponent
      },
    ]
  },
  {
    path:"panel/editorial",//Ruta principal
    component: MainEditorialComponent,//Este componente se utilizara en la ruta /panel
    children:[
      {
        path:"",
        component:ListEditorialComponent
      },
      {
        path:"registrar",
        component:AddEditorialComponent
      },
      {
        path:"listado",
        component:ListEditorialComponent
      },
      {
        path:"listado/:page",
        component:ListEditorialComponent
      },
      {
        path:"editar/:editorialId",
        component:EditEditorialComponent
      },
      {
        path:"detalle/:editorialId",
        component:DetailEditorialComponent
      },
      {
        path:"detalle/:editorialId/:page",
        component:DetailEditorialComponent
      },
    ]
  },
  {
    path:"panel/libro",//Ruta principal
    component: MainBookComponent,//Este componente se utilizara en la ruta /panel
    children:[
      {
        path:"",
        component:ListBookComponent
      },
      {
        path:"registrar",
        component:AddBookComponent
      },
      {
        path:"listado",
        component:ListBookComponent
      },
      {
        path:"listado/:page",
        component:ListBookComponent
      },
      {
        path:"editar/:bookId",
        component:EditBookComponent
      },
    ]
  }
];

@NgModule({
  imports:[
    RouterModule.forChild(panelRoutes)//Carga las rutas...
  ],
  exports: [
    RouterModule//Módulo exportable...
  ]
})

export class PanelRoutingModule {

}
