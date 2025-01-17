import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { LocationHistoryComponent } from '../location-history/location-history.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-logging',
  standalone: false,
  
  templateUrl: './logging.component.html',
  styleUrl: './logging.component.scss'
})
export class LoggingComponent implements OnInit{

  logs: any[] = [];
  filteredLogs: any[] = [];
  locations: any[] = [];
  loading = false;
  searchTerm = '';
  filterStatus = 'all';
  filterLocation = 'all';

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    // Refresh logs every minute to check time windows
    interval(60000)
      .pipe(
        startWith(0),
        switchMap(() => {
          this.loading = true;
          return this.apiService.getLogs();
        })
      )
      .subscribe(data => {
        this.logs = data;
        this.applyFilters();
        this.loading = false;
      });

    this.apiService.getLocations().subscribe(data => {
      this.locations = data;
    });
  }

  applyFilters() {
    this.filteredLogs = this.logs.filter(log => {
      // Search term filter
      const searchMatch = !this.searchTerm || 
        log.location.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Status filter
      const statusMatch = this.filterStatus === 'all' || 
        (this.filterStatus === 'completed') === log.isCompleted;
      
      // Location filter
      const locationMatch = this.filterLocation === 'all' || 
        log.location === this.filterLocation;
      
      return searchMatch && statusMatch && locationMatch;
    });
  }

  completeLog(log: any) {
    this.apiService.completeLog(log._id).subscribe(
     () => {
      log.isCompleted = true;
      log.completedAt = new Date();
     }
    );
  }

  showHistoryLogs(locationId: string): void{
      this.apiService.getLocationHistory(locationId).subscribe(
          history => {
            // this.selectedLocationHistory = history;
            this.dialog.open(LocationHistoryComponent, {
              width: '800px',
              data: history,
              maxHeight: '90vh'
            });
          }
        );
  }

  getLocationName(locationId: string): string {
    const location = this.locations.find(loc => loc._id === locationId);
    return location ? location.name : 'Unknown Location'; // Default value if not found
  }
}
