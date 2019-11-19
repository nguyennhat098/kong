import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ButtonDemoService {

  urlGet= 'http://www.mocky.io/v2/5dca844233000073003dedd1';
  constructor(private http: HttpClient) { }
  public getService(request): Observable<any>{   
    return this.http.get(this.urlGet);
  }
}
