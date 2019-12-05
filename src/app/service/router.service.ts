import { Injectable } from '@angular/core';
import { ValidationRuleResponse } from 'ngx-fw4c';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IgxExcelExporterOptions, IgxExcelExporterService } from "igniteui-angular";
import 'jspdf-autotable';
import * as jspdf from 'jspdf';
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
  urlService = 'http://192.168.110.112:8001/services/'
  urlGet = 'http://192.168.110.112:8001/routes';
  urlDelete = 'http://192.168.110.112:8001/routes/';

  constructor(private http: HttpClient, private excelExportService: IgxExcelExporterService) { }

  public search(size: number = 999): Observable<any[]> {
    return this.http.get(`http://localhost:8001/routes?size=${size}`).pipe(map((r: any) => {
      this.http.get('http://localhost:8001/services').subscribe((s:any)=>{
        for (let index = 0; index < r.data.length; index++) {
         var currentService=(s.data as []).find((s:any)=>s.id== r.data[index].service.id);
         r.data[index].service_name=(currentService as ServiceViewModel).name;
        }
      });
     
     return r.data
    }));
  }

  public editRouter(item, callback: () => void): void {
    console.log(item)
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
    var regex = new RegExp("^[a-zA-Z0-9.\~\-]*$");
    return of(new ValidationRuleResponse({
      status: regex.test(input) || input == null,
      message: 'wrong format.'
    }));
  }

  public validateURL(url: string[]): Observable<ValidationRuleResponse> {
    var regex = new RegExp("^[a-zA-Z0-9.\~\-]*$");
    var data = url.filter(x => x && !x.startsWith('/', 0) && regex.test(x));
    return of(new ValidationRuleResponse({
      status: data.length < 1,
      message: 'A list of paths that match this Route. For example: /my-path. At least one of hosts, paths, or methods must be set.'
    }));
  }

  public validateMethod(val: string[]): Observable<ValidationRuleResponse> {
    var value = val.filter(x => x && !(['GET', 'PUT', 'POST', 'DELETE'].indexOf(x) > -1));
    return of(new ValidationRuleResponse({
      status: value.length < 1,
      message: 'A list of HTTP methods that match this Route. At least one of hosts, paths, or methods must be set.'
    }));
  }

  public validateProtocol(input: string[]): Observable<ValidationRuleResponse> {
    var data = input.filter(x => x && !(['http', 'https'].indexOf(x) > -1));
    return of(new ValidationRuleResponse({
      status: data.length < 1,
      message: 'A list of the protocols this Route should allow. By default it is ["http", "https"], which means that the Route accepts both. When set to ["https"], HTTP requests are answered with a request to upgrade to HTTPS.'
    }));
  }

  public validateHost(input: string[]): Observable<ValidationRuleResponse> {
    var regex = new RegExp("^[a-zA-Z0-9]*$");
    var regexNumber = new RegExp("^[0-9]*$");
    var value = input.filter(x => x && !(regex.test(x) && !regexNumber.test(x)));
    return of(new ValidationRuleResponse({
      status: value.length < 1,
      message: 'A list of domain names that match this Route. For example: example.com. At least one of hosts, paths, or methods must be set.'
    }));
  }

  public validateStatusCode(input: number): Observable<ValidationRuleResponse> {
    return of(new ValidationRuleResponse({
      status: input == 426 || input == 301 || input == 302 || input == 307 || input == 308,
      message: 'Https redirect status code expected one of: 426, 301, 302, 307, 308.'
    }));
  }

  public validateTag(input: string[]): Observable<ValidationRuleResponse> {
    var regex = new RegExp("^[a-zA-Z0-9.-~]*$");
    var data = input.filter(x => x && !regex.test(x));
    return of(new ValidationRuleResponse({
      status: data.length < 1,
      message: 'wrong format.'
    }))
  }

  public exportPdf(data) {
    var col = ["Name", "Tags", "Hosts", "Service", "Paths"];
    var rows = [];
    data.forEach(element => {
      var temp = [element.name, element.tags, element.hosts, element.service_name, element.paths];
      rows.push(temp);
    });
    let pdf = new jspdf('p', 'mm', 'a4');
    pdf.autoTable(col, rows);
    pdf.save('MYPdf.pdf');
  }

  exportTemplateExcel() {
    var dataExport = [];
    const element: any = {};
    element.name = '';
    element.methods = '';
    element.hosts = '';
    element.tags = '';
    element.paths = '';
    element.https_redirect_status_code = '';
    element.regex_priority = '';
    element.methods = '';
    element.strip_path = '';
    element.preserve_host = '';
    element.protocols = '';
    element.service = '';
    dataExport.push(element);
    this.excelExportService.exportData(dataExport, new IgxExcelExporterOptions("template" + new Date().getTime()));
  }

  exportExcel(data) {
    var convertData = [];

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      console.log(element)
      element.paths = element.paths.toString();
      element.methods = element.methods ? element.methods.toString() : null;
      element.protocols = element.protocols ? element.protocols.toString() : null;
      element.tags = element.tags ? element.tags.toString() : null;
      element.hosts = element.hosts ? element.hosts.toString() : null;
      element.service = element.service.id;
      convertData.push(element);
    }

    this.excelExportService.exportData(convertData, new IgxExcelExporterOptions("data-routes" + new Date().getTime()));
  }

  public exportAsExcel(json: any[], excelFileName: string): void {
    var convertData = [];

    for (let index = 0; index < json.length; index++) {
      const element = json[index];
      element.paths = element.paths.toString();
      element.methods = element.methods ? element.methods.toString() : null;
      element.protocols = element.protocols ? element.protocols.toString() : null;
      element.tags = element.tags ? element.tags.toString() : null;
      element.hosts = element.hosts ? element.hosts.toString() : null;
      element.service = element.service.id;
      convertData.push(element);
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(convertData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcel(excelBuffer, excelFileName);
  }

  private saveAsExcel(buffer: any, filename: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, filename + '_export' + new Date().getTime() + EXCEL_EXTENSION);
  }
}