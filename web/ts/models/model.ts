import { HistoriaSituacao, Perfil } from "./const.model";

export interface TokenSubjectModel {
    email: string;
    perfil: Perfil;
}

export interface HistoriaModel {
    titulo: string;
    conteudo: string;
    situacao: HistoriaSituacao;
    motivoSituacao: string | null;
    visualizacoes: number;
    curtidas: number;
}