import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsDataPage } from './details-data.page';

describe('DetailsDataPage', () => {
  let component: DetailsDataPage;
  let fixture: ComponentFixture<DetailsDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsDataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
