import { serveFile } from "@std/http/file-server";
import { join } from "@std/path/join";
import Controller from "./base/controller.ts";
import Context from "./base/context.ts";

class PageService {

    filePath(basePath: string | undefined, pathName: string): string {
        
        let fileDir = "app";

        //Para Debug
        // if(pathName.includes(".js") || pathName.includes(".ts"))
        //     fileDir = "";

        if(pathName.endsWith(".ts"))
            fileDir = "";

        const pageDir = join(Deno.cwd(), basePath ?? "web", fileDir);

        let filePath = pathName.includes(".") ? join(pageDir, pathName) : pageDir;
        if (Deno.statSync(filePath).isDirectory)
            filePath = join(filePath, "index.html");

        return filePath
    }
}

export default class PageController extends Controller<PageService> {

    private basePath: string | undefined;

    constructor(basePath: string | undefined = undefined) {
        super();
        this.basePath = basePath;
    }

    public handle(context: Context): Promise<Response> {

        if (context.isApiRequest)
            return super.nextHandle(context);

        this.service = new PageService();
        const filePath = this.service.filePath(this.basePath, context.url.pathname);
        
        try {    
            return serveFile(context.request, filePath);
        } catch (error) {
            console.error(error);
            return Promise.resolve(new Response("¯\_(ツ)_/¯", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } }));
        }
    }

}