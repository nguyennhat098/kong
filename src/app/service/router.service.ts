import { Injectable } from '@angular/core';
import { ValidationRuleResponse } from 'ngx-fw4c';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as FileSaver from 'file-saver';  
import * as XLSX from 'xlsx'; 
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';  
const EXCEL_EXTENSION = '.xlsx'; 
export class RouterViewModel {
  name: string;
  tags: string;
  hosts: string[];
  paths: string[];
  https_redirect_status_code: number;
  regex_priority: number;
  methods: string[];
  strip_path: boolean;
  preserve_host: boolean;
  protocols: string[];
  service: ServiceViewModel;
  id: string;
}
export class ServiceViewModel {
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
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
@Injectable({
  providedIn: 'root'
})

export class RouterService {
  offset = '';
  urlService = 'http://localhost:8001/services/'
  urlGet = 'http://localhost:8001/routes';
  urlDelete = 'http://localhost:8001/routes/';

  constructor(private http: HttpClient) { }
 
  public editRouter(item, callback: () => void): void {
    this.http.put(this.urlDelete + item.id, item, httpOptions).subscribe(() => {
      callback();
    });
  }
  public deleteRouter(item, callback: () => void): any {
    this.http.delete(this.urlDelete + item.id).subscribe(() => {
      callback();
    });
  }
  public addRouter(item): any {
    return this.http.post(this.urlDelete, item);
  }
  public validateName(input: string): Observable<ValidationRuleResponse> {
    var regex = new RegExp("^[a-zA-Z0-9.-~]*$");
    return of(new ValidationRuleResponse({
      status: regex.test(input) || input == null,
      message: 'wrong format.'
    })).pipe(delay(500));
  }
  
  public validateURL(url: string[]): Observable<ValidationRuleResponse> {
    var data = url[url.length - 1];
    var regex = new RegExp("^[a-zA-Z0-9.-~]*$");
    return of(new ValidationRuleResponse({
      status: data != null && data.startsWith('/', 0) && regex.test(data) || data == null,
      message: 'A list of paths that match this Route. For example: /my-path. At least one of hosts, paths, or methods must be set.'
    })).pipe(delay(500));
  }
  public validateMethod(val: string): Observable<ValidationRuleResponse> {
    var value = val[val.length - 1];
    return of(new ValidationRuleResponse({
      status: value == null || ['GET', 'PUT', 'POST', 'DELETE'].indexOf(value) > -1,
      message: 'A list of HTTP methods that match this Route. At least one of hosts, paths, or methods must be set.'
    })).pipe(delay(500));
  }

  public validateProtocol(input: string): Observable<ValidationRuleResponse> {
    var data = input[input.length - 1];
    return of(new ValidationRuleResponse({
      status: data == 'http' || data == 'https' || data == null,
      message: 'A list of the protocols this Route should allow. By default it is ["http", "https"], which means that the Route accepts both. When set to ["https"], HTTP requests are answered with a request to upgrade to HTTPS.'
    })).pipe(delay(500));
  }

  public validateHost(input: string): Observable<ValidationRuleResponse> {
    var regex = new RegExp("^[a-zA-Z0-9.]*$");
    var regexNumber = new RegExp("^[0-9]*$");
    var value = input[input.length - 1];
    return of(new ValidationRuleResponse({
      status: (regex.test(value) && !regexNumber.test(value)) || value == null,
      message: 'A list of domain names that match this Route. For example: example.com. At least one of hosts, paths, or methods must be set.'
    })).pipe(delay(500));
  }

  public validateStatusCode(input: number): Observable<ValidationRuleResponse> {
    return of(new ValidationRuleResponse({
      status: input == 426 || input == 301 || input == 302 || input == 307 || input == 308,
      message: 'Https redirect status code expected one of: 426, 301, 302, 307, 308.'
    })).pipe(delay(500));
  }

  public exportAsExcel(json:any[],excelFileName:string):void{
    var convertData=[];
    for (let index = 0; index < json.length; index++) {
      const element = json[index];
      element.paths= element.paths.toString();
      element.methods=element.methods? element.methods.toString():null;
      element.protocols=element.protocols? element.protocols.toString():null;
      element.tags=element.tags? element.tags.toString():null;
      element.hosts=element.hosts? element.hosts.toString():null;
      element.service=element.service.id;
      convertData.push(element);
    }
    console.log(convertData);
    const worksheet:XLSX.WorkSheet=XLSX.utils.json_to_sheet(convertData);
    const workbook:XLSX.WorkBook={Sheets:{'data':worksheet},SheetNames:['data']};
    const excelBuffer:any=XLSX.write(workbook,{bookType:'xlsx',type:'array'});
    this.saveAsExcel(excelBuffer,excelFileName);
    console.log(json)
  }
  private saveAsExcel(buffer:any,filename:string):void{
    const data:Blob=new Blob([buffer],{type:EXCEL_TYPE});
    FileSaver.saveAs(data,filename+'_export'+new Date().getTime()+EXCEL_EXTENSION);
  }

}