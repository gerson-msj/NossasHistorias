import { assert, assertEquals, assertFalse } from "@std/assert"
import UsuarioController from "./api/controllers/usuario.controller.ts";
import Context from "./api/controllers/base/context.ts";

Deno.test.ignore("Usuario POST", async () => {
    const request: Request = new Request("http://localhost/api/usuario", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const context = new Context(request);
    const controller = new UsuarioController();
    const response = await controller.handle(context);
    const result = await response.json();
    assert(() => result["token"] !== undefined);
});

Deno.test("Usuario GET", async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjM2fQ.PMU6ah-KSkJWOVYHEhDtMXiaBbYNVNxVxp0Z5cjou_o";
    const request: Request = new Request("http://localhost/api/usuario", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": `bearer ${token}`
        }
    });
    const context = new Context(request);
    await context.auth();
    const controller = new UsuarioController();
    const response = await controller.handle(context);
    const result = await response.json();
    const id = result['id'];
    assert(() => id !== undefined);
    assert(() => id == 36);
});


