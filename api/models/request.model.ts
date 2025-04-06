import { Situacao } from "./db.model.ts";

export interface HistoriaRequestModel {
    titulo: string,
    conteudo: string
}

export interface HistoriaModeracaoRequestModel {
    idHistoria: number,
    idSituacao: Situacao,
    motivoModeracao?: string
}

export interface ProximaHistoriaRequestModel {
    idHistoria?: number
}

export interface CurtirRequestModel {
    idHistoria: number,
    curtida: boolean
}