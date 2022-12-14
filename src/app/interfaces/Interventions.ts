import { EtatIntervention } from "../enums/EtatsIntervention";
import { Observations } from "./Observations";
import { Utilisateurs } from "./Utilisateurs";

export interface Interventions {
    id : number;
    objet : string;
    description : string;
    etat : EtatIntervention;
    placeholder? : string;
    createdBy : string;
    createdOn : Date;
    modifiedBy? : string;
    modifiedOn? : Date;
    deletedBy? : string;
    deletedOn? : Date;
    firebase : boolean;
    documentId : string;
    intervenant : Utilisateurs;
    timer? : number;
    gaffa : boolean;
}

export interface CreatedOn {
    seconds : number,
    nanoseconds : number
}
