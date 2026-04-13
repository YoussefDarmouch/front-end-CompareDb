import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompareRequest } from '../Models/ConfigeDb';

@Injectable({
  providedIn: 'root'
})
export class CompreDBService {

  private apiUrl = 'http://localhost:8080/api/compare';

  constructor(private http: HttpClient) {}

  compareColumns(req: CompareRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/columns`, req);
  }
  compareData(req: CompareRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/data`, req);
  }
  compareTables(req: CompareRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/tables`, req);
  }
    compareTypes(req: CompareRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/types`, req);
  }
    compareFunctions(req: CompareRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/functions`, req);
  }
    compareProcedures(req: CompareRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/procedures`, req);
  }
  compareTriggers(req: CompareRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/triggers`, req);
  }
}