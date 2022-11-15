import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopupFiltreEtatComponent } from './popup-filtre-etat.component';

describe('PopupFiltreEtatComponent', () => {
  let component: PopupFiltreEtatComponent;
  let fixture: ComponentFixture<PopupFiltreEtatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupFiltreEtatComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupFiltreEtatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
