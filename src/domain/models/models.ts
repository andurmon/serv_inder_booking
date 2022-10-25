export interface Cuenta {
    user: string;
    pass: string;
    docType: "CC" | "TI" | "CE";
    guests: AthletesList[]
}

export interface CaseUseRequestModel {
    userList: Cuenta[];
    initTime: string;
    initDate: string;
}

export interface ResponsePackage {
    statusCode: number;
    message?: string;
    data: any
}

export interface AthletesList {
    document: string;
    docType: "CC" | "TI" | "CE";
}