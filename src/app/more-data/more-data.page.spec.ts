import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MoreDataPage } from './more-data.page';

describe('MoreDataPage', () => {
  let component: MoreDataPage;
  let fixture: ComponentFixture<MoreDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreDataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MoreDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
