import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Location, locationHistory } from './models/location.model'; 
import { WorkScope } from './models/workscope.model';
import { Log } from './models/log.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';  // Backend API URL

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }


  // --------------------- Locations API ---------------------

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations/get`);
  }

  createLocation(data: {name: string}): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/locations`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateLocation(id: string, data: {name: string}): Observable<Location> {
    return this.http.put<Location>(`${this.apiUrl}/locations/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  markLocationComplete(id: string): Observable<{message: string}> {
    return this.http.put<{message: string}>(`${this.apiUrl}/locations/status/${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  deleteLocation(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/locations/${id}`);
  }

  getLocationHistory(locationId: string): Observable<locationHistory[]> {
    return this.http.get<locationHistory[]>(`${this.apiUrl}/locations/${locationId}/history`);
  }
  
  deleteHistoryLog(historyId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/locations/history/${historyId}`);
  }

  // --------------------- WorkScopes API ---------------------


  getWorkScopes(): Observable<WorkScope[]> {
    return this.http.get<WorkScope[]>(`${this.apiUrl}/workscopes`);
  }

  createWorkScope(workScope: WorkScope): Observable<WorkScope> {
    return this.http.post<WorkScope>(`${this.apiUrl}/workscopes`, workScope);
  }

  mapLocationToScope(locationId: string, scopeId: string): Observable<Location> {
    return this.http.post<Location>(`${this.apiUrl}/workscopes/map`, { locationId, scopeId });
  }

  // --------------------- Logs API ---------------------

  getLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.apiUrl}/logs`);
  }

  completeLog(id: string): Observable<{message: string}> {
    return this.http.put<{message: string}>(`${this.apiUrl}/logs/${id}/complete`, {});
  }
}
