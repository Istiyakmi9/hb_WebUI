import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'src/providers/ajax.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { JwtService, ResponseModel } from 'src/auth/jwtService';

@Component({
    selector: 'app-resume-maker',
    templateUrl: './resume-maker.component.html',
    styleUrls: ['./resume-maker.component.scss'],
    standalone: true
})
export class ResumeMakerComponent implements OnInit {
  htmlContent = `<!DOCTYPE html>
  <html lang="en">

  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=210mm, height=297mm">
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
              <div style="display: flex; justify-content: space-between">
                  <div style="width: 25%; padding-top: 20px;">
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
          <div class="bottom-section">
              <table>
                  <tr>
                      <td style="vertical-align: top; width: 50%;">
                          <div>
                            <div class="division">
                                <h2>CONTACT DETAIL</h2>
                                <div class="box">
                                  <div class="inline">
                                  <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTE2IDY0QzE2IDI4LjcgNDQuNyAwIDgwIDBIMzA0YzM1LjMgMCA2NCAyOC43IDY0IDY0VjQ0OGMwIDM1LjMtMjguNyA2NC02NCA2NEg4MGMtMzUuMyAwLTY0LTI4LjctNjQtNjRWNjR6TTIyNCA0NDhhMzIgMzIgMCAxIDAgLTY0IDAgMzIgMzIgMCAxIDAgNjQgMHpNMzA0IDY0SDgwVjM4NEgzMDRWNjR6Ii8+PC9zdmc+" />
                                      <span class="text-space ans">
                                          +91-0000000000
                                      </span>
                                  </div>
                                </div>
                                <div class="box">
                                    <div class="inline">
                                    <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTY0IDExMmMtOC44IDAtMTYgNy4yLTE2IDE2djIyLjFMMjIwLjUgMjkxLjdjMjAuNyAxNyA1MC40IDE3IDcxLjEgMEw0NjQgMTUwLjFWMTI4YzAtOC44LTcuMi0xNi0xNi0xNkg2NHpNNDggMjEyLjJWMzg0YzAgOC44IDcuMiAxNiAxNiAxNkg0NDhjOC44IDAgMTYtNy4yIDE2LTE2VjIxMi4yTDMyMiAzMjguOGMtMzguNCAzMS41LTkzLjcgMzEuNS0xMzIgMEw0OCAyMTIuMnpNMCAxMjhDMCA5Mi43IDI4LjcgNjQgNjQgNjRINDQ4YzM1LjMgMCA2NCAyOC43IDY0IDY0VjM4NGMwIDM1LjMtMjguNyA2NC02NCA2NEg2NGMtMzUuMyAwLTY0LTI4LjctNjQtNjRWMTI4eiIvPjwvc3ZnPg==" />
                                        <span class="text-space ans">
                                            test@mail.com
                                        </span>
                                    </div>
                                </div>
                                <div class="box">
                                  <div class="inline">
                                    <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTMyMCA2NEE2NCA2NCAwIDEgMCAxOTIgNjRhNjQgNjQgMCAxIDAgMTI4IDB6bS05NiA5NmMtMzUuMyAwLTY0IDI4LjctNjQgNjR2NDhjMCAxNy43IDE0LjMgMzIgMzIgMzJoMS44bDExLjEgOTkuNWMxLjggMTYuMiAxNS41IDI4LjUgMzEuOCAyOC41aDM4LjdjMTYuMyAwIDMwLTEyLjMgMzEuOC0yOC41TDMxOC4yIDMwNEgzMjBjMTcuNyAwIDMyLTE0LjMgMzItMzJWMjI0YzAtMzUuMy0yOC43LTY0LTY0LTY0SDIyNHpNMTMyLjMgMzk0LjJjMTMtMi40IDIxLjctMTQuOSAxOS4zLTI3LjlzLTE0LjktMjEuNy0yNy45LTE5LjNjLTMyLjQgNS45LTYwLjkgMTQuMi04MiAyNC44Yy0xMC41IDUuMy0yMC4zIDExLjctMjcuOCAxOS42QzYuNCAzOTkuNSAwIDQxMC41IDAgNDI0YzAgMjEuNCAxNS41IDM2LjEgMjkuMSA0NWMxNC43IDkuNiAzNC4zIDE3LjMgNTYuNCAyMy40QzEzMC4yIDUwNC43IDE5MC40IDUxMiAyNTYgNTEyczEyNS44LTcuMyAxNzAuNC0xOS42YzIyLjEtNi4xIDQxLjgtMTMuOCA1Ni40LTIzLjRjMTMuNy04LjkgMjkuMS0yMy42IDI5LjEtNDVjMC0xMy41LTYuNC0yNC41LTE0LTMyLjZjLTcuNS03LjktMTcuMy0xNC4zLTI3LjgtMTkuNmMtMjEtMTAuNi00OS41LTE4LjktODItMjQuOGMtMTMtMi40LTI1LjUgNi4zLTI3LjkgMTkuM3M2LjMgMjUuNSAxOS4zIDI3LjljMzAuMiA1LjUgNTMuNyAxMi44IDY5IDIwLjVjMy4yIDEuNiA1LjggMy4xIDcuOSA0LjVjMy42IDIuNCAzLjYgNy4yIDAgOS42Yy04LjggNS43LTIzLjEgMTEuOC00MyAxNy4zQzM3NC4zIDQ1NyAzMTguNSA0NjQgMjU2IDQ2NHMtMTE4LjMtNy0xNTcuNy0xNy45Yy0xOS45LTUuNS0zNC4yLTExLjYtNDMtMTcuM2MtMy42LTIuNC0zLjYtNy4yIDAtOS42YzIuMS0xLjQgNC44LTIuOSA3LjktNC41YzE1LjMtNy43IDM4LjgtMTQuOSA2OS0yMC41eiIvPjwvc3ZnPg==" />
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
                                      <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTAgNjRDMCAyOC43IDI4LjcgMCA2NCAwSDM4NGMzNS4zIDAgNjQgMjguNyA2NCA2NFY0NDhjMCAzNS4zLTI4LjcgNjQtNjQgNjRINjRjLTM1LjMgMC02NC0yOC43LTY0LTY0VjY0ek0xODMgMjc4LjhjLTI3LjktMTMuMi00OC40LTM5LjQtNTMuNy03MC44aDM5LjFjMS42IDMwLjQgNy43IDUzLjggMTQuNiA3MC44em00MS4zIDkuMmwtLjMgMC0uMyAwYy0yLjQtMy41LTUuNy04LjktOS4xLTE2LjVjLTYtMTMuNi0xMi40LTM0LjMtMTQuMi02My41aDQ3LjFjLTEuOCAyOS4yLTguMSA0OS45LTE0LjIgNjMuNWMtMy40IDcuNi02LjcgMTMtOS4xIDE2LjV6bTQwLjctOS4yYzYuOC0xNy4xIDEyLjktNDAuNCAxNC42LTcwLjhoMzkuMWMtNS4zIDMxLjQtMjUuOCA1Ny42LTUzLjcgNzAuOHpNMjc5LjYgMTc2Yy0xLjYtMzAuNC03LjctNTMuOC0xNC42LTcwLjhjMjcuOSAxMy4yIDQ4LjQgMzkuNCA1My43IDcwLjhIMjc5LjZ6TTIyMy43IDk2bC4zIDAgLjMgMGMyLjQgMy41IDUuNyA4LjkgOS4xIDE2LjVjNiAxMy42IDEyLjQgMzQuMyAxNC4yIDYzLjVIMjAwLjVjMS44LTI5LjIgOC4xLTQ5LjkgMTQuMi02My41YzMuNC03LjYgNi43LTEzIDkuMS0xNi41ek0xODMgMTA1LjJjLTYuOCAxNy4xLTEyLjkgNDAuNC0xNC42IDcwLjhIMTI5LjNjNS4zLTMxLjQgMjUuOC01Ny42IDUzLjctNzAuOHpNMzUyIDE5MkExMjggMTI4IDAgMSAwIDk2IDE5MmExMjggMTI4IDAgMSAwIDI1NiAwek0xMTIgMzg0Yy04LjggMC0xNiA3LjItMTYgMTZzNy4yIDE2IDE2IDE2SDMzNmM4LjggMCAxNi03LjIgMTYtMTZzLTcuMi0xNi0xNi0xNkgxMTJ6Ii8+PC9zdmc+" />
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
                                      <img style="width: 13px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTIxNS43IDQ5OS4yQzI2NyA0MzUgMzg0IDI3OS40IDM4NCAxOTJDMzg0IDg2IDI5OCAwIDE5MiAwUzAgODYgMCAxOTJjMCA4Ny40IDExNyAyNDMgMTY4LjMgMzA3LjJjMTIuMyAxNS4zIDM1LjEgMTUuMyA0Ny40IDB6TTE5MiAxMjhhNjQgNjQgMCAxIDEgMCAxMjggNjQgNjQgMCAxIDEgMC0xMjh6Ii8+PC9zdmc+" />
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
                                      <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTEyOCAwYzEzLjMgMCAyNCAxMC43IDI0IDI0VjY0SDI5NlYyNGMwLTEzLjMgMTAuNy0yNCAyNC0yNHMyNCAxMC43IDI0IDI0VjY0aDQwYzM1LjMgMCA2NCAyOC43IDY0IDY0djE2IDQ4VjQ0OGMwIDM1LjMtMjguNyA2NC02NCA2NEg2NGMtMzUuMyAwLTY0LTI4LjctNjQtNjRWMTkyIDE0NCAxMjhDMCA5Mi43IDI4LjcgNjQgNjQgNjRoNDBWMjRjMC0xMy4zIDEwLjctMjQgMjQtMjR6TTQwMCAxOTJINDhWNDQ4YzAgOC44IDcuMiAxNiAxNiAxNkgzODRjOC44IDAgMTYtNy4yIDE2LTE2VjE5MnpNMzI5IDI5N0wyMTcgNDA5Yy05LjQgOS40LTI0LjYgOS40LTMzLjkgMGwtNjQtNjRjLTkuNC05LjQtOS40LTI0LjYgMC0zMy45czI0LjYtOS40IDMzLjkgMGw0NyA0NyA5NS05NWM5LjQtOS40IDI0LjYtOS40IDMzLjkgMHM5LjQgMjQuNiAwIDMzLjl6Ii8+PC9zdmc+" />
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
                                      <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTMyMCA2NEE2NCA2NCAwIDEgMCAxOTIgNjRhNjQgNjQgMCAxIDAgMTI4IDB6bS05NiA5NmMtMzUuMyAwLTY0IDI4LjctNjQgNjR2NDhjMCAxNy43IDE0LjMgMzIgMzIgMzJoMS44bDExLjEgOTkuNWMxLjggMTYuMiAxNS41IDI4LjUgMzEuOCAyOC41aDM4LjdjMTYuMyAwIDMwLTEyLjMgMzEuOC0yOC41TDMxOC4yIDMwNEgzMjBjMTcuNyAwIDMyLTE0LjMgMzItMzJWMjI0YzAtMzUuMy0yOC43LTY0LTY0LTY0SDIyNHpNMTMyLjMgMzk0LjJjMTMtMi40IDIxLjctMTQuOSAxOS4zLTI3LjlzLTE0LjktMjEuNy0yNy45LTE5LjNjLTMyLjQgNS45LTYwLjkgMTQuMi04MiAyNC44Yy0xMC41IDUuMy0yMC4zIDExLjctMjcuOCAxOS42QzYuNCAzOTkuNSAwIDQxMC41IDAgNDI0YzAgMjEuNCAxNS41IDM2LjEgMjkuMSA0NWMxNC43IDkuNiAzNC4zIDE3LjMgNTYuNCAyMy40QzEzMC4yIDUwNC43IDE5MC40IDUxMiAyNTYgNTEyczEyNS44LTcuMyAxNzAuNC0xOS42YzIyLjEtNi4xIDQxLjgtMTMuOCA1Ni40LTIzLjRjMTMuNy04LjkgMjkuMS0yMy42IDI5LjEtNDVjMC0xMy41LTYuNC0yNC41LTE0LTMyLjZjLTcuNS03LjktMTcuMy0xNC4zLTI3LjgtMTkuNmMtMjEtMTAuNi00OS41LTE4LjktODItMjQuOGMtMTMtMi40LTI1LjUgNi4zLTI3LjkgMTkuM3M2LjMgMjUuNSAxOS4zIDI3LjljMzAuMiA1LjUgNTMuNyAxMi44IDY5IDIwLjVjMy4yIDEuNiA1LjggMy4xIDcuOSA0LjVjMy42IDIuNCAzLjYgNy4yIDAgOS42Yy04LjggNS43LTIzLjEgMTEuOC00MyAxNy4zQzM3NC4zIDQ1NyAzMTguNSA0NjQgMjU2IDQ2NHMtMTE4LjMtNy0xNTcuNy0xNy45Yy0xOS45LTUuNS0zNC4yLTExLjYtNDMtMTcuM2MtMy42LTIuNC0zLjYtNy4yIDAtOS42YzIuMS0xLjQgNC44LTIuOSA3LjktNC41YzE1LjMtNy43IDM4LjgtMTQuOSA2OS0yMC41eiIvPjwvc3ZnPg==" />
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
                              <div style="margin: 1.4rem 0px; border: 2px solid lightblue; width: 92%;"></div>
                              <div class="social-media">
                                  <div class="box">
                                      <div class="inline">
                                      <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0ODggNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTQ4OCAyNjEuOEM0ODggNDAzLjMgMzkxLjEgNTA0IDI0OCA1MDQgMTEwLjggNTA0IDAgMzkzLjIgMCAyNTZTMTEwLjggOCAyNDggOGM2Ni44IDAgMTIzIDI0LjUgMTY2LjMgNjQuOWwtNjcuNSA2NC45QzI1OC41IDUyLjYgOTQuMyAxMTYuNiA5NC4zIDI1NmMwIDg2LjUgNjkuMSAxNTYuNiAxNTMuNyAxNTYuNiA5OC4yIDAgMTM1LTcwLjQgMTQwLjgtMTA2LjlIMjQ4di04NS4zaDIzNi4xYzIuMyAxMi43IDMuOSAyNC45IDMuOSA0MS40eiIvPjwvc3ZnPg==" />
                                          <span class="text-space ans">
                                              abc@gmail.com
                                          </span>
                                      </div>
                                  </div>
                                  <div class="box">
                                      <div class="inline">
                                      <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTEwMC4zIDQ0OEg3LjRWMTQ4LjloOTIuOXpNNTMuOCAxMDguMUMyNC4xIDEwOC4xIDAgODMuNSAwIDUzLjhhNTMuOCA1My44IDAgMCAxIDEwNy42IDBjMCAyOS43LTI0LjEgNTQuMy01My44IDU0LjN6TTQ0Ny45IDQ0OGgtOTIuN1YzMDIuNGMwLTM0LjctLjctNzkuMi00OC4zLTc5LjItNDguMyAwLTU1LjcgMzcuNy01NS43IDc2LjdWNDQ4aC05Mi44VjE0OC45aDg5LjF2NDAuOGgxLjNjMTIuNC0yMy41IDQyLjctNDguMyA4Ny45LTQ4LjMgOTQgMCAxMTEuMyA2MS45IDExMS4zIDE0Mi4zVjQ0OHoiLz48L3N2Zz4=" />
                                          <span class="text-space ans">
                                              NA
                                          </span>
                                      </div>
                                  </div>
                                  <div class="box">
                                      <div class="inline">
                                      <img style="width: 18px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTUxMiAyNTZDNTEyIDExNC42IDM5Ny40IDAgMjU2IDBTMCAxMTQuNiAwIDI1NkMwIDM3NiA4Mi43IDQ3Ni44IDE5NC4yIDUwNC41VjMzNC4ySDE0MS40VjI1Nmg1Mi44VjIyMi4zYzAtODcuMSAzOS40LTEyNy41IDEyNS0xMjcuNWMxNi4yIDAgNDQuMiAzLjIgNTUuNyA2LjRWMTcyYy02LS42LTE2LjUtMS0yOS42LTFjLTQyIDAtNTguMiAxNS45LTU4LjIgNTcuMlYyNTZoODMuNmwtMTQuNCA3OC4ySDI4N1Y1MTAuMUM0MTMuOCA0OTQuOCA1MTIgMzg2LjkgNTEyIDI1NmgweiIvPjwvc3ZnPg==" />
                                          <span class="text-space ans">
                                              NA
                                          </span>
                                      </div>
                                  </div>
                                  <div class="box">
                                      <div class="inline">
                                      <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTM4OS4yIDQ4aDcwLjZMMzA1LjYgMjI0LjIgNDg3IDQ2NEgzNDVMMjMzLjcgMzE4LjYgMTA2LjUgNDY0SDM1LjhMMjAwLjcgMjc1LjUgMjYuOCA0OEgxNzIuNEwyNzIuOSAxODAuOSAzODkuMiA0OHpNMzY0LjQgNDIxLjhoMzkuMUwxNTEuMSA4OGgtNDJMMzY0LjQgNDIxLjh6Ii8+PC9zdmc+" />
                                          <span class="text-space ans">
                                              NA
                                          </span>
                                      </div>
                                  </div>
                              </div>
                              <div style="margin: 1.4rem 0px; border: 2px solid lightblue; width: 92%;"></div>
                          </div>
                      </td>
                      <td tyle="vertical-align: top; width: 50%;">
                          <div >
                            <div class="division">
                                <h2>EDUCATION</h2>
                                <div class="box">
                                  <div class="inline">
                                  <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTMzNy44IDUuNEMzMjctMS44IDMxMy0xLjggMzAyLjIgNS40TDE2Ni4zIDk2SDQ4QzIxLjUgOTYgMCAxMTcuNSAwIDE0NFY0NjRjMCAyNi41IDIxLjUgNDggNDggNDhIMjU2VjQxNmMwLTM1LjMgMjguNy02NCA2NC02NHM2NCAyOC43IDY0IDY0djk2SDU5MmMyNi41IDAgNDgtMjEuNSA0OC00OFYxNDRjMC0yNi41LTIxLjUtNDgtNDgtNDhINDczLjdMMzM3LjggNS40ek05NiAxOTJoMzJjOC44IDAgMTYgNy4yIDE2IDE2djY0YzAgOC44LTcuMiAxNi0xNiAxNkg5NmMtOC44IDAtMTYtNy4yLTE2LTE2VjIwOGMwLTguOCA3LjItMTYgMTYtMTZ6bTQwMCAxNmMwLTguOCA3LjItMTYgMTYtMTZoMzJjOC44IDAgMTYgNy4yIDE2IDE2djY0YzAgOC44LTcuMiAxNi0xNiAxNkg1MTJjLTguOCAwLTE2LTcuMi0xNi0xNlYyMDh6TTk2IDMyMGgzMmM4LjggMCAxNiA3LjIgMTYgMTZ2NjRjMCA4LjgtNy4yIDE2LTE2IDE2SDk2Yy04LjggMC0xNi03LjItMTYtMTZWMzM2YzAtOC44IDcuMi0xNiAxNi0xNnptNDAwIDE2YzAtOC44IDcuMi0xNiAxNi0xNmgzMmM4LjggMCAxNiA3LjIgMTYgMTZ2NjRjMCA4LjgtNy4yIDE2LTE2IDE2SDUxMmMtOC44IDAtMTYtNy4yLTE2LTE2VjMzNnpNMjMyIDE3NmE4OCA4OCAwIDEgMSAxNzYgMCA4OCA4OCAwIDEgMSAtMTc2IDB6bTg4LTQ4Yy04LjggMC0xNiA3LjItMTYgMTZ2MzJjMCA4LjggNy4yIDE2IDE2IDE2aDMyYzguOCAwIDE2LTcuMiAxNi0xNnMtNy4yLTE2LTE2LTE2SDMzNlYxNDRjMC04LjgtNy4yLTE2LTE2LTE2eiIvPjwvc3ZnPg==" />
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
                                          <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTEyOCAwYzEzLjMgMCAyNCAxMC43IDI0IDI0VjY0SDI5NlYyNGMwLTEzLjMgMTAuNy0yNCAyNC0yNHMyNCAxMC43IDI0IDI0VjY0aDQwYzM1LjMgMCA2NCAyOC43IDY0IDY0djE2IDQ4VjQ0OGMwIDM1LjMtMjguNyA2NC02NCA2NEg2NGMtMzUuMyAwLTY0LTI4LjctNjQtNjRWMTkyIDE0NCAxMjhDMCA5Mi43IDI4LjcgNjQgNjQgNjRoNDBWMjRjMC0xMy4zIDEwLjctMjQgMjQtMjR6TTQwMCAxOTJINDhWNDQ4YzAgOC44IDcuMiAxNiAxNiAxNkgzODRjOC44IDAgMTYtNy4yIDE2LTE2VjE5MnptLTk1IDg5bC00NyA0NyA0NyA0N2M5LjQgOS40IDkuNCAyNC42IDAgMzMuOXMtMjQuNiA5LjQtMzMuOSAwbC00Ny00Ny00NyA0N2MtOS40IDkuNC0yNC42IDkuNC0zMy45IDBzLTkuNC0yNC42IDAtMzMuOWw0Ny00Ny00Ny00N2MtOS40LTkuNC05LjQtMjQuNiAwLTMzLjlzMjQuNi05LjQgMzMuOSAwbDQ3IDQ3IDQ3LTQ3YzkuNC05LjQgMjQuNi05LjQgMzMuOSAwczkuNCAyNC42IDAgMzMuOXoiLz48L3N2Zz4=" />
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
                                      <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTQ4IDI0QzQ4IDEwLjcgMzcuMyAwIDI0IDBTMCAxMC43IDAgMjRWNjQgMzUwLjUgNDAwdjg4YzAgMTMuMyAxMC43IDI0IDI0IDI0czI0LTEwLjcgMjQtMjRWMzg4bDgwLjMtMjAuMWM0MS4xLTEwLjMgODQuNi01LjUgMTIyLjUgMTMuNGM0NC4yIDIyLjEgOTUuNSAyNC44IDE0MS43IDcuNGwzNC43LTEzYzEyLjUtNC43IDIwLjgtMTYuNiAyMC44LTMwVjY2LjFjMC0yMy0yNC4yLTM4LTQ0LjgtMjcuN2wtOS42IDQuOGMtNDYuMyAyMy4yLTEwMC44IDIzLjItMTQ3LjEgMGMtMzUuMS0xNy42LTc1LjQtMjItMTEzLjUtMTIuNUw0OCA1MlYyNHptMCA3Ny41bDk2LjYtMjQuMmMyNy02LjcgNTUuNS0zLjYgODAuNCA4LjhjNTQuOSAyNy40IDExOC43IDI5LjcgMTc1IDYuOFYzMzQuN2wtMjQuNCA5LjFjLTMzLjcgMTIuNi03MS4yIDEwLjctMTAzLjQtNS40Yy00OC4yLTI0LjEtMTAzLjMtMzAuMS0xNTUuNi0xNy4xTDQ4IDMzOC41di0yMzd6Ii8+PC9zdmc+" />
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
                                              <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTIyNCAxMDkuM1YyMTcuNkwxODMuMyAyNDJjLTE0LjUgOC43LTIzLjMgMjQuMy0yMy4zIDQxLjJWNTEyaDk2VjQxNmMwLTM1LjMgMjguNy02NCA2NC02NHM2NCAyOC43IDY0IDY0djk2aDk2VjI4My4yYzAtMTYuOS04LjgtMzIuNS0yMy4zLTQxLjJMNDE2IDIxNy42VjEwOS4zYzAtOC41LTMuNC0xNi42LTkuNC0yMi42TDMzMS4zIDExLjNjLTYuMi02LjItMTYuNC02LjItMjIuNiAwTDIzMy40IDg2LjZjLTYgNi05LjQgMTQuMS05LjQgMjIuNnpNMjQuOSAzMzAuM0M5LjUgMzM4LjggMCAzNTQuOSAwIDM3Mi40VjQ2NGMwIDI2LjUgMjEuNSA0OCA0OCA0OGg4MFYyNzMuNkwyNC45IDMzMC4zek01OTIgNTEyYzI2LjUgMCA0OC0yMS41IDQ4LTQ4VjM3Mi40YzAtMTcuNS05LjUtMzMuNi0yNC45LTQyLjFMNTEyIDI3My42VjUxMmg4MHoiLz48L3N2Zz4=" />
                                              <span style="padding: 0px 10px 0px 5px">Religion</span>
                                              <img style="width: 18px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTE3NiAyODhhMTEyIDExMiAwIDEgMCAwLTIyNCAxMTIgMTEyIDAgMSAwIDAgMjI0ek0zNTIgMTc2YzAgODYuMy02Mi4xIDE1OC4xLTE0NCAxNzMuMVYzODRoMzJjMTcuNyAwIDMyIDE0LjMgMzIgMzJzLTE0LjMgMzItMzIgMzJIMjA4djMyYzAgMTcuNy0xNC4zIDMyLTMyIDMycy0zMi0xNC4zLTMyLTMyVjQ0OEgxMTJjLTE3LjcgMC0zMi0xNC4zLTMyLTMyczE0LjMtMzIgMzItMzJoMzJWMzQ5LjFDNjIuMSAzMzQuMSAwIDI2Mi4zIDAgMTc2QzAgNzguOCA3OC44IDAgMTc2IDBzMTc2IDc4LjggMTc2IDE3NnpNMjcxLjkgMzYwLjZjMTkuMy0xMC4xIDM2LjktMjMuMSA1Mi4xLTM4LjRjMjAgMTguNSA0Ni43IDI5LjggNzYuMSAyOS44YzYxLjkgMCAxMTItNTAuMSAxMTItMTEycy01MC4xLTExMi0xMTItMTEyYy03LjIgMC0xNC4zIC43LTIxLjEgMmMtNC45LTIxLjUtMTMtNDEuNy0yNC02MC4yQzM2OS4zIDY2IDM4NC40IDY0IDQwMCA2NGMzNyAwIDcxLjQgMTEuNCA5OS44IDMxbDIwLjYtMjAuNkw0ODcgNDFjLTYuOS02LjktOC45LTE3LjItNS4yLTI2LjJTNDk0LjMgMCA1MDQgMEg2MTZjMTMuMyAwIDI0IDEwLjcgMjQgMjRWMTM2YzAgOS43LTUuOCAxOC41LTE0LjggMjIuMnMtMTkuMyAxLjctMjYuMi01LjJsLTMzLjQtMzMuNEw1NDUgMTQwLjJjMTkuNSAyOC40IDMxIDYyLjcgMzEgOTkuOGMwIDk3LjItNzguOCAxNzYtMTc2IDE3NmMtNTAuNSAwLTk2LTIxLjMtMTI4LjEtNTUuNHoiLz48L3N2Zz4=" />
                                              <span style="padding: 0px 10px 0px 5px">Gender</span>
                                              <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTE5MC41IDY4LjhMMjI1LjMgMTI4SDIyNCAxNTJjLTIyLjEgMC00MC0xNy45LTQwLTQwczE3LjktNDAgNDAtNDBoMi4yYzE0LjkgMCAyOC44IDcuOSAzNi4zIDIwLjh6TTY0IDg4YzAgMTQuNCAzLjUgMjggOS42IDQwSDMyYy0xNy43IDAtMzIgMTQuMy0zMiAzMnY2NGMwIDE3LjcgMTQuMyAzMiAzMiAzMkg0ODBjMTcuNyAwIDMyLTE0LjMgMzItMzJWMTYwYzAtMTcuNy0xNC4zLTMyLTMyLTMySDQzOC40YzYuMS0xMiA5LjYtMjUuNiA5LjYtNDBjMC00OC42LTM5LjQtODgtODgtODhoLTIuMmMtMzEuOSAwLTYxLjUgMTYuOS03Ny43IDQ0LjRMMjU2IDg1LjVsLTI0LjEtNDFDMjE1LjcgMTYuOSAxODYuMSAwIDE1NC4yIDBIMTUyQzEwMy40IDAgNjQgMzkuNCA2NCA4OHptMzM2IDBjMCAyMi4xLTE3LjkgNDAtNDAgNDBIMjg4aC0xLjNsMzQuOC01OS4yQzMyOS4xIDU1LjkgMzQyLjkgNDggMzU3LjggNDhIMzYwYzIyLjEgMCA0MCAxNy45IDQwIDQwek0zMiAyODhWNDY0YzAgMjYuNSAyMS41IDQ4IDQ4IDQ4SDIyNFYyODhIMzJ6TTI4OCA1MTJINDMyYzI2LjUgMCA0OC0yMS41IDQ4LTQ4VjI4OEgyODhWNTEyeiIvPjwvc3ZnPg==" />
                                              <span style="padding: 0px 10px 0px 5px">Marital Status</span>
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
                                          <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTIyNCAwYTgwIDgwIDAgMSAxIDAgMTYwQTgwIDgwIDAgMSAxIDIyNCAwek00MzYuOCAzODIuOEwzNzMuNSA0NjJjLTE2LjYgMjAuNy00Ni44IDI0LjEtNjcuNSA3LjVjLTE3LjYtMTQuMS0yMi43LTM4LjEtMTMuNS01Ny43bC0uOC0uMWMtMzguOS01LjYtNzQuMy0yNS4xLTk5LjctNTQuOFYzMjBjMC0xNy43LTE0LjMtMzItMzItMzJzLTMyIDE0LjMtMzIgMzJ2NDhjMCAuOCAwIDEuNiAuMSAyLjRsMTAxLjQgNTAuN2MyMy43IDExLjkgMzMuMyA0MC43IDIxLjUgNjQuNHMtNDAuNyAzMy4zLTY0LjQgMjEuNUwyNy4yIDQyNy4zYy0xLjEtLjUtMi4yLTEuMS0zLjMtMS43Yy00LjktMi44LTkuMi02LjQtMTIuNi0xMC42Yy00LjYtNS40LTcuOC0xMS43LTkuNi0xOC40Yy0zLjMtMTItMS45LTI1LjIgNC44LTM2LjZjLjYtMS4xIDEuMy0yLjIgMi0zLjJMNzUuNiAyNTYuMWMyNi43LTQwLjEgNzEuNy02NC4xIDExOS44LTY0LjFoNzUuMmM0Ni41IDAgOTAuMSAyMi41IDExNy4yIDYwLjNsNTAuNyA3MC45YzIuMiAzIDQgNi4xIDUuNSA5LjRjMi45IDYuNyA0LjMgMTMuOCA0IDIwLjhjLS4zIDEwLjYtNC4yIDIxLTExLjIgMjkuNHpNMzIwIDMzMmE0NCA0NCAwIDEgMCAtODggMCA0NCA0NCAwIDEgMCA4OCAweiIvPjwvc3ZnPg==" />
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
                                          <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMjAgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTExMiA0OGE0OCA0OCAwIDEgMSA5NiAwIDQ4IDQ4IDAgMSAxIC05NiAwem00MCAzMDRWNDgwYzAgMTcuNy0xNC4zIDMyLTMyIDMycy0zMi0xNC4zLTMyLTMyVjI1Ni45TDU5LjQgMzA0LjVjLTkuMSAxNS4xLTI4LjggMjAtNDMuOSAxMC45cy0yMC0yOC44LTEwLjktNDMuOWw1OC4zLTk3YzE3LjQtMjguOSA0OC42LTQ2LjYgODIuMy00Ni42aDI5LjdjMzMuNyAwIDY0LjkgMTcuNyA4Mi4zIDQ2LjZsNTguMyA5N2M5LjEgMTUuMSA0LjIgMzQuOC0xMC45IDQzLjlzLTM0LjggNC4yLTQzLjktMTAuOUwyMzIgMjU2LjlWNDgwYzAgMTcuNy0xNC4zIDMyLTMyIDMycy0zMi0xNC4zLTMyLTMyVjM1MkgxNTJ6Ii8+PC9zdmc+" />
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
                                          <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTAgMTI4QzAgOTIuNyAyOC43IDY0IDY0IDY0SDI1Nmg0OCAxNkg1NzZjMzUuMyAwIDY0IDI4LjcgNjQgNjRWMzg0YzAgMzUuMy0yOC43IDY0LTY0IDY0SDMyMCAzMDQgMjU2IDY0Yy0zNS4zIDAtNjQtMjguNy02NC02NFYxMjh6bTMyMCAwVjM4NEg1NzZWMTI4SDMyMHpNMTc4LjMgMTc1LjljLTMuMi03LjItMTAuNC0xMS45LTE4LjMtMTEuOXMtMTUuMSA0LjctMTguMyAxMS45bC02NCAxNDRjLTQuNSAxMC4xIC4xIDIxLjkgMTAuMiAyNi40czIxLjktLjEgMjYuNC0xMC4ybDguOS0yMC4xaDczLjZsOC45IDIwLjFjNC41IDEwLjEgMTYuMyAxNC42IDI2LjQgMTAuMnMxNC42LTE2LjMgMTAuMi0yNi40bC02NC0xNDR6TTE2MCAyMzMuMkwxNzkgMjc2SDE0MWwxOS00Mi44ek00NDggMTY0YzExIDAgMjAgOSAyMCAyMHY0aDQ0IDE2YzExIDAgMjAgOSAyMCAyMHMtOSAyMC0yMCAyMGgtMmwtMS42IDQuNWMtOC45IDI0LjQtMjIuNCA0Ni42LTM5LjYgNjUuNGMuOSAuNiAxLjggMS4xIDIuNyAxLjZsMTguOSAxMS4zYzkuNSA1LjcgMTIuNSAxOCA2LjkgMjcuNHMtMTggMTIuNS0yNy40IDYuOWwtMTguOS0xMS4zYy00LjUtMi43LTguOC01LjUtMTMuMS04LjVjLTEwLjYgNy41LTIxLjkgMTQtMzQgMTkuNGwtMy42IDEuNmMtMTAuMSA0LjUtMjEuOS0uMS0yNi40LTEwLjJzLjEtMjEuOSAxMC4yLTI2LjRsMy42LTEuNmM2LjQtMi45IDEyLjYtNi4xIDE4LjUtOS44bC0xMi4yLTEyLjJjLTcuOC03LjgtNy44LTIwLjUgMC0yOC4zczIwLjUtNy44IDI4LjMgMGwxNC42IDE0LjYgLjUgLjVjMTIuNC0xMy4xIDIyLjUtMjguMyAyOS44LTQ1SDQ0OCAzNzZjLTExIDAtMjAtOS0yMC0yMHM5LTIwIDIwLTIwaDUydi00YzAtMTEgOS0yMCAyMC0yMHoiLz48L3N2Zz4=" />
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
                                          <img style="width: 15px; height: 18px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTE1Mi4xIDM4LjJjOS45IDguOSAxMC43IDI0IDEuOCAzMy45bC03MiA4MGMtNC40IDQuOS0xMC42IDcuOC0xNy4yIDcuOXMtMTIuOS0yLjQtMTcuNi03TDcgMTEzQy0yLjMgMTAzLjYtMi4zIDg4LjQgNyA3OXMyNC42LTkuNCAzMy45IDBsMjIuMSAyMi4xIDU1LjEtNjEuMmM4LjktOS45IDI0LTEwLjcgMzMuOS0xLjh6bTAgMTYwYzkuOSA4LjkgMTAuNyAyNCAxLjggMzMuOWwtNzIgODBjLTQuNCA0LjktMTAuNiA3LjgtMTcuMiA3LjlzLTEyLjktMi40LTE3LjYtN0w3IDI3M2MtOS40LTkuNC05LjQtMjQuNiAwLTMzLjlzMjQuNi05LjQgMzMuOSAwbDIyLjEgMjIuMSA1NS4xLTYxLjJjOC45LTkuOSAyNC0xMC43IDMzLjktMS44ek0yMjQgOTZjMC0xNy43IDE0LjMtMzIgMzItMzJINDgwYzE3LjcgMCAzMiAxNC4zIDMyIDMycy0xNC4zIDMyLTMyIDMySDI1NmMtMTcuNyAwLTMyLTE0LjMtMzItMzJ6bTAgMTYwYzAtMTcuNyAxNC4zLTMyIDMyLTMySDQ4MGMxNy43IDAgMzIgMTQuMyAzMiAzMnMtMTQuMyAzMi0zMiAzMkgyNTZjLTE3LjcgMC0zMi0xNC4zLTMyLTMyek0xNjAgNDE2YzAtMTcuNyAxNC4zLTMyIDMyLTMySDQ4MGMxNy43IDAgMzIgMTQuMyAzMiAzMnMtMTQuMyAzMi0zMiAzMkgxOTJjLTE3LjcgMC0zMi0xNC4zLTMyLTMyek00OCAzNjhhNDggNDggMCAxIDEgMCA5NiA0OCA0OCAwIDEgMSAwLTk2eiIvPjwvc3ZnPg==" />
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
                      </td>
                  </tr>
              </table>
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
    this.getResumeDetails();
  }

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private tokenHelper: JwtService,
    private ajax: AjaxService
  ) { }

    getResumeDetails(){
        this.ajax.get(`resume/getResumeDetail/3`).then((res:ResponseModel)=>{
            if(res.ResponseBody){
                this.htmlContent = res.ResponseBody.ResumeDetail;
                this.bindData();
            }
        }).catch( e=> {
            console.log(e);
        })
    }

  downloadNewPdf() {
    const apiUrl = 'http://localhost:5101/api/Converter/HtmlToPdfConverter';
    let iframe: any = document.getElementById("resume-container");
    let data = {
      content: this.htmlContent
    };
    this.http.post(apiUrl, data, {
      responseType: 'blob', // Important: specify blob response type
      observe: 'response' // Important: observe the full response to access headers
    }).subscribe({
      next: (response: any) => {
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
      },
      error: error => console.log(error)
    })

  }

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



    // this.http.post("http://localhost:5003/api/FileGenerator/HtmlToPdf", data).subscribe((res: any) => {
    //   if (res.ResponseBody) {
    //     console.log(res.ResponseBody);
    //   }
    // }, (error) => {
    //   console.log(error);
    // })
  }
}
