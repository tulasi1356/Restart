import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';  // Import ApiService for communication with backend
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  standalone: false
})
export class LocationComponent implements OnInit {
  locations: any[] = [];
  locationForm: FormGroup;
  editingLocation: any = null;

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.locationForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getLocations();
  }

  // Fetch all locations
  getLocations() {
    console.log("getLocations...");
    this.apiService.getLocations().subscribe(data => {
      this.locations = data;
    });
  }

  // Create or update location
  onSubmit() {
    if (this.locationForm.invalid) return;

    const locationData = { name: this.locationForm.value.name };

    if (this.editingLocation) {
      console.log("update...", locationData);
      this.apiService.updateLocation(this.editingLocation._id, locationData).subscribe(() => {
        console.log("updateLocation response:");
        this.getLocations();
        this.clearForm();
      });
    } else {
      console.log("create...", locationData);
      this.apiService.createLocation(locationData).subscribe((data) => {
        console.log("createLocation response:", data);
        this.getLocations();
        this.clearForm();
      });
    }
  }

  // Mark a location as complete
  markComplete(location: any) {
    this.apiService.markLocationComplete(location._id).subscribe(() => {
      this.getLocations();
    });
  }

  // Delete location
  deleteLocation(location: any) {
    this.apiService.deleteLocation(location._id).subscribe(() => {
        this.getLocations();
    });
   
  }

  // Edit a location
  editLocation(location: any) {
    this.editingLocation = location;
    this.locationForm.patchValue({ name: location.name });
  }

  // Clear form
  clearForm() {
    this.locationForm.reset();
    this.editingLocation = null;
  }
}
