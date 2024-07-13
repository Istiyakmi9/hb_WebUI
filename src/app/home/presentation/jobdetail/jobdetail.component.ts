import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-jobdetail',
    templateUrl: './jobdetail.component.html',
    styleUrls: ['./jobdetail.component.scss'],
    standalone: true,
    imports: [FormsModule, RouterLink]
})
export class JobdetailComponent {

}
