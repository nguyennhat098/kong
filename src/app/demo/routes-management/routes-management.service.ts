import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IgxExcelExporterService, IgxExcelExporterOptions } from 'igniteui-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceViewModel, RouteSearchRequest, RouteSearchResponse, ModelMapper, RouteViewModel } from './routes.model';
import { MockService } from 'ngx-fw4c';
import 'jspdf-autotable';
import * as jspdf from 'jspdf';
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: 'root'
})

export class RoutesManagementService {
  offset = '';
  urlService = 'http://localhost:8001/services'
  urlGet = 'http://localhost:8001/routes';

  constructor(private _http: HttpClient, private _excelExportService: IgxExcelExporterService) { }

  public serviceList(size: number = 999): Observable<RouteSearchResponse> {
    return this._http.get(`${this.urlService}?size=${size}`).pipe(map((s: any) => s.data));
  }

  // public search(request: RouteSearchRequest): Observable<RouteSearchResponse> {
  //   return this._http.get(`${this.urlGet}?size=999`, { params: request as any }).pipe(map((r: any) => {
  //     this._http.get(`${this.urlService}`).subscribe((s: any) => {
  //       for (let index = 0; index < r.data.length; index++) {
  //         var currentService = (s.data as []).find((s: any) => s.id == r.data[index].service.id);
  //         r.data[index].serviceName = (currentService as ServiceViewModel).name;
  //       }
  //     });
  //      return new RouteSearchResponse({ items: r.data });
  //   }));
  // }
  public search(request: RouteSearchRequest): Observable<RouteSearchResponse> {
    return this._http.get(`${this.urlGet}?size=999`, { params: request as any }).pipe(map((r: any) => {
      
      return new RouteSearchResponse({
        items: r.data.map((items: any) => new ModelMapper(RouteViewModel).map(items) )
      })
    }));
  }
  public edit(item, request: RouteSearchRequest): Observable<RouteSearchResponse> {
    return this._http.put(this.urlGet + '/' + item.id, item, httpOptions);
  }

  public delete(item, request: RouteSearchRequest): Observable<RouteSearchResponse> {
    return this._http.delete(this.urlGet + '/' + item.id);
  }

  public add(item, request: RouteSearchRequest): Observable<RouteSearchResponse> {
    return this._http.post(this.urlGet, item);
  }

  public exportPdf(data) {
    var col = ["Name", "Tags", "Hosts", "Service", "Paths"];
    var rows = [];
    data.forEach(element => {
      var temp = [element.name, element.tags, element.hosts, element.serviceName, element.paths];
      rows.push(temp);
    });
    let pdf = new jspdf('p', 'mm', 'a4');
    pdf.autoTable(col, rows);
    pdf.save('MYPdf.pdf');
  }

  public exportTemplateExcel(): void {
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
    this._excelExportService.exportData(dataExport, new IgxExcelExporterOptions("template" + new Date().getTime()));
  }

  public exportExcel(data): void {
    var convertData = [];

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      delete element['preserve_host'];
      delete element['https_redirect_status_code'];
      delete element['regex_priority'];
      delete element['strip_path'];

      element.paths = element.paths.toString();
      element.methods = element.methods ? element.methods.toString() : null;
      element.protocols = element.protocols ? element.protocols.toString() : null;
      element.tags = element.tags ? element.tags.toString() : null;
      element.hosts = element.hosts ? element.hosts.toString() : null;
      element.service = element.service.id;
      convertData.push(element);
    }

    this._excelExportService.exportData(convertData, new IgxExcelExporterOptions("data-routes" + new Date().getTime()));
  }
}
