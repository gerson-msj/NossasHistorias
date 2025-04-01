import { Situacao } from "./db.model.ts";

export interface HistoriaRequestModel {
    titulo: string,
    conteudo: string
}

export interface HistoriaResponseModel {
    id: number,
    titulo: string,
    conteudo: string,
    visualizacoes: number,
    curtidas: number
}

export interface HistoriaModeracaoRequestModel {
    idHistoria: number,
    idSituacao: Situacao,
    motivoModeracao?: string
}