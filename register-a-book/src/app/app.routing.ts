//Importar los módulos necesarios para el Router
import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

//Importar Componentes
import { HomeComponent } from "./components/home/home.component";
import { ErrorComponent } from "./components/error/error.component";
import { SearchComponent } from "./panel/components/search/search.component";

//Array de rutas
const appRoutes: Routes = [
  {path:"", component: HomeComponent},
  {path:"inicio", component: HomeComponent},
  {path:"panel/autor/registrar", component: HomeComponent},
  {path:"panel/editorial/registrar", component: HomeComponent},
  {path:"panel/libro/registrar", component: HomeComponent},
  {path:"libros", component: HomeComponent},
  {path:"autores", component: HomeComponent},
  {path:"editoriales", component: HomeComponent},
  {path:"buscar/:search", component: SearchComponent},
  {path:"**", component: ErrorComponent}
];

//Exportar configuración
export const appRoutingProviders: any[] = [];
export const routing:ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
