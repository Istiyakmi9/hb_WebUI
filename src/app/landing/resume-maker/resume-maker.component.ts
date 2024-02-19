import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'src/providers/ajax.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { JwtService } from 'src/auth/jwtService';

@Component({
  selector: 'app-resume-maker',
  templateUrl: './resume-maker.component.html',
  styleUrls: ['./resume-maker.component.scss']
})
export class ResumeMakerComponent implements OnInit {
  htmlContent = `<!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            .row {
                border: 1px solid #d9d9d9;
                background: white;
            }

            .top-section {
                min-height: 19.4rem;
                color: white;
                background: rgb(32, 32, 92);
                padding: 15px 30px;
            }

            .bottom-section {
                min-height: 4rem;
                padding: 15px 30px;
                margin-top: 3rem;
            }

            .dflex {
                display: flex;
            }

            .border-1 {
                border: 1px solid #d9d9d9;
            }

            .img-tag {
                position: absolute;
                width: 100%;
                top: 10px;
                background: yellowgreen;
            }

            .inline {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: start;
            }

            .box {
                padding: 6px 0px;
            }

            .ans {
                font-weight: 400 !important;
            }

            .text-space {
                padding: 0px 10px;
                font-weight: 500;
            }

            .icon-box {
                width: 20px;
            }

            .division {
                padding-bottom: 2rem;
            }
        </style>
    </head>

    <body>
        <div class="row">
            <div class="top-section">
                <div>
                    <h1>EMPLOYEE NAME</h1>
                    <h4>Jan 24, 1991</h4>
                </div>
                <div class="dflex" style="display: flex;">
                    <div style="width: 70%; padding-top: 20px;">
                        <span style="color: #eee;">ABOUT ME:</span>
                        <div style="color: #eee; padding-top: 12px;">
                            With hands-on experience in mechanical assistance gained in India,
                            I bring a proven track record of adeptness in troubleshooting and
                            supporting industrial machinery,
                            ensuring optimal operational performance.
                        </div>
                    </div>
                    <div style="width: 30%; position: relative;">
                        <div class="border-1 img-tag" style="position: absolute; right: 0px;height: 14rem;">
                            Image
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom-section" style="display: flex;">
                <div style="width: 50%; padding-right: 38px;">
                    <div class="division">
                        <h2>CONTACT DETAIL</h2>
                        <div class="box">
                            <div class="inline">
                                <i class="fa-solid fa-mobile-screen-button"></i>
                                <span class="text-space ans">
                                    +91-0000000000
                                </span>
                            </div>
                        </div>
                        <div class="box">
                            <div class="inline">
                                <i class="fa-regular fa-envelope"></i>
                                <span class="text-space ans">
                                    test@mail.com
                                </span>
                            </div>
                        </div>
                        <div class="box">
                            <div class="inline">
                                <i class="fa-solid fa-street-view"></i>
                                <span class="text-space ans">
                                    123 Main Street, City, State, insert your address here
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <h2>PASSPORT DETAIL</h2>
                        <div class="box">
                            <div class="inline">
                                <i class="icon-box fa-solid fa-passport"></i>
                                <span class="text-space">
                                    Passport Num#
                                </span>
                            </div>
                            <div class="dflex">
                                <div class="icon-box"></div>
                                <span class="text-space ans">
                                    W 1595687
                                </span>
                            </div>
                        </div>
                        <div class="box">
                            <div class="inline">
                                <i class="icon-box fa-solid fa-location-dot"></i>
                                <span class="text-space">
                                    Place
                                </span>
                            </div>
                            <div class="dflex">
                                <div class="icon-box"></div>
                                <span class="text-space ans">
                                    Kolkata
                                </span>
                            </div>
                        </div>
                        <div class="box">
                            <div class="inline">
                                <i class="icon-box fa-regular fa-calendar-check"></i>
                                <span class="text-space">
                                    Date of issued
                                </span>
                            </div>
                            <div class="dflex">
                                <div class="icon-box"></div>
                                <span class="text-space ans">
                                    22nd Aug, 2022
                                </span>
                            </div>
                        </div>
                        <div class="box">
                            <div class="inline">
                                <i class="icon-box fa-regular fa-calendar-xmark"></i>
                                <span class="text-space">
                                    Date of expiring
                                </span>
                            </div>
                            <div class="dflex">
                                <div class="icon-box"></div>
                                <span class="text-space ans">
                                    21st Aug, 2032
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style="margin: 1.4rem 0px; border: 2px solid lightblue; width: 100%;"></div>
                    <div class="social-media">
                        <div class="box">
                            <div class="inline">
                                <i class="fa-brands fa-google"></i>
                                <span class="text-space ans">
                                    abc@gmail.com
                                </span>
                            </div>
                        </div>
                        <div class="box">
                            <div class="inline">
                                <i class="fa-brands fa-linkedin-in"></i>
                                <span class="text-space ans">
                                    NA
                                </span>
                            </div>
                        </div>
                        <div class="box">
                            <div class="inline">
                                <i class="fa-brands fa-facebook-f"></i>
                                <span class="text-space ans">
                                    NA
                                </span>
                            </div>
                        </div>
                        <div class="box">
                            <div class="inline">
                                <i class="fa-brands fa-twitter"></i>
                                <span class="text-space ans">
                                    NA
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style="margin: 1.4rem 0px; border: 2px solid lightblue; width: 100%;"></div>
                </div>
                <div style="width: 50%">
                    <div class="division">
                        <h2>EDUCATION</h2>
                        <div class="box">
                            <div class="inline">
                                <i class="fa-solid fa-school"></i>
                                <span class="text-space">
                                    Highest Education Qualification
                                </span>
                            </div>
                            <div class="dflex">
                                <div class="icon-box"></div>
                                <span class="text-space ans">
                                    Successfully completed 8th standard from India
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="division">
                        <h2>PERSONAL INFO</h2>
                        <div class="box">
                            <div class="inline">
                                <img style="width: 18px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTEyOCAwYzEzLjMgMCAyNCAxMC43IDI0IDI0VjY0SDI5NlYyNGMwLTEzLjMgMTAuNy0yNCAyNC0yNHMyNCAxMC43IDI0IDI0VjY0aDQwYzM1LjMgMCA2NCAyOC43IDY0IDY0djE2IDQ4VjQ0OGMwIDM1LjMtMjguNyA2NC02NCA2NEg2NGMtMzUuMyAwLTY0LTI4LjctNjQtNjRWMTkyIDE0NCAxMjhDMCA5Mi43IDI4LjcgNjQgNjQgNjRoNDBWMjRjMC0xMy4zIDEwLjctMjQgMjQtMjR6TTQwMCAxOTJINDhWNDQ4YzAgOC44IDcuMiAxNiAxNiAxNkgzODRjOC44IDAgMTYtNy4yIDE2LTE2VjE5MnptLTk1IDg5bC00NyA0NyA0NyA0N2M5LjQgOS40IDkuNCAyNC42IDAgMzMuOXMtMjQuNiA5LjQtMzMuOSAwbC00Ny00Ny00NyA0N2MtOS40IDkuNC0yNC42IDkuNC0zMy45IDBzLTkuNC0yNC42IDAtMzMuOWw0Ny00Ny00Ny00N2MtOS40LTkuNC05LjQtMjQuNiAwLTMzLjlzMjQuNi05LjQgMzMuOSAwbDQ3IDQ3IDQ3LTQ3YzkuNC05LjQgMjQuNi05LjQgMzMuOSAwczkuNCAyNC42IDAgMzMuOXoiLz48L3N2Zz4=" />
                                <span class="text-space">
                                    Date of Birth & Place
                                </span>
                            </div>
                            <div class="dflex">
                                <div class="icon-box"></div>
                                <span class="text-space ans">10th March, 1982 | Asansol</span>
                            </div>
                        </div>
                        <div class="box">
                            <div class="inline">
                                <i class="icon-box fa-brands fa-font-awesome"></i>
                                <span class="text-space">
                                    Nationality
                                </span>
                            </div>
                            <div class="dflex">
                                <div class="icon-box"></div>
                                <span class="text-space ans">Indian</span>
                            </div>
                        </div>
                        <div class="box">
                            <div class="inline">
                                <div>
                                    <i class="icon-box fa-solid fa-place-of-worship"></i>
                                    <span class="text-space">Religion</span>
                                    <i class="icon-box fa-solid fa-venus-mars"></i>
                                    <span class="text-space">Gender</span>
                                    <i class="icon-box fa-solid fa-gift"></i>
                                    <span class="text-space">Marital Status</span>
                                </div>
                            </div>
                            <div class="dflex">
                                <div class="icon-box"></div>
                                <span class="text-space ans">
                                    Muslim | Male | Married
                                </span>
                            </div>
                        </div>
                        <div class="box">
                            <div class="inline">
                                <i class="icon-box fa-solid fa-person-breastfeeding"></i>
                                <span class="text-space">
                                    Mother's Name
                                </span>
                            </div>
                            <div class="dflex">
                                <div class="icon-box"></div>
                                <span class="text-space ans">
                                    Saira Bano
                                </span>
                            </div>
                        </div>
                        <div class="box">
                            <div class="inline">
                                <i class="icon-box fa-solid fa-person"></i>
                                <span class="text-space">
                                    Father's Name
                                </span>
                            </div>
                            <div class="dflex">
                                <div class="icon-box"></div>
                                <span class="text-space ans">
                                    Md Arsalan
                                </span>
                            </div>
                        </div>
                        <div class="box">
                            <div class="inline">
                                <i class="icon-box fa-solid fa-language"></i>
                                <span class="text-space">
                                    Languages
                                </span>
                            </div>
                            <div class="dflex">
                                <div class="icon-box"></div>
                                <span class="text-space ans">
                                    Hindi | English | Urdu
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="division">
                        <h2>WORK EXPERIENCE</h2>
                        <div class="box">
                            <div class="inline">
                                <i class="fa-solid fa-list-check"></i>
                                <span class="text-space">
                                    MECHANICAL HELPER
                                </span>
                            </div>
                            <div class="dflex">
                                <div class="icon-box"></div>
                                <span class="text-space ans">
                                    Worked as a “MECHANICAL HELPER” in Service from 06 Years in India.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom-section" style="margin-top: 0px; padding-top: 0px;">
                <h2>ARCHIEVEMENTS</h2>
                <p>
                    Consistently exceeding performance targets,
                    I've demonstrated exceptional work ethic and reliability in delivering
                    high-quality results.
                    I've contributed to successful project completion,
                    earning recognition for my dedication. Committed to continuous improvement,
                    I'm poised to excel further in the dynamic blue-collar industry.
                </p>

                <h2 style="margin-top: 2rem;">DECLARATION</h2>
                <p>
                    I hereby declare that the above information is true to the
                    best of my knowledge and belief and further I assure you that I will not
                    leave any stone unturned regarding my working calibre and efficiency.
                </p>
            </div>
        </div>
    </body>

    </html>`;

  trustedHtmlString: SafeHtml;
  isContentReady: boolean = false;

  bindData() {
    this.trustedHtmlString = this.sanitizer.bypassSecurityTrustHtml(this.htmlContent);
    this.isContentReady = true;
  }

  ngOnInit() {
    this.isContentReady = false;
    this.bindData();
  }

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private tokenHelper: JwtService
  ) { }

  downloadPdf() {
    let iframe: any = document.getElementById("resume-container");
    let data = {
      content: this.htmlContent
    };

    const apiUrl = 'https://www.bottomhalf.in/api/generate/FileGenerator/generate_pdf';
    const requestBody = data; // Replace 'data' with your actual content

    // Set headers if needed (such as content-type)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/pdf',
      "Authorization": `Bearer ${this.tokenHelper.getGoogleJwtToken()}`
    });

    // Make HTTP POST request to the API URL
    this.http.post(apiUrl, requestBody, {
      responseType: 'blob', // Important: specify blob response type
      headers: headers,
      observe: 'response' // Important: observe the full response to access headers
    }).subscribe(response => {
      // Extract filename from content-disposition header
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const filenameMatches = filenameRegex.exec(response.headers.get('content-disposition'));
      const filename = filenameMatches && filenameMatches[1] ? filenameMatches[1].replace(/['"]/g, '') : 'download.pdf';

      // Create Blob object from response body
      const blob = new Blob([response.body], { type: 'application/pdf' });

      // Create URL for the Blob object
      const url = window.URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      // Append the link to the body
      document.body.appendChild(link);

      // Trigger the click event on the link to start the download
      link.click();

      // Cleanup: remove the link and revoke the Blob URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  }
}
