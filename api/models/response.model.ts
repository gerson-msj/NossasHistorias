
export interface UsuarioResponseModel {
    usuarioExistente: boolean;
    id: number | undefined;
    moderador: boolean | undefined;
}

export interface HistoriaModeradorResponseModel {
    id: number;
    titulo: string;
    conteudo: string;
}

export interface ProximaHistoriaResponseModel {
    id: number,
    titulo: string,
    conteudo: string,
    visualizacoes: number,
    curtidas: number
}