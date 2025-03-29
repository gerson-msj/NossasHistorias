
export interface Usuario {
    Id: number;
    DataCriacao: number;
    Moderador: number;
}

export type HistoriaSituacaoDescricao = "Em analise" | "Aprovada" | "Reprovada";
export const HistoriaSituacaoAnalise: HistoriaSituacaoDescricao = "Em analise";
export const HistoriaSituacaoAprovada: HistoriaSituacaoDescricao = "Aprovada";
export const HistoriaSituacaoReprovada: HistoriaSituacaoDescricao = "Reprovada";

export interface HistoriaSituacao {
    Id: number;
    Descricao: string;
}

export enum Situacao {
    analise = 1,
    aprovada = 2,
    reprovada = 3
}

export interface Historia {
    Id: number;
    IdUsuarioAutor: number;
    IdUsuarioModerador: number | null;
    Titulo: string;
    Conteudo: string;
    IdSituacao: Situacao;
    DataHoraCriacao: number;
    MotivoModeracao: string | null;
    DataHoraModeracao: number | null;
}

export interface Visualizacao {
    IdUsuario: number;
    IdHistoria: number;
    Curtida: boolean;
}
