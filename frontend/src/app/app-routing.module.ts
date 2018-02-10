import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'vga',
    pathMatch: 'full'
  },
  {
    path: ':type',
    component: HomeComponent
  },
  {
    path: ':type/details',
    component: DetailsComponent
  },
  {
    path: ':type/details/:id',
    component: DetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
