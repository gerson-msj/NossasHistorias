import { assert, assertNotEquals } from "@std/assert"
import UsuarioController from "./api/controllers/usuario.controller.ts";
import Context from "./api/controllers/base/context.ts";
import { HistoriaRequestModel, MinhasHistoriasRequestModel } from "./api/models/request.model.ts";
import HistoriaController from "./api/controllers/historia.controller.ts";
import ModeradorController from "./api/controllers/moderador.controller.ts";
import MinhasHistoriasController from "./api/controllers/minhas-historias.controller.ts";

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
    console.log("token", result["token"]);
    assert(() => result["token"] !== undefined);
});

Deno.test.ignore("Usuario GET", async () => {
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

Deno.test.ignore("Historia POST", async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjF9.pEYtdez1IgumkcF1yLGfOlfZMV231f11F9dp0ODWtCU";
    const historia: HistoriaRequestModel = {
        titulo: "Título",
        conteudo: "Conteúdo da História."
    };
    const request: Request = new Request("http://localhost/api/historia", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": `bearer ${token}`
        },
        body: JSON.stringify(historia)
    });
    const context = new Context(request);
    await context.auth();
    const controller = new HistoriaController();
    const response = await controller.handle(context);
    assert(() => response.ok);
    
});

Deno.test.ignore("DataDia", () => {
    const dt = new Date();
    const fatorDia = 1000 * 60 * 60 * 24; // ms, s, m, h
    const x = Math.floor(dt.valueOf() / fatorDia);
    console.log("dias", x);
    assert(() => x > 0);
});

Deno.test.ignore("DataHora_ate_ss", () => {
    const dt = new Date();
    const fatorDia = 1000 * 60 * 60 * 24; // ms, s, m, h
    const x = dt.valueOf() / fatorDia;
    const y = Math.round(x * 100000) / 100000
    console.log("valueOf", dt.valueOf());
    console.log("dia e hora", x);
    console.log("dia e hora", y);
    assert(() => x > 0);
});

Deno.test.ignore("Moderador GET", async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjF9.pEYtdez1IgumkcF1yLGfOlfZMV231f11F9dp0ODWtCU";
    const request: Request = new Request("http://localhost/api/moderador", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": `bearer ${token}`
        }
    });
    const context = new Context(request);
    await context.auth();
    const controller = new ModeradorController();
    const response = await controller.handle(context);
    const result = await response.json();
    console.log("Historia Moderador", result);
    const id = result['id'];
    assertNotEquals(id, 0);
});

Deno.test("Minhas Histórias", async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjJ9.t_UQhqUXiRDc0dDmFZ1vMFpMB1OTz1sqpvY64RIR9w8";
    const request: Request = new Request("http://localhost/api/minhas-historias?pagina=5", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": `bearer ${token}`
        }
    });
    const context = new Context(request);
    await context.auth();
    const controller = new MinhasHistoriasController();
    const response = await controller.handle(context);
    const result = await response.json();
    console.log("MinhasHistorias", result);
    assert(() => result !== undefined);
});
