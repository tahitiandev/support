import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RefeshGetFirebaseComponent } from './refesh-get-firebase.component';

describe('RefeshGetFirebaseComponent', () => {
  let component: RefeshGetFirebaseComponent;
  let fixture: ComponentFixture<RefeshGetFirebaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RefeshGetFirebaseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RefeshGetFirebaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
