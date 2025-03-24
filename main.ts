import Controller from "./api/controllers/base/controller.ts";
import Context from "./api/controllers/base/context.ts";
import PageController from "./api/controllers/page.controller.ts";

// import CriarController from "./api/controllers/criar.controller.ts";
// import AbrirController from "./api/controllers/abrir.controller.ts";
// import AnotacoesController from "./api/controllers/anotacoes.controller.ts";
import UsuarioController from "./api/controllers/usuario.controller.ts";

const page = Controller.createInstance(PageController);

// const handler = async (request: Request): Promise<Response> => {
const handler = async (request: Request): Promise<Response> => {
    
    // const headers = new Headers({
    //     "Access-Control-Allow-Origin": "*", // Permite qualquer origem
    //     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    //     "Access-Control-Allow-Headers": "Content-Type, Authorization",
    // });

    // // Se for uma requisição OPTIONS (pré-flight), responde diretamente
    // if (request.method === "OPTIONS") {
    //     return new Response(null, { status: 204, headers });
    // }

    const context = new Context(request);

    if (context.isApiRequest) {

        if(!await context.auth())
            return context.unauthorized();
        
        const usuario = new UsuarioController();
        const controllers = Controller.enlistHandlers(
            usuario
        );

        try {
            return controllers.handle(context);    
        } catch (error) {
            console.error(error);
            return context.serverError();
        } finally {
            context.closeDb();
        }
        
    } else {
        return page.handle(context);
    }
};

Deno.serve(handler);