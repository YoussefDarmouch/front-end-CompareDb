import { Routes } from "@angular/router";
import { CompreDBComponent } from "src/app/Components/compre-db/compre-db.component";

export const routes: Routes = [
  { path: '', redirectTo: 'compare', pathMatch: 'full' },

  { 
    path: 'compare',
    component: CompreDBComponent,
    title: 'Compare DB'
  }
];