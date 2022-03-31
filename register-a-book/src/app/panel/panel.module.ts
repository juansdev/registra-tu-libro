// Modulos
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { PanelRoutingModule } from "./panel-routing.module";

// Componentes
// Autor
import { MainAuthorComponent } from "./components/author/main-author/main-author.component";
import { ListAuthorComponent } from "./components/author/list-author/list-author.component";
import { AddAuthorComponent } from "./components/author/add-author/add-author.component";
import { EditAuthorComponent } from "./components/author/edit-author/edit-author.component";
import { DetailAuthorComponent } from './components/author/detail-author/detail-author.component';
// Editorial
import { MainEditorialComponent } from './components/editorial/main-editorial/main-editorial.component';
import { AddEditorialComponent } from './components/editorial/add-editorial/add-editorial.component';
import { EditEditorialComponent } from './components/editorial/edit-editorial/edit-editorial.component';
import { ListEditorialComponent } from './components/editorial/list-editorial/list-editorial.component';
import { DetailEditorialComponent } from './components/editorial/detail-editorial/detail-editorial.component';
// Book
import { MainBookComponent } from './components/book/main-book/main-book.component';
import { AddBookComponent } from './components/book/add-book/add-book.component';
import { EditBookComponent } from './components/book/edit-book/edit-book.component';
import { ListBookComponent } from './components/book/list-book/list-book.component';

// Servicios
import { AuthorService } from "../services/author.service";
import { EditorialService } from "../services/editorial.service";
import { BookService } from "../services/book.service";
import { SearchComponent } from './components/search/search.component';

// NgModule
@NgModule({
  declarations: [
    //Componentes Author
    MainAuthorComponent,
    ListAuthorComponent,
    AddAuthorComponent,
    EditAuthorComponent,
    DetailAuthorComponent,
    //Componentes Editorial
    MainEditorialComponent,
    ListEditorialComponent,
    AddEditorialComponent,
    EditEditorialComponent,
    DetailEditorialComponent,
    //Componentes Book
    MainBookComponent,
    ListBookComponent,
    AddBookComponent,
    EditBookComponent,
    SearchComponent,
  ],
  imports: [//Cargar todos los Módulos
    CommonModule,
    FormsModule,
    HttpClientModule,
    PanelRoutingModule,
  ],
  exports: [//Exportaremos todos estos componentes...
    //Componentes Author
    MainAuthorComponent,
    ListAuthorComponent,
    AddAuthorComponent,
    EditAuthorComponent,
    DetailAuthorComponent,
    //Componentes Editorial
    MainEditorialComponent,
    ListEditorialComponent,
    AddEditorialComponent,
    EditEditorialComponent,
    DetailEditorialComponent,
    //Componentes Book
    MainBookComponent,
    ListBookComponent,
    AddBookComponent,
    EditBookComponent,
  ],
  providers: [
    AuthorService,
    EditorialService,
    BookService
  ]
})
export class PanelModule {

}
