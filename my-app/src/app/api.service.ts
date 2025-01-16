import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';  // Backend API URL

  constructor(private http: HttpClient) {}

  // --------------------- Locations API ---------------------

  // Get all locations
  getLocations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/locations/get`);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  createLocation(data: any): Observable<any> {
    console.log("Sending data to backend:", data);
    return this.http.post(`${this.apiUrl}/locations`, data)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Update a location
  updateLocation(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/locations/${id}`, data);
  }

  markLocationComplete(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/locations/status/${id}`, {});
  }


  // Delete a location
  deleteLocation(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/locations/${id}`);
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

  // Create a new log
  createLog(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logs`, data);
  }
}
