import { CadastroDepRequestModel } from "../models/request.model.ts";
import Context from "./base/context.ts";
import Controller from "./base/controller.ts";
import { UsuarioService } from "./usuario.controller.ts";

class DepService {

    private usuarioService: UsuarioService;

    constructor(db: Deno.Kv) {
        this.usuarioService = new UsuarioService(db);
    }

    async adicionar(emailResp: string, request: Request): Promise<string | null> {
        
        const requestModel = await this.adicionar_ObterRequestModel(request);
        
        if(requestModel === null)
            return "Dados inválidos!";

        const result = await this.usuarioService.cadastrarDependente(emailResp, requestModel);
        return result;

    }

    private async adicionar_ObterRequestModel(request: Request): Promise<CadastroDepRequestModel | null> {
        const obj = await request.json();
        return typeof obj === 'object' &&
            obj !== null &&
            typeof obj.nome === 'string' &&
            typeof obj.email === 'string' &&
            typeof obj.senha === 'string' &&
            typeof obj.mesada === 'number' &&
            obj.mesada > 0 
            ? obj as CadastroDepRequestModel 
            : null;
    }
}

export default class DepController extends Controller<DepService> {

    public override async handle(context: Context): Promise<Response> {

        if (context.url.pathname != "/api/dep")
            return this.nextHandle(context);

        if (context.tokenSub?.perfil != "Resp")
            return context.unauthorized();

        if (["PUT"].includes(context.request.method)) {
            const db = await context.getDb();
            this.service = new DepService(db);
        } else {
            return context.notAllowed();
        }

        switch (context.request.method) {
            case "PUT": {
                const result = await this.service.adicionar(context.tokenSub.email, context.request);
                return result == null ? context.ok({}) : context.badRequest(result);
            }

            default: {
                return context.notAllowed();
            }
        }


    }

}