import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup-filtres',
  templateUrl: './popup-filtres.component.html',
  styleUrls: ['./popup-filtres.component.scss'],
})
export class PopupFiltresComponent implements OnInit {

  @Output() filtreEtatOutput = new EventEmitter();
  @Output() filtreGaffaOutput = new EventEmitter();

  constructor() { }

  ngOnInit() {}


  public emitFiltreEtat(){
    this.filtreEtatOutput.emit();
  }
  public emitFiltreGaffa(){
    this.filtreGaffaOutput.emit();
  }

}
