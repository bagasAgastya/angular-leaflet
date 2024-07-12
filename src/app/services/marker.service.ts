import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  private apiUrl = 'https://dev.chronicle.rip/api/v1/ms/plots-in-viewport';

  constructor(private http: HttpClient) {}

  getPlots(bounds: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?bounds=${bounds}`);
  }
}
