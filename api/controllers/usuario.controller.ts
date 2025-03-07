import Controller from "./base/controller.ts";
import Context from "./base/context.ts";
import type { CadastroRespRequestModel, LoginRequestModel } from "../../web/ts/models/request.model.ts";
import { PerfilDep, PerfilResp, type ResponsavelDbModel } from "../models/db.model.ts";
import type { TokenResponseModel, TokenSubject, UsuarioExistenteResponseModel } from "../models/response.model.ts";
import ServerCrypt from "../services/server.crypt.ts";
import type { DependenteDbModel, Perfil, UsuarioDbModel } from "../models/db.model.ts";
import { CadastroDepRequestModel } from "../models/request.model.ts";

export class UsuarioService {

    private db: Deno.Kv;
    private crypt: ServerCrypt;

    constructor(db: Deno.Kv) {
        this.db = db;
        this.crypt = new ServerCrypt();
    }

    async usuarioExistente(email: string | null): Promise<UsuarioExistenteResponseModel> {

        const result = await this.db.getMany([
            [PerfilResp, email ?? ""],
            [PerfilDep, email ?? ""]
        ]);

        return { usuarioExistente: result?.some(r => r.value != null) ?? false };
    }

    async cadastrarResponsavel(request: CadastroRespRequestModel): Promise<TokenResponseModel> {

        const usuarioExistenteResponse = await this.usuarioExistente(request.email);

        if (usuarioExistenteResponse.usuarioExistente)
            return { token: null, message: "O email informado já está cadastrado." };

        const senha = await this.crypt!.criptografarSenha(request.senha);
        const responsavel: ResponsavelDbModel = {
            usuario: {
                nome: request.nome,
                senha: senha
            },
            dependentes: []
        };

        const result = await this.db.set([PerfilResp, request.email], responsavel);
        if (!result.ok)
            return { token: null, message: "Sistema indisponível no momento." };

        const sub: TokenSubject = { email: request.email, perfil: "Resp" };
        const token = await this.crypt.criarToken(sub);
        return { token: token, message: "Cadastro Ok." };

    }

    async cadastrarDependente(emailResp: string, request: CadastroDepRequestModel): Promise<string | null> {

        const respExistente = await this.usuarioExistente(emailResp);
        if(!respExistente.usuarioExistente) return "Responsável inexistente!";

        const depExistente = await this.usuarioExistente(request.email);
        if(depExistente.usuarioExistente) return "Dependente já cadastrado!";

        const senha = await this.crypt!.criptografarSenha(request.senha);
        const dep: DependenteDbModel = {
            usuario: {
                nome: request.nome,
                senha: senha
            },
            responsavel: emailResp,
            mesadas: [{
                id: 0,
                de: new Date(),
                ate: null,
                valor: request.mesada
            }],
            pagamentos: []
        };

        const respDb = await this.db.get([PerfilResp, emailResp]);
        const resp = respDb.value as ResponsavelDbModel;
        resp.dependentes.push(request.email);

        const result = await this.db.atomic()
            .check(respDb)
            .set([PerfilResp, emailResp], resp)
            .set([PerfilDep, request.email], dep)
            .commit();

        return result.ok ? null : "Sistema indisponível no momento.";
    }

    async login(request: LoginRequestModel): Promise<TokenResponseModel> {

        let usuario: UsuarioDbModel | undefined;
        let perfil: Perfil = PerfilResp;

        const usuarios = await this.db.getMany([
            [PerfilResp, request.email ?? ""],
            [PerfilDep, request.email ?? ""]
        ]);

        if (usuarios[0].value != null) {
            const resp = usuarios[0].value as ResponsavelDbModel;
            usuario = resp.usuario;
        } else if (usuarios[1].value != null) {
            const dep = usuarios[1].value as DependenteDbModel;
            usuario = dep.usuario;
            perfil = PerfilDep;
        }

        if (usuario == undefined) {
            return { token: null, message: "O email informado não está cadastrado." };
        }

        const senhaValida = await this.crypt.validarSenha(request.senha, usuario.senha);

        if (!senhaValida) {
            return { token: null, message: "A senha informada é inválida." };
        }

        const sub: TokenSubject = { email: request.email, perfil: perfil };
        const token = await this.crypt.criarToken(sub);
        return { token: token, message: "Login Ok." };
    }

}

export default class UsuarioController extends Controller<UsuarioService> {

    public override async handle(context: Context): Promise<Response> {

        if (context.url.pathname != "/api/usuario")
            return this.nextHandle(context);

        if (["GET", "PUT", "POST"].includes(context.request.method)) {
            const db = await context.getDb();
            this.service = new UsuarioService(db);
        } else {
            return context.notAllowed();
        }

        switch (context.request.method) {
            case "GET": {
                const request = context.url.searchParams.get("email");
                const response = await this.service.usuarioExistente(request);
                return context.ok(response);
            }

            case "PUT": {
                const request: CadastroRespRequestModel = await context.request.json();
                const response: TokenResponseModel = await this.service.cadastrarResponsavel(request);
                return context.ok(response);
            }

            case "POST": {
                const request: LoginRequestModel = await context.request.json();
                const response = await this.service.login(request);
                return context.ok(response);
            }

            default: {
                return context.notAllowed();
            }
        }
    }
}

