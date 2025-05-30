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
    titulo?: string;
    icone?: string;
    mensagem: string;
    cancel?: string;
    ok: string;
}
