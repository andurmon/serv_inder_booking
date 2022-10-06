export interface Cuenta {
    user: string;
    pass: string;
    docType: "CC" | "TI" | "CE";
}

export interface CaseUseRequestModel {
    cuentas: Cuenta[];
    horaInicial: string;
}

export interface ResponsePackage {
    statusCode: number;
    data: any
}