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