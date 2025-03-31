export interface HistoriaRequestModel {
    titulo: string,
    conteudo: string
}

export enum Situacao {
    analise = 1,
    aprovada = 2,
    reprovada = 3
}

export interface HistoriaModeracaoRequestModel {
    idHistoria: number,
    idSituacao: Situacao,
    motivoModeracao?: string
}