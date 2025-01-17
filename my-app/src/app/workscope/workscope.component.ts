import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-workscope',
  standalone: false,
  
  templateUrl: './workscope.component.html',
  styleUrl: './workscope.component.scss'
})
export class WorkscopeComponent implements OnInit{
  workScopeForm: FormGroup;
  displayedColumns: string[] = ['name', 'duration', 'displayTime', 'variance', 'mapLocations'];
  workScopes: any[] = [];
  locations: any[] = [];
  unmappedLocations: any[] = [];
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
  ) {

    this.workScopeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],  // Name should be required and at least 3 characters
      duration: [1, [Validators.required, Validators.min(1)]],  // Duration should be a positive number (min 1)
      displayTime: ['', Validators.required],  // Display Time should be required
      variance: [0, [Validators.required, Validators.min(0)]],  // Variance should be a positive number (min 0)
    });
  }

  ngOnInit() {
    this.loadWorkScopes();
    this.loadLocations();
  }

  loadWorkScopes() {
    this.apiService.getWorkScopes().subscribe((data) => {
      console.log('Work scopes:', data);
      this.workScopes = data;
    });
  }

  loadLocations() {
    this.apiService.getLocations().subscribe((data) => {
      console.log('Locations:', data);
      this.locations = data;
      this.updateUnmappedLocations();
    });
  }

  updateUnmappedLocations() {
    this.unmappedLocations = this.locations.filter(location => !location.workScope);
    console.log('Unmapped locations:', this.unmappedLocations);
  }

  createWorkScope() {
    console.log('Creating work scope:',  this.workScopeForm.value);
    this.apiService.createWorkScope(this.workScopeForm.value).subscribe(() => {
      this.loadWorkScopes();
      this.newScope = {
        name: '',
        duration: 1,
        displayTime: '',
        variance: 1
      };
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
      },
      error => {
        if (error.status === 400) {
          alert('Location is already mapped to another scope');
        }
      }
    );
  }
}

