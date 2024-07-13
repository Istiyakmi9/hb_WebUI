import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-blogdetail',
    templateUrl: './blogdetail.component.html',
    styleUrls: ['./blogdetail.component.scss'],
    standalone: true,
    imports: [FormsModule, RouterLink]
})
export class BlogdetailComponent {

}
