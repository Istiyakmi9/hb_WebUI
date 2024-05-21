import { Component, OnInit } from '@angular/core';
import { ResponseModel } from 'src/auth/jwtService';
import { AjaxService, Filter } from 'src/providers/ajax.service';
import { CommonService } from 'src/providers/common.service';
import { ManageEmployee } from 'src/providers/constants';
import { iNavigation } from 'src/providers/iNavigation';
import { PaginationComponent } from '../../util/pagination/pagination.component';
import { PreLoadTableComponent } from '../../util/pre-load-table/pre-load-table.component';
import { BreadcrumsComponent } from '../../util/breadcrums/breadcrums.component';
import { RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.scss'],
    standalone: true,
    imports: [NgClass, FormsModule, RouterLinkActive, BreadcrumsComponent, PreLoadTableComponent, PaginationComponent]
})
export class EmployeeComponent implements OnInit {

  isLoading: boolean = false;
  isEmployeeFound: boolean = false;
  isActiveEmployee: number = 1;
  employees: Array<any> = [];
  employeeData: Filter = null;
  anyFilter: string = "";
  employeeDetails: employeeModel = null;
  orderByFirstNameAsc: boolean = null;
  orderByEmailAsc: boolean = null;
  orderByMobileAsc: boolean = null;
  orderByCityAsc: boolean = null;
  orderByCountryAsc: boolean = null;


  constructor(private http: AjaxService,
    private nav: iNavigation,
    private common: CommonService) { }

  ngOnInit(): void {
    this.employeeData = new Filter();
    this.employeeDetails = new employeeModel();
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
    this.isActiveEmployee = value;
  }

  loadData(){
    this.isLoading = true;
    this.isEmployeeFound = false;
    this.http.get("user/getAllUser").then((res:ResponseModel) => {
      if (res.ResponseBody) {
        this.employees = res.ResponseBody;
          this.employeeData.totalRecords = this.employees.length;
          this.isEmployeeFound = true;
          this.isLoading = false;
      }
    }).catch(e => {
      console.log(e.error);
    })
  }

  arrangeDetails(flag: any, FieldName: string) {
    let Order = '';
    if(flag || flag == null) {
      Order = 'Asc';
    } else {
      Order = 'Desc';
    }
    if (FieldName == 'firstName')
      this.orderByFirstNameAsc = !flag;
    if (FieldName == 'mobile')
      this.orderByMobileAsc = !flag;
    if (FieldName == 'email')
      this.orderByEmailAsc = !flag;
    if (FieldName == 'city')
      this.orderByCityAsc = !flag;
    if (FieldName == 'country')
      this.orderByCountryAsc = !flag;
    this.employeeData = new Filter();
    this.employeeData.sortBy = FieldName +" "+ Order;
    this.loadData()
  }

  EditCurrent(data: any){
    if(data !== null){
      console.warn('testa passing edit employee', ManageEmployee)
      console.warn('test passing edit  data', data)
      this.nav.navigate(ManageEmployee, data)
    }
  }

  GetFilterResult(e: Filter){
    if(e != null) {
      this.employeeData = e;
      this.loadData();
    }
  }

  filterRecords(){
    let searchQuery = "";
    let delimiter = "";
    this.employeeData.reset();

    if(this.employeeDetails.firstName !== null && this.employeeDetails.firstName !== "") {
        searchQuery += ` firstName like '${this.employeeDetails.firstName}%'`;
        delimiter = "and";
      }

    if(this.employeeDetails.email !== null && this.employeeDetails.email !== "") {
      searchQuery += ` ${delimiter} email like '%${this.employeeDetails.email}%' `;
        delimiter = "and";
    }
    if(this.employeeDetails.mobile !== null && this.employeeDetails.mobile !== "") {
      searchQuery += ` ${delimiter} mobile like '%${this.employeeDetails.mobile}%' `;
        delimiter = "and";
    }
    if(this.employeeDetails.city !== null && this.employeeDetails.city !== "") {
      searchQuery += ` ${delimiter} city = ${this.employeeDetails.city} `;
        delimiter = "and";
    }
    if(this.employeeDetails.country !== null && this.employeeDetails.country !== "") {
      searchQuery += ` ${delimiter} address like '${this.employeeDetails.country}%' `;
        delimiter = "and";
    }
    if(searchQuery !== "") {
      this.employeeData.searchString = `1=1 And ${searchQuery}`;
    }

    this.loadData();
  }

  globalFilter() {
    let searchQuery = "";
    this.employeeData.reset();
    searchQuery = ` firstName like '${this.anyFilter}%' OR email like '${this.anyFilter}%' OR mobile like '%${this.anyFilter}%' OR country like '${this.anyFilter}%'`;
    if(searchQuery !== "") {
      this.employeeData.searchString = `1=1 And ${searchQuery}`;
    }
    this.loadData()
  }

  resetFilter(){
    this.employeeData.searchString = "1=1";
    this.employeeData.pageIndex = 1;
    this.employeeData.pageSize = 10;
    this.employeeData.startIndex = 1;
    this.employeeData.endIndex = (this.employeeData.pageSize * this.employeeData.pageIndex);
    this.loadData();
    this.employeeDetails.firstName="";
    this.employeeDetails.email ="";
    this.employeeDetails.mobile ="";
    this.employeeDetails.city ="";
    this.employeeDetails.country= "";
    this.anyFilter = "";
  }

  navtoRegisterEmployee(){
    this.nav.navigate(ManageEmployee, null);
  }


}

export class employeeModel {
  firstName: string = null;
  email: string = null;
  mobile: string = null;
  city: string = null;
  country: string = null;
  total: number = 0;

}
