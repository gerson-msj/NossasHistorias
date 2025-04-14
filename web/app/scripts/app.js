var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("models/const.model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.localStorageKey_minhaHistoria_historia = exports.localStorageKey_minhasHistorias_pagina = exports.tokenLSKey = exports.headerMenuVisible = exports.headerVoltarClick = exports.headerMenuClick = exports.PerfilDep = exports.PerfilResp = exports.HistoriaSituacaoReprovada = exports.HistoriaSituacaoAprovada = exports.HistoriaSituacaoAnalise = void 0;
    exports.HistoriaSituacaoAnalise = "Em analise";
    exports.HistoriaSituacaoAprovada = "Aprovada";
    exports.HistoriaSituacaoReprovada = "Reprovada";
    exports.PerfilResp = "Resp";
    exports.PerfilDep = "Dep";
    exports.headerMenuClick = "headerMenuClick";
    exports.headerVoltarClick = "headerVoltarClick";
    exports.headerMenuVisible = "headermenuVisible";
    exports.tokenLSKey = "token";
    exports.localStorageKey_minhasHistorias_pagina = "minhasHistorias_pagina";
    exports.localStorageKey_minhaHistoria_historia = "minhaHistoria_historia";
});
define("components/base/service", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Service {
        constructor() { }
    }
    exports.default = Service;
});
define("components/base/viewmodel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ViewModel {
        constructor() {
        }
        getElement(name) {
            return document.querySelector(`#${name}`);
        }
    }
    exports.default = ViewModel;
});
define("components/base/component", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Component extends HTMLElement {
        _service = null;
        get service() { return this._service; }
        _viewModel = null;
        get viewModel() { return this._viewModel; }
        _tokenSubject = null;
        get tokenSubject() { return this._tokenSubject; }
        modelPath;
        constructor(modelName) {
            super();
            this.modelPath = `/models/${modelName}.model.html`;
        }
        async connectedCallback() {
            await this.initializeElement();
        }
        async initializeElement() {
            await this.initializeModel();
            // Avaliar inclusão de try catch, apresentando erro genérico em popup e retornando a intro.
            await this.initialize();
            this.dispatchEvent(new Event("initialized"));
        }
        async initializeModel() {
            const requestModel = await fetch(this.modelPath);
            const model = await requestModel.text();
            const modelTemplate = document.createElement("div");
            modelTemplate.innerHTML = model;
            const template = modelTemplate.querySelector("template");
            this.appendChild(template.content.cloneNode(true));
        }
        validarTokenSubject() {
            try {
                const token = localStorage.getItem("token");
                const payload = JSON.parse(atob(token.split(".")[1]));
                this._tokenSubject = payload.sub;
                return true;
            }
            catch (error) {
                this._tokenSubject = null;
                return false;
            }
        }
        initializeResources(viewModel, service) {
            this._service = new service();
            this._viewModel = new viewModel();
            return Promise.resolve();
        }
        dispatch(eventName) {
            this.dispatchEvent(new Event(eventName));
        }
    }
    exports.default = Component;
});
define("components/header.component", ["require", "exports", "models/const.model", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, const_model_1, component_1, service_1, viewmodel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_1 = __importDefault(component_1);
    service_1 = __importDefault(service_1);
    viewmodel_1 = __importDefault(viewmodel_1);
    class HeaderViewModel extends viewmodel_1.default {
        headerIcone;
        headerTitulo;
        headerMenu;
        cssPointer = "pointer";
        cssOculto = "oculto";
        onMenuClick = () => { };
        onVoltarClick = () => { };
        constructor() {
            super();
            this.headerIcone = this.getElement("headerIcone");
            this.headerTitulo = this.getElement("headerTitulo");
            this.headerMenu = this.getElement("headerMenu");
            this.headerMenu.addEventListener("click", () => this.onMenuClick());
            this.headerIcone.addEventListener("click", () => {
                if (this.headerIcone.innerText == "chevron_left")
                    this.onVoltarClick();
            });
        }
        config(headerConfig) {
            this.headerTitulo.innerText = headerConfig.titulo;
            if (headerConfig.exibirVoltar) {
                this.headerIcone.innerText = "chevron_left";
                if (!this.headerIcone.classList.contains(this.cssPointer))
                    this.headerIcone.classList.add(this.cssPointer);
            }
            else {
                this.headerIcone.innerText = "auto_stories";
                if (this.headerIcone.classList.contains(this.cssPointer))
                    this.headerIcone.classList.remove(this.cssPointer);
            }
            const estaOculto = this.headerMenu.classList.contains(this.cssOculto);
            if (headerConfig.exibirMenu && estaOculto)
                this.headerMenu.classList.remove(this.cssOculto);
            else if (!headerConfig.exibirMenu && !estaOculto)
                this.headerMenu.classList.add(this.cssOculto);
        }
    }
    class HeaderService extends service_1.default {
        constructor() {
            super();
        }
    }
    class HeaderComponent extends component_1.default {
        constructor() {
            super("header");
        }
        async initialize() {
            await this.initializeResources(HeaderViewModel, HeaderService);
            this.viewModel.onMenuClick = () => this.dispatchEvent(new Event(const_model_1.headerMenuClick));
            this.viewModel.onVoltarClick = () => this.dispatchEvent(new Event(const_model_1.headerVoltarClick));
            this.addEventListener("config", (ev) => {
                const headerConfig = ev.detail;
                this.viewModel.config(headerConfig);
            });
        }
    }
    exports.default = HeaderComponent;
});
define("models/request.model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Situacao = void 0;
    var Situacao;
    (function (Situacao) {
        Situacao[Situacao["analise"] = 1] = "analise";
        Situacao[Situacao["aprovada"] = 2] = "aprovada";
        Situacao[Situacao["reprovada"] = 3] = "reprovada";
    })(Situacao || (exports.Situacao = Situacao = {}));
});
define("models/response.model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("services/token.service", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TokenService {
        static possuiToken() {
            const tokenSub = this.obterTokenSubject();
            return tokenSub !== null;
        }
        static verificarToken() {
            const tokenSub = this.obterTokenSubject();
            if (tokenSub == null) {
                document.dispatchEvent(new Event("unauthorized"));
                return false;
            }
            return true;
        }
        static obterTokenSubject() {
            try {
                const token = localStorage.getItem("token");
                const payload = JSON.parse(atob(token.split(".")[1]));
                return payload.sub;
            }
            catch (error) {
                return null;
            }
        }
    }
    exports.default = TokenService;
});
define("services/api.service", ["require", "exports", "services/token.service"], function (require, exports, token_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    token_service_1 = __importDefault(token_service_1);
    class ApiService {
        baseUrl;
        constructor(baseUrl) {
            this.baseUrl = `/api/${baseUrl}`;
            //this.baseUrl = `http://localhost:8000/api/${baseUrl}`;
        }
        async doGet(searchParams = null) {
            const url = searchParams ? `${this.baseUrl}?${searchParams}` : this.baseUrl;
            const response = await fetch(url, {
                method: "GET",
                headers: this.getHeaders()
            });
            return this.getResult(response);
        }
        async doPost(request) {
            const response = await fetch(this.baseUrl, {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify(request)
            });
            return this.getResult(response);
        }
        async doPut(request) {
            const response = await fetch(this.baseUrl, {
                method: "PUT",
                headers: this.getHeaders(),
                body: JSON.stringify(request)
            });
            return this.getResult(response);
        }
        async doDelete(searchParams = null) {
            const url = searchParams ? `${this.baseUrl}?${searchParams}` : this.baseUrl;
            const response = await fetch(url, {
                method: "DELETE",
                headers: this.getHeaders()
            });
            return this.getResult(response);
        }
        async getResult(response) {
            if (response.ok) {
                const text = await response.text();
                return text ? JSON.parse(text) : undefined;
            }
            else {
                if (response.status == 401)
                    document.dispatchEvent(new Event("unauthorized"));
                const error = await response.json();
                console.log("Erro:", error);
                throw new Error(error?.message ?? response.statusText);
            }
        }
        getHeaders() {
            const headers = { "content-type": "application/json; charset=utf-8" };
            let token = null;
            if (token_service_1.default.possuiToken())
                token = localStorage.getItem("token");
            if (token !== null)
                headers["authorization"] = `Bearer ${token}`;
            return headers;
        }
    }
    exports.default = ApiService;
});
define("components/index.component", ["require", "exports", "models/const.model", "services/api.service", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, const_model_2, api_service_1, component_2, service_2, viewmodel_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    api_service_1 = __importDefault(api_service_1);
    component_2 = __importDefault(component_2);
    service_2 = __importDefault(service_2);
    viewmodel_2 = __importDefault(viewmodel_2);
    class IndexViewModel extends viewmodel_2.default {
        // Menu
        menuContainer;
        menuBackdrop;
        novaHistoria;
        minhasHistorias;
        historiasVisualizadas;
        pendentesAprovacao;
        acesso;
        onNovaHistoria = () => { };
        onMinhasHistorias = () => { };
        onHistoriasVisualizadas = () => { };
        onPendentesAprovacao = () => { };
        onAcesso = () => { };
        // História
        tituloHistoria;
        conteudoHistoria;
        curtir;
        proxima;
        historia;
        onCurtir = async (request) => { };
        onProxima = () => { };
        constructor() {
            super();
            // Menu
            this.menuContainer = this.getElement("menuContainer");
            this.menuBackdrop = this.getElement("menuBackdrop");
            this.novaHistoria = this.getElement("novaHistoria");
            this.minhasHistorias = this.getElement("minhasHistorias");
            this.historiasVisualizadas = this.getElement("historiasVisualizadas");
            this.pendentesAprovacao = this.getElement("pendentesAprovacao");
            this.acesso = this.getElement("acesso");
            this.menuBackdrop.addEventListener("click", () => this.ocultarMenu());
            this.novaHistoria.addEventListener("click", () => this.onNovaHistoria());
            this.minhasHistorias.addEventListener("click", () => this.onMinhasHistorias());
            this.historiasVisualizadas.addEventListener("click", () => this.onHistoriasVisualizadas());
            this.pendentesAprovacao.addEventListener("click", () => this.onPendentesAprovacao());
            this.acesso.addEventListener("click", () => this.onAcesso());
            // História
            this.tituloHistoria = this.getElement("tituloHistoria");
            this.conteudoHistoria = this.getElement("conteudoHistoria");
            this.curtir = this.getElement("curtir");
            this.proxima = this.getElement("proxima");
            this.curtir.addEventListener("click", async () => {
                if (this.historia) {
                    this.historia.curtida = !this.historia.curtida;
                    await this.onCurtir({ idHistoria: this.historia.id, curtida: this.historia.curtida });
                    this.apresentarCurtir();
                }
            });
            this.proxima.addEventListener("click", () => this.onProxima());
        }
        exibirMenu() {
            this.menuContainer.classList.remove("oculto");
        }
        ocultarMenu() {
            this.menuContainer.classList.add("oculto");
        }
        exibirPendentesAprovacao() {
            this.pendentesAprovacao.classList.remove("oculto");
        }
        apresentar(historia) {
            this.historia = historia;
            if (!historia) {
                this.tituloHistoria.innerText = "Não existem novas histórias (⊙_◎)";
                this.conteudoHistoria.innerHTML = "";
                const p = document.createElement("p");
                p.innerText = `Não deixe as histórias acabarem, compartilhe suas histórias!`;
                this.conteudoHistoria.appendChild(p);
                localStorage.removeItem("idHistoria");
                this.curtir.classList.add("oculto");
                this.proxima.classList.add("oculto");
                return;
            }
            localStorage.setItem("idHistoria", (historia.id.toString()));
            this.tituloHistoria.innerText = historia.titulo;
            this.conteudoHistoria.innerHTML = "";
            const values = historia.conteudo.split(/\r?\n/);
            values.forEach(v => {
                const p = document.createElement("p");
                p.innerText = v;
                this.conteudoHistoria.appendChild(p);
            });
            const p = document.createElement("p");
            p.innerText = `Visualizações: ${historia.visualizacoes} | Curtidas: ${historia.curtidas}`;
            this.conteudoHistoria.appendChild(p);
            this.apresentarCurtir();
            this.curtir.classList.remove("oculto");
            this.proxima.classList.remove("oculto");
        }
        apresentarCurtir() {
            if (this.historia?.curtida)
                this.curtir.classList.add("fill");
            else
                this.curtir.classList.remove("fill");
        }
    }
    class IndexService extends service_2.default {
        apiUsuario;
        apiHistoria;
        apiVisualizacoes;
        constructor() {
            super();
            this.apiUsuario = new api_service_1.default("usuario");
            this.apiHistoria = new api_service_1.default("historia");
            this.apiVisualizacoes = new api_service_1.default("visualizacoes");
        }
        obterUsuario() {
            return this.apiUsuario.doGet();
        }
        obterProximaHistoria(idHistoria) {
            const searchParams = new URLSearchParams();
            if (idHistoria)
                searchParams.append("idHistoria", (idHistoria));
            return this.apiHistoria.doGet(searchParams);
        }
        curtir(request) {
            return this.apiVisualizacoes.doPut(request);
        }
    }
    class IndexComponent extends component_2.default {
        constructor() {
            super("index");
        }
        async initialize() {
            await this.initializeResources(IndexViewModel, IndexService);
            //Menu
            this.addEventListener(const_model_2.headerMenuClick, () => this.viewModel.exibirMenu());
            this.viewModel.onNovaHistoria = () => this.dispatchEvent(new Event("novaHistoria"));
            this.viewModel.onMinhasHistorias = () => this.dispatchEvent(new Event("minhasHistorias"));
            this.viewModel.onHistoriasVisualizadas = () => this.dispatchEvent(new Event("historiasVisualizadas"));
            this.viewModel.onPendentesAprovacao = () => this.dispatchEvent(new Event("pendentesAprovacao"));
            this.viewModel.onAcesso = () => this.dispatchEvent(new Event("acesso"));
            const usuario = await this.service.obterUsuario();
            if (!usuario.usuarioExistente)
                document.dispatchEvent(new Event("unauthorized"));
            if (usuario.moderador)
                this.viewModel.exibirPendentesAprovacao();
            //História
            const idHistoria = localStorage.getItem("idHistoria");
            const historia = await this.service.obterProximaHistoria(idHistoria);
            this.viewModel.apresentar(historia);
            this.viewModel.onCurtir = (request) => this.service.curtir(request);
            this.viewModel.onProxima = () => this.obterProximaHistoria();
        }
        async obterProximaHistoria() {
            localStorage.removeItem("idHistoria");
            const historia = await this.service.obterProximaHistoria(null);
            this.viewModel.apresentar(historia);
        }
    }
    exports.default = IndexComponent;
});
define("components/intro.component", ["require", "exports", "services/api.service", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, api_service_2, component_3, service_3, viewmodel_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    api_service_2 = __importDefault(api_service_2);
    component_3 = __importDefault(component_3);
    service_3 = __importDefault(service_3);
    viewmodel_3 = __importDefault(viewmodel_3);
    class IntroViewModel extends viewmodel_3.default {
        entrar;
        onEntrar = () => { };
        constructor() {
            super();
            this.entrar = this.getElement("entrar");
            this.entrar.addEventListener("click", () => this.onEntrar());
        }
    }
    class IntroService extends service_3.default {
        apiUsuario;
        constructor() {
            super();
            this.apiUsuario = new api_service_2.default("usuario");
        }
        async obterToken() {
            const result = await this.apiUsuario.doPost({});
            return result.token;
        }
    }
    class IntroComponent extends component_3.default {
        constructor() {
            super("intro");
        }
        async initialize() {
            await this.initializeResources(IntroViewModel, IntroService);
            this.viewModel.onEntrar = () => this.dispatchEvent(new Event("entrar"));
            if (!this.validarTokenSubject()) {
                const token = await this.service.obterToken();
                localStorage.setItem("token", token);
            }
        }
    }
    exports.default = IntroComponent;
});
define("models/model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/dialog.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_4, service_4, viewmodel_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_4 = __importDefault(component_4);
    service_4 = __importDefault(service_4);
    viewmodel_4 = __importDefault(viewmodel_4);
    class DialogViewModel extends viewmodel_4.default {
        dialogContainer;
        dialogBackdrop;
        dialogHeader;
        dialogIcon;
        dialogMsg;
        dialogInput;
        dialogInputLabel;
        dialogInputBox;
        dialogCancel;
        dialogOk;
        onCancel = () => { };
        onOk = (inputText) => { };
        constructor() {
            super();
            this.dialogContainer = this.getElement("dialogContainer");
            this.dialogBackdrop = this.getElement("dialogBackdrop");
            this.dialogHeader = this.getElement("dialogHeader");
            this.dialogIcon = this.getElement("dialogIcon");
            this.dialogMsg = this.getElement("dialogMsg");
            this.dialogInput = this.getElement("dialogInput");
            this.dialogInputLabel = this.getElement("dialogInputLabel");
            this.dialogInputBox = this.getElement("dialogInputBox");
            this.dialogCancel = this.getElement("dialogCancel");
            this.dialogOk = this.getElement("dialogOk");
            this.dialogCancel.addEventListener("click", () => this.onCancel());
            this.dialogBackdrop.addEventListener("click", () => this.onCancel());
            this.dialogOk.addEventListener("click", () => this.onOk(this.dialogInputBox.value));
            this.dialogInputBox.addEventListener("keyup", () => {
                this.dialogOk.disabled = this.dialogInputBox.value.trim() === "";
            });
        }
        openMsgBox(msgBox) {
            this.setBasicDialog(msgBox);
            this.dialogMsg.classList.remove("oculto");
            this.dialogInput.classList.add("oculto");
            this.dialogInputLabel.innerText = "";
            this.dialogInputBox.value = "";
            this.dialogOk.disabled = false;
            this.dialogContainer.classList.remove("oculto");
        }
        openInputBox(inputBox) {
            this.setBasicDialog(inputBox);
            this.dialogMsg.classList.add("oculto");
            this.dialogInput.classList.remove("oculto");
            this.dialogMsg.innerText = "";
            this.dialogOk.disabled = true;
            this.dialogContainer.classList.remove("oculto");
        }
        setBasicDialog(dialog) {
            if (dialog.titulo === undefined)
                this.dialogHeader.classList.add("oculto");
            if (dialog.icone === undefined)
                this.dialogIcon.classList.add("oculto");
            if (dialog.cancel === undefined)
                this.dialogCancel.classList.add("oculto");
            this.dialogHeader.innerText = dialog.titulo ?? "";
            this.dialogIcon.innerText = dialog.icone ?? "";
            this.dialogMsg.innerHTML = dialog.mensagem;
            this.dialogInputLabel.innerText = dialog.mensagem;
            this.dialogInputBox.value = "";
            this.dialogCancel.innerText = dialog.cancel ?? "";
            this.dialogOk.innerText = dialog.ok;
        }
        closeDialog() {
            this.dialogContainer.classList.add("oculto");
        }
    }
    class DialogService extends service_4.default {
    }
    class DialogComponent extends component_4.default {
        msgBoxOk = () => { };
        inputBoxOk = () => { };
        cancel = () => { };
        constructor() {
            super("dialog");
        }
        async initialize() {
            await this.initializeResources(DialogViewModel, DialogService);
            this.viewModel.onOk = async (inputText) => {
                this.viewModel.closeDialog();
                if (this.msgBoxOk)
                    await this.msgBoxOk();
                if (this.inputBoxOk)
                    await this.inputBoxOk(inputText);
            };
            this.viewModel.onCancel = async () => {
                this.viewModel.closeDialog();
                if (this.cancel)
                    await this.cancel();
            };
        }
        openMsgBox(msgBox, ok, cancel) {
            this.msgBoxOk = ok;
            this.inputBoxOk = undefined;
            this.cancel = cancel;
            this.viewModel.openMsgBox(msgBox);
        }
        openInputBox(inputBox, ok, cancel) {
            this.msgBoxOk = undefined;
            this.inputBoxOk = ok;
            this.cancel = cancel;
            this.viewModel.openInputBox(inputBox);
        }
        static load(element) {
            return new Promise((resolve) => {
                if (!customElements.get("dialog-component"))
                    customElements.define("dialog-component", DialogComponent);
                const dialogComponent = document.createElement("dialog-component");
                element.appendChild(dialogComponent);
                dialogComponent.addEventListener("initialized", () => {
                    resolve(dialogComponent);
                });
            });
        }
    }
    exports.default = DialogComponent;
});
define("components/nova-historia.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel", "components/dialog.component"], function (require, exports, component_5, service_5, viewmodel_5, dialog_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_5 = __importDefault(component_5);
    service_5 = __importDefault(service_5);
    viewmodel_5 = __importDefault(viewmodel_5);
    dialog_component_1 = __importDefault(dialog_component_1);
    class NovaHistoriaViewModel extends viewmodel_5.default {
        tituloNovaHistoria;
        novaHistoria;
        visualizar;
        _dialog = null;
        get dialog() { return this._dialog; }
        set dialog(v) { this._dialog = v; }
        timeoutId = null;
        onVisualizar = () => { };
        constructor() {
            super();
            this.tituloNovaHistoria = this.getElement("tituloNovaHistoria");
            this.novaHistoria = this.getElement("novaHistoria");
            this.visualizar = this.getElement("visualizar");
            this.visualizar.addEventListener("click", () => {
                if (this.podeVisualizar()) {
                    localStorage.setItem(this.tituloNovaHistoria.id, this.tituloNovaHistoria.value);
                    localStorage.setItem(this.novaHistoria.id, this.novaHistoria.value);
                    this.onVisualizar();
                }
            });
            this.tituloNovaHistoria.focus();
            this.restoreData(this.tituloNovaHistoria, this.novaHistoria);
            this.tituloNovaHistoria.addEventListener("keyup", this.saveData);
            this.novaHistoria.addEventListener("keyup", this.saveData);
        }
        saveData(ev) {
            if (this.timeoutId !== null)
                clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                const target = ev.target;
                localStorage.setItem(target.id, target.value);
            }, 500);
        }
        restoreData(...target) {
            target.forEach(t => {
                const value = localStorage.getItem(t.id) ?? "";
                const e = t;
                e.value = value;
            });
        }
        podeVisualizar() {
            if (this.tituloNovaHistoria.value.trim() !== "" && this.novaHistoria.value.trim() !== "") {
                return true;
            }
            this.dialog.openMsgBox({
                titulo: "Visualizar História",
                mensagem: "Dê um título e conte sua história, não deixe nada vazio!",
                icone: "emergency_home",
                ok: "Ok"
            });
            return false;
        }
    }
    class NovaHistoriaService extends service_5.default {
    }
    class NovaHistoriaComponent extends component_5.default {
        constructor() {
            super("nova-historia");
        }
        async initialize() {
            await this.initializeResources(NovaHistoriaViewModel, NovaHistoriaService);
            this.viewModel.onVisualizar = () => this.dispatchEvent(new Event("visualizar"));
            this.viewModel.dialog = await dialog_component_1.default.load(this);
        }
    }
    exports.default = NovaHistoriaComponent;
});
define("components/minhas-historias.component", ["require", "exports", "models/const.model", "services/api.service", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, const_model_3, api_service_3, component_6, service_6, viewmodel_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    api_service_3 = __importDefault(api_service_3);
    component_6 = __importDefault(component_6);
    service_6 = __importDefault(service_6);
    viewmodel_6 = __importDefault(viewmodel_6);
    class MinhasHistoriasViewModel extends viewmodel_6.default {
        primeira;
        anterior;
        visorPagina;
        proxima;
        ultima;
        historias;
        get pagina() {
            const p = localStorage.getItem(const_model_3.localStorageKey_minhasHistorias_pagina);
            return p ? parseInt(atob(p)) : 1;
        }
        set pagina(v) {
            localStorage.setItem(const_model_3.localStorageKey_minhasHistorias_pagina, btoa(v.toString()));
        }
        paginas;
        onIrParaPagina = (pagina) => { };
        onApresentarHistoria = (historia) => { };
        constructor() {
            super();
            this.primeira = this.getElement("primeira");
            this.anterior = this.getElement("anterior");
            this.visorPagina = this.getElement("visorPagina");
            this.proxima = this.getElement("proxima");
            this.ultima = this.getElement("ultima");
            this.historias = this.getElement("historias");
            this.primeira.addEventListener("click", () => {
                if (this.pagina > 1)
                    this.onIrParaPagina(1);
            });
            this.anterior.addEventListener("click", () => {
                if (this.pagina > 1)
                    this.onIrParaPagina(this.pagina - 1);
            });
            this.proxima.addEventListener("click", () => {
                if (this.paginas && this.pagina < this.paginas)
                    this.onIrParaPagina(this.pagina + 1);
            });
            this.ultima.addEventListener("click", () => {
                if (this.paginas && this.pagina < this.paginas)
                    this.onIrParaPagina(this.paginas);
            });
        }
        apresentarHistorias(minhasHistorias) {
            this.historias.innerHTML = "";
            minhasHistorias.historias.forEach(historia => {
                const titulo = document.createElement("span");
                const situacao = document.createElement("span");
                const vc = document.createElement("span");
                titulo.innerText = historia.titulo;
                situacao.innerText = historia.situacao;
                vc.innerHTML = `${historia.visualizacoes} / ${historia.curtidas}`;
                const row = document.createElement("div");
                row.append(titulo, situacao, vc);
                row.addEventListener("click", () => this.onApresentarHistoria(historia));
                this.historias.appendChild(row);
            });
            this.visorPagina.innerText = `página ${minhasHistorias.pagina} de ${minhasHistorias.paginas}`;
            this.exibirLink(minhasHistorias.pagina !== 1, this.primeira, this.anterior);
            this.exibirLink(minhasHistorias.pagina !== minhasHistorias.paginas, this.proxima, this.ultima);
            this.pagina = minhasHistorias.pagina;
            this.paginas = minhasHistorias.paginas;
        }
        exibirLink(exibir, ...elements) {
            elements.forEach(e => {
                if (exibir) {
                    e.classList.add('link');
                    e.classList.remove('disabled');
                }
                else {
                    e.classList.remove('link');
                    e.classList.add('disabled');
                }
            });
        }
    }
    class MinhasHistoriasService extends service_6.default {
        apiMinhasHistorias;
        constructor() {
            super();
            this.apiMinhasHistorias = new api_service_3.default("minhas-historias");
        }
        obterMinhasHistorias(pagina) {
            const searchParams = new URLSearchParams();
            searchParams.append("pagina", pagina.toString());
            return this.apiMinhasHistorias.doGet(searchParams);
        }
    }
    class MinhasHistoriasComponent extends component_6.default {
        constructor() {
            super("minhas-historias");
        }
        async initialize() {
            await this.initializeResources(MinhasHistoriasViewModel, MinhasHistoriasService);
            await this.apresentarHistorias(this.viewModel.pagina);
            this.viewModel.onApresentarHistoria = (historia) => this.dispatchEvent(new CustomEvent("apresentarHistoria", { detail: historia }));
            this.viewModel.onIrParaPagina = async (pagina) => {
                await this.apresentarHistorias(pagina);
            };
        }
        async apresentarHistorias(pagina) {
            const historias = await this.service.obterMinhasHistorias(pagina);
            this.viewModel.apresentarHistorias(historias);
        }
    }
    exports.default = MinhasHistoriasComponent;
});
define("components/minha-historia.component", ["require", "exports", "models/const.model", "services/api.service", "components/base/component", "components/base/service", "components/base/viewmodel", "components/dialog.component"], function (require, exports, const_model_4, api_service_4, component_7, service_7, viewmodel_7, dialog_component_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    api_service_4 = __importDefault(api_service_4);
    component_7 = __importDefault(component_7);
    service_7 = __importDefault(service_7);
    viewmodel_7 = __importDefault(viewmodel_7);
    dialog_component_2 = __importDefault(dialog_component_2);
    class MinhaHistoriaViewModel extends viewmodel_7.default {
        excluir;
        titulo;
        conteudo;
        _historia;
        get historia() {
            if (this._historia)
                return this._historia;
            const v = localStorage.getItem(const_model_4.localStorageKey_minhaHistoria_historia);
            this._historia = v ? JSON.parse(atob(v)) : undefined;
            return this._historia;
        }
        set historia(v) {
            localStorage.setItem(const_model_4.localStorageKey_minhaHistoria_historia, btoa(JSON.stringify(v)));
            this._historia = v;
        }
        dialog;
        onExcluir = (idHistoria) => { };
        constructor() {
            super();
            this.titulo = this.getElement("titulo");
            this.conteudo = this.getElement("conteudo");
            this.excluir = this.getElement("excluir");
            this.excluir.addEventListener("click", () => {
                if (!this.historia || !this.dialog)
                    return;
                this.dialog.openMsgBox({
                    titulo: "Excluir",
                    icone: "bookmark_remove",
                    mensagem: "A exclusão não poderá ser desfeita<br />Deseja realmente excluir esta história?",
                    ok: "Sim",
                    cancel: "Não"
                }, () => this.onExcluir(this.historia.id));
            });
        }
        apresentarHistoria(historia) {
            this.titulo.innerText = historia.titulo;
            this.conteudo.innerHTML = "";
            const values = historia.conteudo.split(/\r?\n/);
            values.forEach(v => {
                const p = document.createElement("p");
                p.innerText = v;
                this.conteudo.appendChild(p);
            });
            this.historia = historia;
        }
    }
    class MinhaHistoriaService extends service_7.default {
        apiMinhasHistorias;
        constructor() {
            super();
            this.apiMinhasHistorias = new api_service_4.default("minhas-historias");
        }
        excluir(idHistoria) {
            const p = new URLSearchParams({ idHistoria: idHistoria.toString() });
            return this.apiMinhasHistorias.doDelete(p);
        }
    }
    class MinhaHistoriaComponent extends component_7.default {
        constructor() {
            super("minha-historia");
        }
        async initialize() {
            await this.initializeResources(MinhaHistoriaViewModel, MinhaHistoriaService);
            this.viewModel.dialog = await dialog_component_2.default.load(this);
            this.viewModel.onExcluir = async (idHistoria) => {
                await this.service.excluir(idHistoria);
                this.viewModel.dialog.openMsgBox({
                    titulo: "Excluir",
                    mensagem: "A exclusão foi realizada.",
                    icone: "bookmark_remove",
                    ok: "Ok"
                }, () => this.voltar(), () => this.voltar());
            };
            if (this.viewModel.historia)
                this.viewModel.apresentarHistoria(this.viewModel.historia);
            this.addEventListener("initializeData", (ev) => {
                const historia = ev.detail;
                this.viewModel.apresentarHistoria(historia);
            });
        }
        voltar() {
            this.dispatchEvent(new Event("voltar"));
        }
    }
    exports.default = MinhaHistoriaComponent;
});
define("components/visualizar-nova-historia.component", ["require", "exports", "services/api.service", "components/base/component", "components/base/service", "components/base/viewmodel", "components/dialog.component"], function (require, exports, api_service_5, component_8, service_8, viewmodel_8, dialog_component_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    api_service_5 = __importDefault(api_service_5);
    component_8 = __importDefault(component_8);
    service_8 = __importDefault(service_8);
    viewmodel_8 = __importDefault(viewmodel_8);
    dialog_component_3 = __importDefault(dialog_component_3);
    class VisualizarNovaHistoriaViewModel extends viewmodel_8.default {
        tituloNovaHistoria;
        novaHistoria;
        _dialog = null;
        get dialog() { return this._dialog; }
        set dialog(v) { this._dialog = v; }
        salvar;
        onSalvar = (titulo, conteudo) => { };
        constructor() {
            super();
            this.tituloNovaHistoria = this.getElement("tituloNovaHistoria");
            this.novaHistoria = this.getElement("novaHistoria");
            this.restoreData(this.tituloNovaHistoria, this.novaHistoria);
            this.salvar = this.getElement("salvar");
            this.salvar.addEventListener("click", () => this.doSalvar());
        }
        restoreData(...target) {
            target.forEach(t => {
                const value = localStorage.getItem(t.id) ?? "";
                const e = t;
                e.innerHTML = "";
                const values = value.split(/\r?\n/);
                values.forEach(v => {
                    const p = document.createElement("p");
                    p.innerText = v;
                    e.appendChild(p);
                });
            });
        }
        doSalvar() {
            this.dialog.openMsgBox({
                titulo: "Salvar História",
                icone: "bookmark_add",
                mensagem: `
                Sua história será avaliada antes de ser publicada.
                <br />
                Você deseja continuar com a gravação?
            `,
                cancel: "Não",
                ok: "Sim"
            }, () => {
                const titulo = localStorage.getItem(this.tituloNovaHistoria.id) ?? "";
                const conteudo = localStorage.getItem(this.novaHistoria.id) ?? "";
                this.onSalvar(titulo, conteudo);
            });
        }
        clearData() {
            localStorage.removeItem(this.tituloNovaHistoria.id);
            localStorage.removeItem(this.novaHistoria.id);
        }
    }
    class VisualizarNovaHistoriaService extends service_8.default {
        apiHistoria;
        constructor() {
            super();
            this.apiHistoria = new api_service_5.default("historia");
        }
        salvar(titulo, conteudo) {
            const request = {
                titulo: titulo,
                conteudo: conteudo
            };
            return this.apiHistoria.doPost(request);
        }
    }
    class VisualizarNovaHistoriaComponent extends component_8.default {
        constructor() {
            super("visualizar-nova-historia");
        }
        async initialize() {
            await this.initializeResources(VisualizarNovaHistoriaViewModel, VisualizarNovaHistoriaService);
            this.viewModel.dialog = await dialog_component_3.default.load(this);
            this.viewModel.onSalvar = async (titulo, conteudo) => {
                await this.service.salvar(titulo, conteudo);
                this.viewModel.dialog.openMsgBox({
                    titulo: "Salvar História",
                    icone: "bookmark_added",
                    mensagem: `
                    Gravação realizada com sucesso!
                    <br />
                    Sua história será avaliada antes de ser publicada.
                `,
                    ok: "ok"
                }, () => {
                    this.viewModel.clearData();
                    this.dispatchEvent(new Event("voltar"));
                });
            };
        }
    }
    exports.default = VisualizarNovaHistoriaComponent;
});
define("components/historias-visualizadas.component", ["require", "exports", "models/const.model", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, const_model_5, component_9, service_9, viewmodel_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_9 = __importDefault(component_9);
    service_9 = __importDefault(service_9);
    viewmodel_9 = __importDefault(viewmodel_9);
    class HistoriasVisualizadasViewModel extends viewmodel_9.default {
        historias;
        onApresentarHistoria = (historia) => { };
        constructor() {
            super();
            this.historias = this.getElement("historias");
        }
        apresentarHistorias(historias) {
            this.historias.innerHTML = "";
            historias.forEach(historia => {
                const titulo = document.createElement("span");
                const curtidas = document.createElement("span");
                titulo.innerText = historia.titulo;
                curtidas.innerHTML = historia.curtidas.toString();
                const row = document.createElement("div");
                row.append(titulo, curtidas);
                row.addEventListener("click", () => this.onApresentarHistoria(historia));
                this.historias.appendChild(row);
            });
        }
    }
    class HistoriasVisualizadasService extends service_9.default {
        obterHistoriasVisualizadas() {
            const historias = [
                {
                    titulo: "Primeira História",
                    conteudo: "Primeira\nHistória.",
                    situacao: const_model_5.HistoriaSituacaoAprovada,
                    visualizacoes: 30,
                    curtidas: 15,
                    motivoSituacao: null
                },
                {
                    titulo: "Segunda História",
                    conteudo: "Segunda\nHistória.",
                    situacao: const_model_5.HistoriaSituacaoAprovada,
                    visualizacoes: 37,
                    curtidas: 14,
                    motivoSituacao: null
                }
            ];
            return Promise.resolve(historias);
        }
    }
    class HistoriasVisualizadasComponent extends component_9.default {
        constructor() {
            super("historias-visualizadas");
        }
        async initialize() {
            await this.initializeResources(HistoriasVisualizadasViewModel, HistoriasVisualizadasService);
            const historias = await this.service.obterHistoriasVisualizadas();
            this.viewModel.apresentarHistorias(historias);
            this.viewModel.onApresentarHistoria = (historia) => this.dispatchEvent(new CustomEvent("apresentarHistoriaVisualizada", { detail: historia }));
        }
    }
    exports.default = HistoriasVisualizadasComponent;
});
define("components/historia-visualizada.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_10, service_10, viewmodel_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_10 = __importDefault(component_10);
    service_10 = __importDefault(service_10);
    viewmodel_10 = __importDefault(viewmodel_10);
    class HistoriaVisualizadaViewModel extends viewmodel_10.default {
        curtir;
        _titulo;
        get titulo() { return this._titulo.innerText; }
        set titulo(value) { this._titulo.innerText = value; }
        onCurtir = () => { };
        constructor() {
            super();
            this._titulo = this.getElement("tituloHistoria");
            this.curtir = this.getElement("curtir");
            this.curtir.addEventListener("click", () => this.onCurtir());
        }
    }
    class HistoriaVisualizadaService extends service_10.default {
    }
    class HistoriaVisualizadaComponent extends component_10.default {
        constructor() {
            super("historia-visualizada");
        }
        async initialize() {
            await this.initializeResources(HistoriaVisualizadaViewModel, HistoriaVisualizadaService);
            this.viewModel.onCurtir = () => this.dispatchEvent(new Event("curtir"));
            this.addEventListener("initializeData", (ev) => {
                const historia = ev.detail;
                this.viewModel.titulo = historia.titulo;
            });
        }
    }
    exports.default = HistoriaVisualizadaComponent;
});
define("components/pendentes-aprovacao.component", ["require", "exports", "models/request.model", "services/api.service", "components/base/component", "components/base/service", "components/base/viewmodel", "components/dialog.component"], function (require, exports, request_model_1, api_service_6, component_11, service_11, viewmodel_11, dialog_component_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    api_service_6 = __importDefault(api_service_6);
    component_11 = __importDefault(component_11);
    service_11 = __importDefault(service_11);
    viewmodel_11 = __importDefault(viewmodel_11);
    dialog_component_4 = __importDefault(dialog_component_4);
    class PendentesAprovacaoViewModel extends viewmodel_11.default {
        tituloPendente;
        conteudoPendente;
        aprovar;
        reprovar;
        dialog;
        historia;
        onModerar = (request) => { };
        constructor() {
            super();
            this.tituloPendente = this.getElement("tituloPendente");
            this.conteudoPendente = this.getElement("conteudoPendente");
            this.aprovar = this.getElement("aprovar");
            this.reprovar = this.getElement("reprovar");
            this.aprovar.addEventListener("click", () => {
                this.dialog?.openMsgBox({
                    titulo: "Aprovar",
                    icone: "bookmark_add",
                    mensagem: "Confirma a aprovação da história?",
                    cancel: "Cancelar",
                    ok: "Aprovar"
                }, () => this.onModerar({ idHistoria: this.historia.id, idSituacao: request_model_1.Situacao.aprovada }));
            });
            this.reprovar.addEventListener("click", () => {
                this.dialog?.openInputBox({
                    titulo: "Reprovar",
                    icone: "bookmark_remove",
                    mensagem: "Informe o motivo da reprovação desta história",
                    cancel: "Cancelar",
                    ok: "Reprovar"
                }, (inputText) => this.onModerar({ idHistoria: this.historia.id, idSituacao: request_model_1.Situacao.reprovada, motivoModeracao: inputText }));
            });
        }
        apresentarHistoria(historia) {
            if (historia.id > 0) {
                this.tituloPendente.innerText = historia.titulo;
                this.conteudoPendente.innerHTML = "";
                const values = historia.conteudo.split(/\r?\n/);
                values.forEach(v => {
                    const p = document.createElement("p");
                    p.innerHTML = v;
                    this.conteudoPendente.appendChild(p);
                });
                this.historia = historia;
                this.aprovar.disabled = false;
                this.reprovar.disabled = false;
            }
            else {
                this.tituloPendente.innerText = "-- Fim das Histórias --";
                this.conteudoPendente.innerHTML = "";
                const p = document.createElement("p");
                p.innerText = "Não existem mais histórias pendentes de aprovação.";
                this.historia = undefined;
                this.aprovar.disabled = true;
                this.reprovar.disabled = true;
            }
        }
    }
    class PendentesAprovacaoService extends service_11.default {
        apiModerador;
        constructor() {
            super();
            this.apiModerador = new api_service_6.default("moderador");
        }
        obterHistoria() {
            return this.apiModerador.doGet();
        }
        moderar(request) {
            return this.apiModerador.doPut(request);
        }
    }
    class PendentesAprovacaoComponent extends component_11.default {
        constructor() {
            super("pendentes-aprovacao");
        }
        async initialize() {
            await this.initializeResources(PendentesAprovacaoViewModel, PendentesAprovacaoService);
            this.viewModel.dialog = await dialog_component_4.default.load(this);
            await this.apresentarHistoria();
            this.viewModel.onModerar = async (request) => {
                await this.service.moderar(request);
                const aprovada = request.idSituacao == request_model_1.Situacao.aprovada;
                this.viewModel.dialog.openMsgBox({
                    titulo: aprovada ? "História Aprovada" : "História Reprovada",
                    mensagem: aprovada ? "A história foi aprovada." : "A história foi reprovada.",
                    icone: aprovada ? "bookmark_add" : "bookmark_remove",
                    cancel: "Encerrar Moderação",
                    ok: "Próxima História"
                }, async () => {
                    await this.apresentarHistoria();
                }, () => {
                    this.dispatchEvent(new Event("voltar"));
                });
            };
        }
        async apresentarHistoria() {
            const historia = await this.service.obterHistoria();
            this.viewModel.apresentarHistoria(historia);
        }
    }
    exports.default = PendentesAprovacaoComponent;
});
define("components/acesso.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_12, service_12, viewmodel_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_12 = __importDefault(component_12);
    service_12 = __importDefault(service_12);
    viewmodel_12 = __importDefault(viewmodel_12);
    class AcessoViewModel extends viewmodel_12.default {
        constructor() {
            super();
        }
    }
    class AcessoService extends service_12.default {
    }
    class AcessoComponent extends component_12.default {
        constructor() {
            super("Acesso");
        }
        async initialize() {
            await this.initializeResources(AcessoViewModel, AcessoService);
        }
    }
    exports.default = AcessoComponent;
});
define("app", ["require", "exports", "components/header.component", "components/index.component", "models/const.model", "components/intro.component", "components/nova-historia.component", "components/minhas-historias.component", "components/minha-historia.component", "components/visualizar-nova-historia.component", "components/historias-visualizadas.component", "components/historia-visualizada.component", "components/pendentes-aprovacao.component", "components/acesso.component", "services/token.service"], function (require, exports, header_component_1, index_component_1, const_model_6, intro_component_1, nova_historia_component_1, minhas_historias_component_1, minha_historia_component_1, visualizar_nova_historia_component_1, historias_visualizadas_component_1, historia_visualizada_component_1, pendentes_aprovacao_component_1, acesso_component_1, token_service_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    header_component_1 = __importDefault(header_component_1);
    index_component_1 = __importDefault(index_component_1);
    intro_component_1 = __importDefault(intro_component_1);
    nova_historia_component_1 = __importDefault(nova_historia_component_1);
    minhas_historias_component_1 = __importDefault(minhas_historias_component_1);
    minha_historia_component_1 = __importDefault(minha_historia_component_1);
    visualizar_nova_historia_component_1 = __importDefault(visualizar_nova_historia_component_1);
    historias_visualizadas_component_1 = __importDefault(historias_visualizadas_component_1);
    historia_visualizada_component_1 = __importDefault(historia_visualizada_component_1);
    pendentes_aprovacao_component_1 = __importDefault(pendentes_aprovacao_component_1);
    acesso_component_1 = __importDefault(acesso_component_1);
    token_service_2 = __importDefault(token_service_2);
    class App {
        mainElement;
        headerComponent;
        currentComponent = null;
        constructor() {
            this.mainElement = document.querySelector("main");
            document.addEventListener("unauthorized", () => {
                localStorage.clear();
                this.intro();
            });
            this.headerComponent = this.header();
            if (location.pathname !== "/")
                history.pushState({}, "", "/");
        }
        header() {
            customElements.define("header-component", header_component_1.default);
            const headerComponent = document.createElement("header-component");
            const headerElement = document.querySelector("header");
            headerElement.appendChild(headerComponent);
            headerComponent.addEventListener(const_model_6.headerMenuClick, () => this.currentComponent?.dispatchEvent(new Event(const_model_6.headerMenuClick)));
            headerComponent.addEventListener(const_model_6.headerVoltarClick, () => this.currentComponent?.dispatchEvent(new Event(const_model_6.headerVoltarClick)));
            headerComponent.addEventListener("initialized", () => {
                this.load();
                this.currentComponent?.addEventListener("initialized", () => {
                    this.footer();
                });
            });
            return headerComponent;
        }
        load() {
            const currentComponentName = localStorage.getItem("currentComponentName");
            switch (currentComponentName) {
                case "nova-historia-component":
                    this.novaHistoria();
                    break;
                case "visualizar-nova-historia-component":
                    this.visualizarNovaHistoria();
                    break;
                case "minhas-historias-component":
                    this.minhasHistorias();
                    break;
                case "minha-historia-component":
                    this.minhaHistoria();
                    break;
                case "historias-visualizadas-component":
                case "historia-visualizada-component":
                    this.historiasVisualizadas();
                    break;
                case "pendentes-aprovacao-component":
                    this.pendentesAprovacao();
                    break;
                case "acesso-component":
                    this.acesso();
                    break;
                default:
                    this.intro();
                    break;
            }
        }
        loadComponent(name, constructor, titulo = null, exibirVoltar = false, exibirMenu = false) {
            localStorage.setItem("currentComponentName", name);
            const headerConfig = { titulo: titulo ?? "Nossas Histórias", exibirVoltar: exibirVoltar, exibirMenu: exibirMenu };
            this.headerComponent.dispatchEvent(new CustomEvent("config", { detail: headerConfig }));
            if (!customElements.get(name))
                customElements.define(name, constructor);
            this.currentComponent?.remove();
            this.currentComponent = document.createElement(name);
            this.mainElement.appendChild(this.currentComponent);
            return this.currentComponent;
        }
        loadIfCurrent(component, load, preLoad) {
            if (this.currentComponent === component) {
                if (preLoad)
                    preLoad();
                load();
            }
        }
        footer() {
            const div = document.querySelector("#footer");
            div?.classList.remove("oculto");
        }
        intro() {
            if (token_service_2.default.possuiToken()) {
                this.index();
            }
            else {
                const component = this.loadComponent("intro-component", intro_component_1.default);
                component.addEventListener("entrar", () => this.index());
            }
        }
        index() {
            const component = this.loadComponent("index-component", index_component_1.default, null, false, true);
            component.addEventListener("novaHistoria", () => this.novaHistoria());
            component.addEventListener("minhasHistorias", () => this.minhasHistorias());
            component.addEventListener("historiasVisualizadas", () => this.historiasVisualizadas());
            component.addEventListener("pendentesAprovacao", () => this.pendentesAprovacao());
            component.addEventListener("acesso", () => this.acesso());
            component.addEventListener("voltar", () => {
            });
        }
        novaHistoria() {
            const component = this.loadComponent("nova-historia-component", nova_historia_component_1.default, "Compartilhar uma História", true);
            this.headerComponent.addEventListener(const_model_6.headerVoltarClick, () => this.loadIfCurrent(component, this.index.bind(this)));
            component.addEventListener("visualizar", () => this.visualizarNovaHistoria());
        }
        visualizarNovaHistoria() {
            const component = this.loadComponent("visualizar-nova-historia-component", visualizar_nova_historia_component_1.default, "Visualizar História", true);
            this.headerComponent.addEventListener(const_model_6.headerVoltarClick, () => this.loadIfCurrent(component, this.novaHistoria.bind(this)));
            component.addEventListener("voltar", () => this.index());
        }
        minhasHistorias() {
            const component = this.loadComponent("minhas-historias-component", minhas_historias_component_1.default, "Minhas Histórias", true);
            this.headerComponent.addEventListener(const_model_6.headerVoltarClick, () => {
                this.loadIfCurrent(component, this.index.bind(this), () => {
                    localStorage.removeItem(const_model_6.localStorageKey_minhasHistorias_pagina);
                });
            });
            component.addEventListener("apresentarHistoria", (ev) => {
                const historia = ev.detail;
                this.minhaHistoria(historia);
            });
        }
        minhaHistoria(historia) {
            const component = this.loadComponent("minha-historia-component", minha_historia_component_1.default, "Minha História", true);
            this.headerComponent.addEventListener(const_model_6.headerVoltarClick, () => this.loadIfCurrent(component, this.minhasHistorias.bind(this), () => localStorage.removeItem(const_model_6.localStorageKey_minhaHistoria_historia)));
            component.addEventListener("voltar", () => {
                this.minhasHistorias();
                localStorage.removeItem(const_model_6.localStorageKey_minhaHistoria_historia);
            });
            if (historia) {
                component.addEventListener("initialized", () => component.dispatchEvent(new CustomEvent("initializeData", { detail: historia })));
            }
        }
        historiasVisualizadas() {
            const component = this.loadComponent("historias-visualizadas-component", historias_visualizadas_component_1.default, "Histórias Visualizadas", true);
            this.headerComponent.addEventListener(const_model_6.headerVoltarClick, () => this.loadIfCurrent(component, this.index.bind(this)));
            component.addEventListener("apresentarHistoriaVisualizada", (ev) => {
                const historia = ev.detail;
                this.historiaVisualizada(historia);
            });
        }
        historiaVisualizada(historia) {
            const component = this.loadComponent("historia-visualizada-component", historia_visualizada_component_1.default, "História Visualizada", true);
            this.headerComponent.addEventListener(const_model_6.headerVoltarClick, () => this.loadIfCurrent(component, this.historiasVisualizadas.bind(this)));
            component.addEventListener("curtir", () => this.historiasVisualizadas());
            component.addEventListener("initialized", () => component.dispatchEvent(new CustomEvent("initializeData", { detail: historia })));
        }
        pendentesAprovacao() {
            const component = this.loadComponent("pendentes-aprovacao-component", pendentes_aprovacao_component_1.default, "Pendentes de Aprovação", true);
            this.headerComponent.addEventListener(const_model_6.headerVoltarClick, () => this.loadIfCurrent(component, this.index.bind(this)));
            component.addEventListener("voltar", () => this.loadIfCurrent(component, this.index.bind(this)));
        }
        acesso() {
            const component = this.loadComponent("acesso-component", acesso_component_1.default, "Dados de Acesso", true);
            this.headerComponent.addEventListener(const_model_6.headerVoltarClick, () => this.loadIfCurrent(component, this.index.bind(this)));
        }
    }
    const main = () => new App();
    exports.default = main;
});
define("models/extensions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Object.defineProperty(Number.prototype, "fmt", {
        get: function () {
            return this.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        enumerable: false,
        configurable: true
    });
});
//# sourceMappingURL=app.js.map