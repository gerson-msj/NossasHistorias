import { assert } from "@std/assert"
import UsuarioController from "./api/controllers/usuario.controller.ts";
import Context from "./api/controllers/base/context.ts";

Deno.test("Usuario POST", async () => {
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
    console.log("token", result["token"]);
    assert(() => result["token"] !== undefined);
});

Deno.test("Usuario GET", async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjF9.pEYtdez1IgumkcF1yLGfOlfZMV231f11F9dp0ODWtCU";
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
    console.log("Usuario", result);
    const id = result['id'];
    assert(() => id !== undefined);
    assert(() => id == 1);
});

Deno.test("Data", () => {
    const dt = new Date();
    const fatorDia = 1000 * 60 * 60 * 24;
    const x = Math.floor(dt.valueOf() / fatorDia);
    console.log("dias", x);
    assert(() => x > 0);
});