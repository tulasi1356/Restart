import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationComponent } from './location/location.component';
import { WorkscopeComponent } from './workscope/workscope.component';
import { LoggingComponent } from './logging/logging.component';

const routes: Routes = [
  { path: '', redirectTo: 'locations', pathMatch: 'full' },  // Default route
  { path: 'locations', component: LocationComponent },
  {path: 'workscopes', component: WorkscopeComponent},
  {path: 'log', component: LoggingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
