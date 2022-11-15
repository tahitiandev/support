import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EtatIntervention } from 'src/app/enums/EtatsIntervention';
import { Filtres } from 'src/app/interfaces/Filtres';
import { UtilityService } from 'src/app/services/utility.service';

interface EtatPopup{
  etat : EtatIntervention,
  value : boolean
}

@Component({
  selector: 'app-popup-filtre-etat',
  templateUrl: './popup-filtre-etat.component.html',
  styleUrls: ['./popup-filtre-etat.component.scss'],
})
export class PopupFiltreEtatComponent implements OnInit {

  // etats : Array<any> = [];
  formulaire : FormGroup = new FormGroup({
    Nouveau : new FormControl(),
    EnCours : new FormControl(),
    Termine : new FormControl(),
  });

   etats : Array<EtatPopup> = [
    {
      etat : EtatIntervention.Nouveau,
      value : false
    },
    {
      etat : EtatIntervention.EnCours,
      value : false
    },
    {
      etat : EtatIntervention.Termine,
      value : false
    },
  ]

  @Output() etatsOutput = new EventEmitter<any[]>();
  @Output() closePopUp = new EventEmitter();
  filtres : Filtres;

  constructor(private utility : UtilityService) { }
  
  ngOnInit() {
    this.getFiltres();
    console.log(this.etats);
  }

  updateFiltreEtat(etatForm : EtatPopup){
    for(let etat of this.etats){
      if(etat.etat === etatForm.etat){
        etat.value = etatForm.value;
      }
    }
    console.log(this.etats);
  }

  public async getFiltres(){
    const filtres : Filtres = await this.utility.getFiltre();
    for(let betat of filtres.Etats){
      const index = await this.etats.findIndex(etat => etat.etat === betat);
      this.etats[index].value = true;
    }
    
  }

  public checkEtat(setEtat){
    return this.etats.filter(etat => etat === setEtat).length > 0 ? true : false;
  }

  public emitEtat(){
    const data = this.formulaire.value;
    console.log(data)
    // this.etatsOutput.emit(etats);
  }

  public close(){
    this.closePopUp.emit();
  }


}
