
export interface TokenResponseModel {
    token: string | null;
    message: string | null;
}

export interface UsuarioResponseModel {
    usuarioExistente: boolean;
    id: number | undefined;
    moderador: boolean | undefined;
}

export interface ResumoMesadaResponseModel {
    dep: string | null;
    nome: string;
    acumulado: number;
    pago: number;
    saldo: number;
}