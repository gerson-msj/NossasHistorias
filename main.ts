import Controller from "./api/controllers/base/controller.ts";
import Context from "./api/controllers/base/context.ts";
import PageController from "./api/controllers/page.controller.ts";

// import CriarController from "./api/controllers/criar.controller.ts";
// import AbrirController from "./api/controllers/abrir.controller.ts";
// import AnotacoesController from "./api/controllers/anotacoes.controller.ts";
import UsuarioController from "./api/controllers/usuario.controller.ts";
import DepController from "./api/controllers/dep.controller.ts";
import ResumoController from "./api/controllers/resumo.controller.ts";

const page = Controller.createInstance(PageController);

// const handler = async (request: Request): Promise<Response> => {
const handler = async (request: Request): Promise<Response> => {
    
    const context = new Context(request);
    
    if (context.isApiRequest) {

        if(!await context.auth())
            return context.unauthorized();
        
        const usuario = new UsuarioController();
        const dep = new DepController();
        const resumo = new ResumoController();
        const controllers = Controller.enlistHandlers(
            usuario,
            dep,
            resumo
        );

        return controllers.handle(context);
        
    } else {
        return page.handle(context);
    }
};

Deno.serve(handler);