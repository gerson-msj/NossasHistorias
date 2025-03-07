export type Perfil = "Resp" | "Dep";
export const PerfilResp: Perfil = "Resp";
export const PerfilDep: Perfil = "Dep";

export interface UsuarioDbModel {
    nome: string;
    senha: string;
}

export interface ResponsavelDbModel {
    usuario: UsuarioDbModel;
    dependentes: string[];
}

export interface MesadaDbModel {
    id: number;
    valor: number;
    de: Date;
    ate: Date | null;
}

export interface PagamentoDbModel {
    id: number;
    data: Date;
    valor: number;
}

export interface DependenteDbModel {
    usuario: UsuarioDbModel;
    responsavel: string;
    mesadas: MesadaDbModel[];
    pagamentos: PagamentoDbModel[];
}