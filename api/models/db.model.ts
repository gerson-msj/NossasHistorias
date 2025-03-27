
export interface Usuario {
    Id: number;
    DataCriacao: number;
    Moderador: number;
}

export type HistoriaSituacao = "Em analise" | "Aprovada" | "Reprovada";
export const HistoriaSituacaoAnalise: HistoriaSituacao = "Em analise";
export const HistoriaSituacaoAprovada: HistoriaSituacao = "Aprovada";
export const HistoriaSituacaoReprovada: HistoriaSituacao = "Reprovada";

export interface Historia {
    Id: number;
    IdUsuarioAutor: number;
    IdUsuarioModerador: number;
    Titulo: string;
    Conteudo: string;
    Situacao: HistoriaSituacao;
    MotivoSituacao: string | null;
    DataHoraCriacao: number;
    DataHoraModeracao: number | null;
}

export interface Visualizacao {
    IdUsuario: number;
    IdHistoria: number;
    curtida: boolean;
}
