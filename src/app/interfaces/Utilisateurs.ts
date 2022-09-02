export interface Utilisateurs{
    id : number;
    libelle : string;
    username : string;
    password : string;
    createdBy : string;
    createdOn : Date;
    modifiedBy : string;
    modifiedOn : Date;
    deletedBy : string;
    deletedOn : Date;
    firebase : boolean;
    documentId : string;
    isRoot : boolean;
}