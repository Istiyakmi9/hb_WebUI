import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumsComponent } from './breadcrums.component';

describe('BreadcrumsComponent', () => {
  let component: BreadcrumsComponent;
  let fixture: ComponentFixture<BreadcrumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BreadcrumsComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(BreadcrumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
