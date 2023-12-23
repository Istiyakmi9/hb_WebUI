import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-manage-client',
  templateUrl: './manage-client.component.html',
  styleUrls: ['./manage-client.component.scss']
})
export class ManageClientComponent implements OnInit {
  isReady: boolean = true;
  isLoading: boolean = false;
  clientForm: FormGroup;

  constructor() { }

  ngOnInit(): void {

  }

  addClientDetail() {

  }

  gotoClientPage() {

  }
}
