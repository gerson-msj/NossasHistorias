import { assertEquals } from "@std/assert"
import UsuarioController from "./api/controllers/usuario.controller.ts";
import Context from "./api/controllers/base/context.ts";

Deno.test("Simple test", async () => {
    
    const request: Request = new Request("http://localhost/api/usuario", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const context = new Context(request);
    const controller = new UsuarioController();
    const response = await controller.handle(context);

    assertEquals(200, response.status, "Teste");
});