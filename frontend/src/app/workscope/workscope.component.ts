import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '../models/location.model'; 
import { WorkScope } from '../models/workscope.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-workscope',
  standalone: false,
  templateUrl: './workscope.component.html',
  styleUrl: './workscope.component.scss'
})
export class WorkscopeComponent implements OnInit{
  workScopeForm: FormGroup;
  displayedColumns: string[] = ['name', 'duration', 'displayTime', 'variance', 'mapLocations'];
  workScopes: WorkScope[] = [];
  locations: Location[] = [];
  unmappedLocations: Location[] = [];
  selectedLocations: { [key: string]: string } = {};
  newScope = {
    name: '',
    duration: 1,
    displayTime: '',
    variance: 1
  };

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
  ) {

    this.workScopeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      duration: [1, [Validators.required, Validators.min(1)]],
      displayTime: ['', Validators.required],
      variance: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.loadWorkScopes();
    this.loadLocations();
  }

  loadWorkScopes() {
    this.apiService.getWorkScopes().subscribe((data) => {
      this.workScopes = data;
    });
  }

  loadLocations() {
    this.apiService.getLocations().subscribe((data) => {
      this.locations = data;
      this.updateUnmappedLocations();
    });
  }

  updateUnmappedLocations() {
    this.unmappedLocations = this.locations.filter(location => !location.workScope);
  }

  createWorkScope() {
    this.apiService.createWorkScope(this.workScopeForm.value).subscribe((data) => {
      this.workScopes = [...this.workScopes, data];
      this.newScope = {
        name: '',
        duration: 1,
        displayTime: '',
        variance: 1
      };
      this.snackBar.open('Work scope created successfully', 'Close', {
        duration: 3000,
      });
    });
  }

  mapLocation(scopeId: string) {
    const locationId = this.selectedLocations[scopeId];
    if (!locationId) return;

    this.apiService.mapLocationToScope(locationId, scopeId).subscribe(
      () => {
        this.loadLocations();
        this.loadWorkScopes();
        delete this.selectedLocations[scopeId];
        this.snackBar.open('Mapped Location Successfully', 'Close', {
          duration: 3000,
        });
      },
      error => {
        if (error.status === 400) {
          this.snackBar.open('Location is already mapped to a work scope', 'Close', {duration: 3000,
          panelClass: ['error-snackbar']});
        }
        this.snackBar.open('Failed to map location', 'Close', {duration: 3000,
        panelClass: ['error-snackbar']});
      }
    );
  }
}

