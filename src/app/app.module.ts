import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';  // Для работы с HTTP-запросами
import { AppRoutingModule } from './app-routing.module';  // Для роутинга
import { AppComponent } from './app.component';  // Основной компонент
import { FormsModule } from '@angular/forms';
import { ClientDirectoryComponent } from './client-directory/client-directory.component';  // Импорт standalone компонента

import { ClientService } from './services/client.service';
import { IncidentDirectoryComponent } from './incident-directory/incident-directory.component';
import { ClassificationDirectoryComponent } from './classification-directory/classification-directory.component';
import { ResolutionDirectoryComponent } from './resolution-directory/resolution-directory.component';
import {LoaderComponent} from './shared/loader/loader.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './shared/loader/loader.interceptor';




@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,  // Импорт модуля для работы с ngModel
    ClientDirectoryComponent,
    ClassificationDirectoryComponent,
    ResolutionDirectoryComponent,




  ],
  providers: [ClientService,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptor,
    multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
