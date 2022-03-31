import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';//Peticiones AJAX.
import { FormsModule } from "@angular/forms";
import '@fortawesome/fontawesome-free/js/all.js';

//Módulos y servicios
import { BrowserModule } from '@angular/platform-browser';
import { appRoutingProviders, routing } from './app.routing';
import { PanelModule } from "./panel/panel.module";

//Componentes
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    PanelModule,
    routing,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
