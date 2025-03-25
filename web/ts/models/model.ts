import { HistoriaSituacao } from "./const.model";

export interface HistoriaModel {
    titulo: string;
    conteudo: string;
    situacao: HistoriaSituacao;
    motivoSituacao: string | null;
    visualizacoes: number;
    curtidas: number;
}

export interface DialogModel {
    titulo: string | null;
    icone: string | null;
    mensagem: string;
    cancel: string | null;
    ok: string;
    retorno: string;
}