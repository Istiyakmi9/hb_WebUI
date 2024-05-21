import { Component, OnInit } from '@angular/core';
import { Filter, AjaxService } from 'src/providers/ajax.service';
import { ErrorToast, Toast } from 'src/providers/common.service';
import { ManageClient } from 'src/providers/constants';
import { iNavigation } from 'src/providers/iNavigation';
import { PaginationComponent } from '../../util/pagination/pagination.component';
import { PreLoadTableComponent } from '../../util/pre-load-table/pre-load-table.component';
import { BreadcrumsComponent } from '../../util/breadcrums/breadcrums.component';
import { RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss'],
    standalone: true,
    imports: [NgClass, FormsModule, RouterLinkActive, BreadcrumsComponent, PreLoadTableComponent, PaginationComponent]
})
export class ClientComponent implements OnInit {
  isLoading: boolean = false;
  clients: Array<any> = [];
  activePage:number = 0;
  clientsData: Filter = null;
  isClientFound: boolean = false;
  clientDetails: any = null;
  anyFilter: string = "";
  singleClient: any = null;
  isActiveClient: number = 1;
  orderByNameAsc: boolean = null;
  orderByMobileAsc: boolean = null;
  orderByEmailAsc: boolean = null;
  orderByClientTypeAsc: boolean = null;
  orderByAddressAsc: boolean = null;

  displayActivePage(activePageNumber:number){
    this.activePage = activePageNumber
  }

  constructor(private http: AjaxService,
              private nav: iNavigation) { }

  ngOnInit(): void {
    this.clientsData = new Filter();
    this.clientDetails = new clientModel();
    this.loadData();
  }

  SwitchTab(e: any, value: number) {
    let elem: any = document.getElementById("client-tab").querySelectorAll('a')
    let i = 0;
    while(i < elem.length) {
      elem[i].classList.remove('tab-active');
      i++;
    }
    e.target.classList.add('tab-active');
    this.isActiveClient = value;
  }

  loadData() {
    this.isLoading = true;
    this.isClientFound = false;
    this.http.post("client/getAllClient", this.clientsData).then(res => {
      if (res.ResponseBody) {
        this.clients = res.ResponseBody;
        if (this.clients && this.clients.length > 0)
          this.clientsData.totalRecords = this.clients[0].Total;
        else
          this.clientsData.totalRecords = 0;

        Toast("Record found");
        this.isLoading = false;
        this.isClientFound = true;
      }
    }).catch(e => {
      this.isLoading = false;
      ErrorToast("Fail to get cients");
    })
  }

  arrangeDetails(flag: any, FieldName: string) {
    let Order = '';
    if(flag || flag == null) {
      Order = 'Asc';
    } else {
      Order = 'Desc';
    }
    if (FieldName == 'CompanyName')
      this.orderByNameAsc = !flag;
    if (FieldName == 'Mobile')
      this.orderByMobileAsc = !flag;
    if (FieldName == 'Email')
      this.orderByEmailAsc = !flag;
    if (FieldName == 'ClientTypeId')
      this.orderByClientTypeAsc = !flag;
    if (FieldName == 'Address')
      this.orderByAddressAsc = !flag;

    this.clientsData = new Filter();
    this.clientsData.sortBy = FieldName +" "+ Order;
    this.loadData()
  }

  EditCurrent(data: any) {
    if (data !== null) {
      this.nav.navigate(ManageClient, data);
    }
  }

  GetFilterResult(e: Filter) {
    if(e != null) {
      this.clientsData = e;
      this.loadData();
    }
  }

  filterRecords() {
    let searchQuery = "";
    let delimiter = "";
    this.clientsData.reset();

    if(this.clientDetails.CompanyName !== null && this.clientDetails.CompanyName !== "") {
        searchQuery += ` CompanyName like '${this.clientDetails.CompanyName}%'`;
        delimiter = "and";
      }

    if(this.clientDetails.Email !== null && this.clientDetails.Email !== "") {
      searchQuery += ` ${delimiter} Email like '%${this.clientDetails.Email}%' `;
        delimiter = "and";
    }
    if(this.clientDetails.Mobile !== null && this.clientDetails.Mobile !== 0) {
      searchQuery += ` ${delimiter} Mobile like '%${this.clientDetails.Mobile}%' `;
        delimiter = "and";
    }
    if(this.clientDetails.ClientTypeId !== null && this.clientDetails.ClientTypeId !== 0) {
      searchQuery += ` ${delimiter} ClientTypeId = ${this.clientDetails.ClientTypeId} `;
        delimiter = "and";
    }
    if(this.clientDetails.Address !== null && this.clientDetails.Address !== "") {
      searchQuery += ` ${delimiter} Address like '${this.clientDetails.Address}%' `;
        delimiter = "and";
    }
    if(searchQuery !== "") {
      this.clientsData.searchString = `1=1 And ${searchQuery}`;
    }

    this.loadData();
  }

  globalFilter() {
    let searchQuery = "";
    this.clientsData.reset();
    searchQuery = ` CompanyName like '${this.anyFilter}%' OR Email like '${this.anyFilter}%' OR Mobile like '%${this.anyFilter}%' OR ClientTypeId like '${this.anyFilter}%'`;
    if(searchQuery !== "") {
      this.clientsData.searchString = `1=1 And ${searchQuery}`;
    }
    this.loadData();
  }


  resetFilter() {
    this.clientsData.searchString = "1=1";
    this.clientsData.pageIndex = 1;
    this.clientsData.pageSize = 10;
    this.clientsData.startIndex = 1;
    this.clientsData.endIndex = (this.clientsData.pageSize * this.clientsData.pageIndex);
    this.loadData();
    this.clientDetails.CompanyName="";
    this.clientDetails.Mobile = null;
    this.clientDetails.Email="";
    this.clientDetails.Address="";
    this.clientDetails.ClientTypeId=0;
    this.anyFilter = "";
  }

  navtoRegisterClient() {
    this.nav.navigate(ManageClient, null);
  }
}

class clientModel {
  companyName: string = '';
  clientTypeId: number = 0;
  mobile: number = null;
  email: string = '';
  address: string = '';
  total: number = 0;
}
