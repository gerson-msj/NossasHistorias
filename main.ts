import Controller from "./api/controllers/base/controller.ts";
import Context from "./api/controllers/base/context.ts";
import PageController from "./api/controllers/page.controller.ts";

import UsuarioController from "./api/controllers/usuario.controller.ts";
import HistoriaController from "./api/controllers/historia.controller.ts";
import ModeradorController from "./api/controllers/moderador.controller.ts";
import VisualizacoesController from "./api/controllers/visualizacoes.controller.ts";
import MinhasHistoriasController from "./api/controllers/minhas-historias.controller.ts";
import HistoriasVisualizadasController from "./api/controllers/historias-visualizadas.controller.ts";

const page = Controller.createInstance(PageController);

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
        
        const controllers = Controller.enlistHandlers(
            UsuarioController,
            HistoriaController,
            ModeradorController,
            VisualizacoesController,
            MinhasHistoriasController,
            HistoriasVisualizadasController
        );

        try {
            return await controllers.handle(context);    
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