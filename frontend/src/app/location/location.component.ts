import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LocationHistoryComponent } from '../location-history/location-history.component';
import { Location } from '../models/location.model'; 
import { WorkScope } from '../models/workscope.model';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  standalone: false
})

export class LocationComponent implements OnInit {
  locations: Location[] = [];
  workScopes: WorkScope[] = [];
  locationForm: FormGroup;
  editingLocation: Location | null = null;
  displayedColumns: string[] = ['sno', 'name', 'workScope', 'status', 'actions'];

  constructor(private apiService: ApiService, private fb: FormBuilder, private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.locationForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getLocations();
    this.getWorkScopes();
  }

  // Fetch all locations
  getLocations() {
    this.apiService.getLocations().subscribe(data => {
      this.locations = data;
    });
  }

  getWorkScopes() {
    this.apiService.getWorkScopes().subscribe(data => {
      this.workScopes = data;
    });
  }

  // Create or update location
  onSubmit() {
    if (this.locationForm.invalid) return;

    const locationData = { name: this.locationForm.value.name };

    if (this.editingLocation) {
    
      this.apiService.updateLocation(this.editingLocation._id, locationData).subscribe(() => {
        try {
          this.getLocations();
          this.clearForm();
          this.snackBar.open('Location updated successfully', 'Close', {
            duration: 3000,
          });
        } catch (err) {
          this.snackBar.open('Not able to create the location, Can you please try after sometime', 'Close', {
            duration: 3000,
          });
        }
        
      });
     
    } else {
      
      this.apiService.createLocation(locationData).subscribe((data) => {
        try {
          this.getLocations();
          this.clearForm();
          this.snackBar.open('Location created successfully', 'Close', {
            duration: 3000,
          });
        } catch (error) {
          this.snackBar.open('Not able to create the location, Can you please try after sometime', 'Close', {
            duration: 3000,
          });
        }
        
      });
      

    }
  }

  // Mark a location as complete
  markComplete(location: Location) {
    if (location.workScope === null)
      this.snackBar.open('Please assign a work scope to this location', 'Close', {
        duration: 3000,
      });
    else {
      this.apiService.markLocationComplete(location._id).subscribe(() => {
        this.getLocations();
      });
    }
  }
  
  // Delete location
  deleteLocation(location: Location) {
    this.apiService.deleteLocation(location._id).subscribe(() => {
       try {
        this.getLocations();
        this.snackBar.open('Location deleted successfully', 'Close', {
          duration: 3000,
        });
       } catch (error) {
        this.snackBar.open('Error deleting location', 'Close', {
          duration: 3000,
        });
       }
    });
  }

  editLocation(location: Location) {
    this.editingLocation = location;
    this.locationForm.patchValue({ name: location.name });
  }

  clearForm() {
    this.locationForm.reset();
    this.editingLocation = null;
  }

  viewHistory(location: Location) {
    this.apiService.getLocationHistory(location._id).subscribe(
      history => {
        this.dialog.open(LocationHistoryComponent, {
          width: '800px',
          data: history,
          maxHeight: '90vh'
        });
      }
    );
  }

  getWorkScopeName(id: string) {
    const workScope = this.workScopes.find(scope => scope._id === id);
    return workScope ? workScope.name : 'N/A';
  }
}
