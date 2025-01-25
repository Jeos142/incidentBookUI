import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientDirectoryComponent } from './client-directory/client-directory.component';
import {IncidentDirectoryComponent} from './incident-directory/incident-directory.component';
import {ClassificationDirectoryComponent} from './classification-directory/classification-directory.component';
import {ResolutionDirectoryComponent} from './resolution-directory/resolution-directory.component';  // Импорт компонента для справочника клиентов

const routes: Routes = [
  { path: '', redirectTo: '/clients', pathMatch: 'full' },  // Редирект на страницу с клиентами по умолчанию
  { path: 'clients', component: ClientDirectoryComponent },
  { path: 'incidents', component: IncidentDirectoryComponent },
  { path: 'classifications', component: ClassificationDirectoryComponent },
  { path: 'resolution', component: ResolutionDirectoryComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
