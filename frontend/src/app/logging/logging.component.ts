import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { LocationHistoryComponent } from '../location-history/location-history.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '../models/location.model';
import { WorkScope } from '../models/workscope.model';
import { Log } from '../models/log.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-logging',
  standalone: false,
  templateUrl: './logging.component.html',
  styleUrl: './logging.component.scss'
})
export class LoggingComponent implements OnInit{

  logs: Log[] = [];
  filteredLogs: Log[] = [];
  locations: Location[] = [];
  workScopes: WorkScope[] = [];
  loading = false;
  filterStatus = 'all';
  filterLocation = 'all';

  constructor(private apiService: ApiService, private dialog: MatDialog, private snackBar: MatSnackBar,) {}

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
    this.apiService.getWorkScopes().subscribe(data => {
      this.workScopes = data;
    });
  }

  applyFilters() {
    this.filteredLogs = this.logs.filter(log => {
      
      // Status filter
      const statusMatch = this.filterStatus === 'all' || 
        (this.filterStatus === 'completed') === log.isCompleted;
      
      // Location filter
      const locationMatch = this.filterLocation === 'all' || 
        log.location === this.filterLocation;
      
      return statusMatch && locationMatch;
    });
  }

  completeLog(log: Log) {
    this.apiService.completeLog(log._id).subscribe(
     () => {
      log.isCompleted = true;
      log.completedAt = new Date();
      this.snackBar.open('Log marked as completed', 'Close', {
        duration: 3000,
      });
     }
    );
  }

  showHistoryLogs(locationId: string): void{
      this.apiService.getLocationHistory(locationId).subscribe(
          history => {
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
    return location ? location.name : 'Unknown Location';
  }

  getWorkScopeName(workScopeId: string): string {
    const workScope = this.workScopes.find(scope => scope._id === workScopeId);
    return workScope ? workScope.name : 'Unknown Work Scope';
  }
}
