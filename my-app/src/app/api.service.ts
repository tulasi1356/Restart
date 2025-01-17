import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Location } from './models/location.model'; 

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

  getLocationHistory(locationId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/locations/${locationId}/history`);
  }
  
  deleteHistoryLog(historyId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/locations/history/${historyId}`);
  }

  // --------------------- WorkScopes API ---------------------


  getWorkScopes() {
    return this.http.get<any>(`${this.apiUrl}/workscopes`);
  }

  createWorkScope(workScope: any) {
    return this.http.post<any>(`${this.apiUrl}/workscopes`, workScope);
  }

  mapLocationToScope(locationId: string, scopeId: string) {
    return this.http.post<any>(`${this.apiUrl}/workscopes/map`, { locationId, scopeId });
  }

  // --------------------- Logs API ---------------------

  getLogs() {
    return this.http.get<any>(`${this.apiUrl}/logs`);
  }

  completeLog(id: string) {
    return this.http.put<any>(`${this.apiUrl}/logs/${id}/complete`, {});
  }

  createLog(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logs`, data);
  }
}
