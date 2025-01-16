import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-workscope',
  standalone: false,
  
  templateUrl: './workscope.component.html',
  styleUrl: './workscope.component.scss'
})
export class WorkscopeComponent implements OnInit{
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
    private apiService: ApiService,
  ) {}

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
    if (!this.newScope.name || !this.newScope.displayTime) return;
    
    this.apiService.createWorkScope(this.newScope).subscribe(() => {
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

