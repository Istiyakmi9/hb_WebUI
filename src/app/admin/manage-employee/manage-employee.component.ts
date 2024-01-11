import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ResponseModel } from 'src/auth/jwtService';
import { AjaxService } from 'src/providers/ajax.service';
import { Toast } from 'src/providers/common.service';
import { Employee } from 'src/providers/constants';
import { iNavigation } from 'src/providers/iNavigation';
declare var $: any;

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.scss']
})
export class ManageEmployeeComponent implements OnInit {

  isReady: boolean = false;
  employeeForm: FormGroup;
  employeeDetail: EmployeeDetail = new EmployeeDetail();
  employeeId: number = 0;
  lastWorkingDatemodel: NgbDateStruct;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder,
              private http: AjaxService,
              private nav: iNavigation){}

  ngOnInit(): void {
    let data = this.nav.getValue();
    if (data){
      this.employeeId = data.employeeId;
      this.loadData();
    } else{
      this.initForm();
      this.isReady = true;
    }

  }

  loadData(){
    this.http.get(`employee/getEmployeeByEmployeeId/${this.employeeId}`).then((res:ResponseModel)=>{
      if(res.ResponseBody){
        this.employeeDetail = res.ResponseBody;
        this.initForm();
        this.isReady = true;
      }
    })
  }

  addEmployee(){
    this.isLoading = true;
    let value = this.employeeForm.value;
    this.http.post("employee/addEmployee", value).then((res:ResponseModel) => {
      if(res.ResponseBody){
        Toast("Employee Inserted successfully");
        $('#messageModalEmployee').modal('show');
        this.isLoading = false;
      }
    }).catch(e => {
      alert(e.message)
      this.isLoading = false;
    })
  }

  updateEmployee(){
    this.isLoading = true;
    let value = this.employeeForm.value;
    this.http.put(`employee/updateEmployee/${this.employeeDetail.EmployeeId}`,value).then((res:ResponseModel) => {
      if(res.ResponseBody){
        Toast("Employee Updated successfully");
        $('#messageModalEmployee').modal('show');
        this.isLoading = false;
      }
    }).catch(e => {
      alert(e.message)
      this.isLoading = false;
    })
  }

  initForm(){
    this.employeeForm = this.fb.group({
      EmployeeId: new FormControl(this.employeeDetail.EmployeeId),
      FirstName: new FormControl(this.employeeDetail.FirstName),
      LastName: new FormControl(this.employeeDetail.LastName),
      FatherName: new FormControl(this.employeeDetail.FatherName),
      MotherName: new FormControl(this.employeeDetail.MotherName),
      Email: new FormControl(this.employeeDetail.Email),
      Mobile: new FormControl(this.employeeDetail.Mobile),
      AlternateNumber: new FormControl(this.employeeDetail.AlternateNumber),
      Address: new FormControl(this.employeeDetail.Address),
      City: new FormControl(this.employeeDetail.City),
      State: new FormControl(this.employeeDetail.State),
      Country: new FormControl(this.employeeDetail.Country),
      RoleId: new FormControl(this.employeeDetail.RoleId),
      DesignationId: new FormControl(this.employeeDetail.DesignationId),
      ReporteeId: new FormControl(this.employeeDetail.ReporteeId),
      Pan: new FormControl(this.employeeDetail.Pan),
      Aadhar: new FormControl(this.employeeDetail.Aadhar),
      AccountNo: new FormControl(this.employeeDetail.AccountNo),
      BankName: new FormControl(this.employeeDetail.BankName),
      IfscCode: new FormControl(this.employeeDetail.IfscCode),
      Branch: new FormControl(this.employeeDetail.Branch),
      ExperienceInMonths: new FormControl(this.employeeDetail.ExperienceInMonths),
      PassportNumber: new FormControl(this.employeeDetail.PassportNumber),
      JobTypeId: new FormControl(this.employeeDetail.JobTypeId),
      LastCompanyName: new FormControl(this.employeeDetail.LastCompanyName),
      Designation: new FormControl(this.employeeDetail.Designation),
      Salary: new FormControl(this.employeeDetail.Salary),
      ExpectedSalary: new FormControl(this.employeeDetail.ExpectedSalary),
      ExpectedDesignation: new FormControl(this.employeeDetail.ExpectedDesignation),
      PinCode: new FormControl(this.employeeDetail.PinCode),
      MedicalConsultancyId: new FormControl(this.employeeDetail.MedicalConsultancyId),
      ConsultedBy: new FormControl(this.employeeDetail.ConsultedBy),
      ReferenceId: new FormControl(this.employeeDetail.ReferenceId),
      ReportId: new FormControl(this.employeeDetail.ReportId),
      ReportPath: new FormControl(this.employeeDetail.ReportPath)
    })
  }



  gotoEmployeePage(){
    $('#messageModalEmployee').modal('hide');
    this.nav.navigate(Employee, null)
  }

  reset() {
    this.employeeDetail = new EmployeeDetail();
    this.initForm();
  }

  get f() {
    return this.employeeForm.controls;
  }

  onLastWorkingDateSelection(e: NgbDateStruct) {
    let date = new Date(e.year, e.month -1, e.day);
    this.employeeForm.get("lastWorkingDate").setValue(date);
  }

  consultedOnSelection(e: NgbDateStruct) {
    let date = new Date(e.year, e.month -1, e.day);
    this.employeeForm.get("consultedOn").setValue(date);
  }

}

class EmployeeDetail {
  EmployeeId: number = 0;
  FirstName: string = null;
  LastName: string = null;
  FatherName: string = null;
  MotherName: string = null;
  Email: string = null;
  Mobile: string = null;
  AlternateNumber: string = null;
  Address: string = null;
  City: string = null;
  State: string = null;
  Country: string = null;
  RoleId: number = 0;
  DesignationId: number = 0;
  ReporteeId: number = 0;
  Pan: string = null;
  Aadhar: string = null;
  PassportNumber: string = null;
  BankName: string = null;
  Branch: string = null;
  IfscCode: string = null;
  JobTypeId: number = 0;
  ExperienceInMonths: number = 0;
  LastCompanyName: string = null;
  LastWorkingDate: Date = null;
  Designation: string = null;
  Salary: number = 0;
  ExpectedSalary: number = 0;
  ExpectedDesignation: string = null;
  EmployeeMedicalDetailId: number = 0;
  MedicalConsultancyId: number = 0;
  ConsultedBy: string = null;
  ConsultedOn: Date = null;
  ReferenceId: number = 0;
  ReportId: number = 0;
  ReportPath: string = null;
  AccountNo: string = null;
  PinCode: number = 0;
}
