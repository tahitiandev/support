export interface Observations{
    id : number;
    description : string;
    createdBy : string;
    createdOn : Date;
    modifiedBy? : string;
    modifiedOn? : Date;
    deletedBy? : string;
    deletedOn? : Date;
    firebase : boolean;
    documentId : string;
}