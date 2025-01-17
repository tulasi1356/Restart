import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocationComponent } from './location/location.component';
import { LoggingComponent } from './logging/logging.component';
import { WorkscopeComponent } from './workscope/workscope.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatToolbarModule } from '@angular/material/toolbar';  // Import MatToolbarModule
import { MatButtonModule } from '@angular/material/button'; 
import { NavbarComponent } from './navbar/navbar.component';
import { MatTableModule } from '@angular/material/table'  
import {MatIconModule} from '@angular/material/icon'
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { LocationHistoryComponent } from './location-history/location-history.component';
import { MatCardModule } from '@angular/material/card';
// import { LocationHistoryComponent } from './location-history/location-history.component';
// import {
//   MatDialog,
//   MatDialogActions,
//   MatDialogClose,
//   MatDialogContent,
//   MatDialogRef,
//   MatDialogTitle,
// } from '@angular/material/dialog';

// import {MatSnackBar} from '@angular/material/snack-bar';
@NgModule({
  declarations: [
    AppComponent,
    LocationComponent,
    LoggingComponent,
    WorkscopeComponent,
    NavbarComponent,
    LocationHistoryComponent,
    // LocationHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatListModule,
    MatDividerModule,
    MatDialogModule,
    MatCardModule,
    HttpClientModule
  ],
  providers: [ApiService, provideAnimationsAsync()],
  bootstrap: [AppComponent],
  // exports: [MatTableModule]
})
export class AppModule { }
