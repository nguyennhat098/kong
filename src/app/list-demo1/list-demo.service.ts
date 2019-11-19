import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export class Router {
  name: string;
  tags: string[];
  hosts: string[];
  paths: string[];
  https_redirect_status_code: number;
  regex_priority: number;
  Methods: string;
  strip_path: boolean;
  preserve_host: boolean;
  protocols: string[];
  service: Service
}
export class Service {
  name?: string;
  Description?: string;
  tags?: string;
  url?: string;
  protocol?: string;
  host?: string;
  port?: number;
  path?: string;
  Retries?: string;
  Connect?: string;
  Write?: string;
  Read?: string;
  id?: string;
}
@Injectable({
  providedIn: 'root'
})
export class ListDemoService {
  urlService='http://192.168.35.108:8001/services/'
  urlGet= 'http://192.168.35.108:8001/routes';
  urlDelete='http://192.168.35.108:8001/routes/';
  constructor(private http: HttpClient) { }
  public getService(request): Observable<any>{   
    return this.http.get(this.urlGet).pipe(map((res: any) => {
      var currentDataService={};
    
      var response = ({
        status: true,
        totalRecords: res.data.length,
        items: res.data
      });
      // response.items.forEach(element => {
      //   // debugger
      //   this.http.get('http://192.168.35.108:8001/services/'+element.service.id).subscribe((res:any)=>{
      //     element.service=res;
      //     console.log(res)
      //     console.log(element.service)
      //   })
        
     
      // });
      // console.log(response)
      return response;
    }));
  }
  public deleteRouter(request:string):any{
    return this.http.delete(this.urlDelete+request).subscribe(s=> s);
  }
}
