import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ResponseModel } from 'src/auth/jwtService';
import { AjaxService } from 'src/providers/ajax.service';

@Component({
    selector: 'app-resume',
    templateUrl: './resume.component.html',
    styleUrls: ['./resume.component.scss'],
    standalone: true
})
export class ResumeComponent {
  selectedTemplate: any = "aa";
  templateId: number = 2;

  constructor(private http: AjaxService,
              private client: HttpClient) {}

  downloadResume() {
    let data = document.getElementById("htmltemplate").innerHTML;
    data = data.replaceAll(/"/g, "'");
    this.generateResum(data);
  }

  generateResum(data: string) {
    let value = {
      Content: data
    }
    let url ="https://www.emstum.com/bot/dn/gen/api/FileGenerator/generate_pdf";
    this.client.post("http://localhost:5003/api/FileGenerator/generate_pdf", value, {observe: 'response', responseType: 'blob'}).subscribe((res : any)=> {
      let blob: Blob = res.body as Blob;
      let URL = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.download = "resume";
      a.href = URL;
      a.click();
    })
  }

  downloadPdf(data: string) {
    let value = {
      Content: data
    }
    let newUrl = "http://localhost:5003/api/FileGenerator/generate_pdf";
    this.http.post("resume/generateResume", value).then((res: ResponseModel) => {
      if (res.ResponseBody) {
        const blob = new Blob([res.ResponseBody], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'downloaded-pdf.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      }
    }).catch(e => {
      console.log(e);
    })
  }
}
