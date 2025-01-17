import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';
import { WorkScope } from '../models/workscope.model';

@Component({
  selector: 'app-location-history',
  standalone: false,
  templateUrl: './location-history.component.html',
  styleUrl: './location-history.component.scss'
})
export class LocationHistoryComponent {

  workScopes: WorkScope[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public historyData: any[],
    private dialogRef: MatDialogRef<LocationHistoryComponent>,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.apiService.getWorkScopes().subscribe(data => {
      this.workScopes = data;
    });
  }

  getObjectKeys(obj: any): string[] {
    if (!obj) return [];
    return Object.keys(obj).filter(key => 
      !key.startsWith('$') && 
      key !== '__v' && 
      key !== '_id' &&
      obj[key] !== null
    );
  }

  getChangedFields(oldValue: any, newValue: any): string[] {

    if (!oldValue || !newValue) return [];
    const result = Object.keys(newValue).filter(key => 
      !key.startsWith('$') && 
      key !== '__v' && 
      key !== '_id' &&
      JSON.stringify(oldValue[key]) !== JSON.stringify(newValue[key])
    );
    return result;
  }

  formatValue(value: any): string {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') {
      if (value.$date) {
        return new Date(value.$date).toLocaleString();
      }
      if (value.$oid) {
        return value.$oid;
      }
      return JSON.stringify(value);
    }
    return String(value);
  }

  deleteHistoryLog(historyId: string) {
    console.log('Deleting history entry:', historyId);
    this.apiService.deleteHistoryLog(historyId).subscribe(
      () => {
        try {
          this.historyData = this.historyData.filter(log => log._id.$oid !== historyId);
          this.snackBar.open('History entry deleted', 'Close', {
            duration: 3000,
          });
          this.dialogRef.close();
        } catch (err) {
          this.snackBar.open('Error deleting history entry', 'Close', {
            duration: 3000,
          });
        }
      }
    );
  }

  getWorkScopeName(workScopeId: string): string {
    const workScope = this.workScopes.find(scope => scope._id === workScopeId);
    return workScope ? workScope.name : 'Unknown Work Scope';
  }

}
