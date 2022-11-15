export interface FileResponse{
    filename : string;
    sheet1 : Array<any>;
    sheet2 : Array<RegistreBackup>;
    headers : any;
}

export interface RegistreBackup{
    ID : number;
    StartTime : number;
    CompletionTime : number;
    Email : string;
    Name : string;
    Date : number;
    Client : string;
    DuréeSouhaitée : number;
    DuréeAccordée : number;
}