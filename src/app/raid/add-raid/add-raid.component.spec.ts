import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRaidComponent } from './add-raid.component';

describe('AddRaidComponent', () => {
  let component: AddRaidComponent;
  let fixture: ComponentFixture<AddRaidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRaidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
