import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'ts-xlsx';
import { Observable, of } from 'rxjs';
import { ValidationService, ClientValidator } from 'ngx-fw4c';
@Component({
  selector: 'app-export-routes',
  templateUrl: './export-routes.component.html',
  styleUrls: ['./export-routes.component.scss']
})
export class ExportRoutesComponent implements OnInit {

  @ViewChild('inputFile',{static:true}) myInputVariable: ElementRef;
	@ViewChild("formRef", { static: true }) public formRef: ElementRef;
	ShowImport = false;
	data: any = [];
	arrayBuffer: any;
	file: File;

	constructor(private _validationService: ValidationService) { }

	ngOnInit() {
		this.initValidations();
		this.data = 'exportExcel';
	}

	Upload() {
		let fileReader = new FileReader();
		fileReader.onload = () => {
			this.arrayBuffer = fileReader.result;
			var data = new Uint8Array(this.arrayBuffer);
			var arr = new Array();
			for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
			var bstr = arr.join("");
			var workbook = XLSX.read(bstr, { type: "binary" });
			var first_sheet_name = workbook.SheetNames[0];
			var worksheet = workbook.Sheets[first_sheet_name];
			var element = XLSX.utils.sheet_to_json(worksheet, { raw: true });
			this.data = element;
		}
		fileReader.readAsArrayBuffer(this.file);
	}

	public getValidator(): ValidationService {
		return this._validationService;
	}

	private initValidations(): void {
		var options = [
		];
		var validator = new ClientValidator({
			formRef: this.formRef,
			options: options,
		});
		this._validationService.init({ validator });

	}

	public isValid(): boolean {
		return this._validationService.isValid(true, false);
	}

	public callback(): Observable<any> {
		return of(this.data);
	}

	incomingfile(event) {
		this.file = event.target.files[0];
		this.Upload();
	}

	selectAction(input) {
		this.data = [];
		var data = input.target.value;
		this.ShowImport = data == 'Import Excel' ? true : false;
		if (data == 'Export Excel') {
			this.myInputVariable.nativeElement.value = '';
			this.data = 'exportExcel';
		} else if (data == 'Export Pdf') {
			this.myInputVariable.nativeElement.value = '';
			this.data = 'exportPdf';
		} else if (data == 'Download Template') {
			this.myInputVariable.nativeElement.value = '';
			this.data = 'template';
		}
	}
}
