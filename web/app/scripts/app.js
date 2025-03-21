"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("models/const.model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tokenLSKey = exports.headerMenuVisible = exports.headerVoltarClick = exports.headerMenuClick = exports.PerfilDep = exports.PerfilResp = exports.HistoriaSituacaoReprovada = exports.HistoriaSituacaoAprovada = exports.HistoriaSituacaoAnalise = void 0;
    exports.HistoriaSituacaoAnalise = "Em analise";
    exports.HistoriaSituacaoAprovada = "Aprovada";
    exports.HistoriaSituacaoReprovada = "Reprovada";
    exports.PerfilResp = "Resp";
    exports.PerfilDep = "Dep";
    exports.headerMenuClick = "headerMenuClick";
    exports.headerVoltarClick = "headerVoltarClick";
    exports.headerMenuVisible = "headermenuVisible";
    exports.tokenLSKey = "token";
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
        constructor() { }
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
        icone;
        titulo;
        menu;
        cssPointer = "pointer";
        cssOculto = "oculto";
        onMenuClick = () => { };
        onVoltarClick = () => { };
        constructor() {
            super();
            this.icone = this.getElement("icone");
            this.titulo = this.getElement("titulo");
            this.menu = this.getElement("menu");
            this.menu.addEventListener("click", () => this.onMenuClick());
            this.icone.addEventListener("click", () => {
                if (this.icone.innerText == "chevron_left")
                    this.onVoltarClick();
            });
        }
        config(headerConfig) {
            this.titulo.innerText = headerConfig.titulo;
            if (headerConfig.exibirVoltar) {
                this.icone.innerText = "chevron_left";
                if (!this.icone.classList.contains(this.cssPointer))
                    this.icone.classList.add(this.cssPointer);
            }
            else {
                this.icone.innerText = "auto_stories";
                if (this.icone.classList.contains(this.cssPointer))
                    this.icone.classList.remove(this.cssPointer);
            }
            const estaOculto = this.menu.classList.contains(this.cssOculto);
            if (headerConfig.exibirMenu && estaOculto)
                this.menu.classList.remove(this.cssOculto);
            else if (!headerConfig.exibirMenu && !estaOculto)
                this.menu.classList.add(this.cssOculto);
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
        }
        async doGet(searchParams = null) {
            const url = searchParams ? `${this.baseUrl}?${searchParams}` : this.baseUrl;
            const response = await fetch(url, {
                method: "GET",
                headers: this.getHeaders()
            });
            return this.getResult(response);
        }
        async doPost(obj, bearer = null) {
            const response = await fetch(this.baseUrl, {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify(obj)
            });
            const data = await response.json();
            return data;
        }
        async doPut(request) {
            const response = await fetch(this.baseUrl, {
                method: "PUT",
                headers: this.getHeaders(),
                body: JSON.stringify(request)
            });
            return this.getResult(response);
        }
        async getResult(response) {
            if (response.ok) {
                const data = await response.json();
                return data;
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
            if (token_service_1.default.verificarToken())
                token = localStorage.getItem("token");
            if (token !== null)
                headers["authorization"] = `Bearer ${token}`;
            return headers;
        }
    }
    exports.default = ApiService;
});
define("components/dialog.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_2, service_2, viewmodel_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_2 = __importDefault(component_2);
    service_2 = __importDefault(service_2);
    viewmodel_2 = __importDefault(viewmodel_2);
    class DialogViewModel extends viewmodel_2.default {
        _dialogTitulo;
        _dialogMensagem;
        get dialogTitulo() { return this._dialogTitulo.innerText; }
        set dialogTitulo(value) { this._dialogTitulo.innerText = value; }
        get dialogMensagem() { return this._dialogMensagem.innerText; }
        set dialogMensagem(value) { this._dialogMensagem.innerText = value; }
        constructor() {
            super();
            this._dialogTitulo = this.getElement("dialogTitulo");
            this._dialogMensagem = this.getElement("dialogMensagem");
        }
    }
    class DialogService extends service_2.default {
    }
    class DialogComponent extends component_2.default {
        set titulo(value) { this.viewModel.dialogTitulo = value; }
        constructor() {
            super("dialog");
        }
        async initialize() {
            await this.initializeResources(DialogViewModel, DialogService);
        }
    }
    exports.default = DialogComponent;
});
define("components/index.component", ["require", "exports", "models/const.model", "services/api.service", "components/base/component", "components/base/service", "components/base/viewmodel", "components/dialog.component"], function (require, exports, const_model_2, api_service_1, component_3, service_3, viewmodel_3, dialog_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    api_service_1 = __importDefault(api_service_1);
    component_3 = __importDefault(component_3);
    service_3 = __importDefault(service_3);
    viewmodel_3 = __importDefault(viewmodel_3);
    dialog_component_1 = __importDefault(dialog_component_1);
    class IndexViewModel extends viewmodel_3.default {
        menuContainer;
        menuBackdrop;
        novaHistoria;
        minhasHistorias;
        historiasVisualizadas;
        pendentesAprovacao;
        acesso;
        dialog;
        onNovaHistoria = () => { };
        onMinhasHistorias = () => { };
        onHistoriasVisualizadas = () => { };
        onPendentesAprovacao = () => { };
        onAcesso = () => { };
        constructor() {
            super();
            this.menuContainer = this.getElement("menuContainer");
            this.menuBackdrop = this.getElement("menuBackdrop");
            this.novaHistoria = this.getElement("novaHistoria");
            this.minhasHistorias = this.getElement("minhasHistorias");
            this.historiasVisualizadas = this.getElement("historiasVisualizadas");
            this.pendentesAprovacao = this.getElement("pendentesAprovacao");
            this.acesso = this.getElement("acesso");
            customElements.define("dialog-component", dialog_component_1.default);
            this.dialog = this.getElement("dialog");
            this.menuBackdrop.addEventListener("click", () => this.ocultarMenu());
            this.novaHistoria.addEventListener("click", () => this.onNovaHistoria());
            this.minhasHistorias.addEventListener("click", () => this.onMinhasHistorias());
            this.historiasVisualizadas.addEventListener("click", () => this.onHistoriasVisualizadas());
            this.pendentesAprovacao.addEventListener("click", () => this.onPendentesAprovacao());
            this.acesso?.addEventListener("click", () => this.onAcesso());
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
        popup(titulo) {
            this.dialog.titulo = titulo;
        }
    }
    class IndexService extends service_3.default {
        apiUsuario;
        constructor() {
            super();
            this.apiUsuario = new api_service_1.default("usuario");
        }
        obterUsuario() {
            return this.apiUsuario.doGet();
        }
    }
    class IndexComponent extends component_3.default {
        constructor() {
            super("index");
        }
        async initialize() {
            await this.initializeResources(IndexViewModel, IndexService);
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
            this.viewModel.popup("Novo Título");
        }
    }
    exports.default = IndexComponent;
});
define("components/intro.component", ["require", "exports", "services/api.service", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, api_service_2, component_4, service_4, viewmodel_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    api_service_2 = __importDefault(api_service_2);
    component_4 = __importDefault(component_4);
    service_4 = __importDefault(service_4);
    viewmodel_4 = __importDefault(viewmodel_4);
    class IntroViewModel extends viewmodel_4.default {
        entrar;
        onEntrar = () => { };
        constructor() {
            super();
            this.entrar = this.getElement("entrar");
            this.entrar.addEventListener("click", () => this.onEntrar());
        }
    }
    class IntroService extends service_4.default {
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
    class IntroComponent extends component_4.default {
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
define("components/nova-historia.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_5, service_5, viewmodel_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_5 = __importDefault(component_5);
    service_5 = __importDefault(service_5);
    viewmodel_5 = __importDefault(viewmodel_5);
    class NovaHistoriaViewModel extends viewmodel_5.default {
        visualizar;
        onVisualizar = () => { };
        constructor() {
            super();
            this.visualizar = this.getElement("visualizar");
            this.visualizar.addEventListener("click", () => this.onVisualizar());
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
            //this.dispatch(this.viewModel.onVisualizar, "visualizar");
        }
    }
    exports.default = NovaHistoriaComponent;
});
define("models/model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/minhas-historias.component", ["require", "exports", "models/const.model", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, const_model_3, component_6, service_6, viewmodel_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_6 = __importDefault(component_6);
    service_6 = __importDefault(service_6);
    viewmodel_6 = __importDefault(viewmodel_6);
    class MinhasHistoriasViewModel extends viewmodel_6.default {
        historias;
        onApresentarHistoria = (titulo) => { };
        constructor() {
            super();
            this.historias = this.getElement("historias");
        }
        apresentarHistorias(historias) {
            this.historias.innerHTML = "";
            historias.forEach(historia => {
                const titulo = document.createElement("span");
                const situacao = document.createElement("span");
                const curtidas = document.createElement("span");
                titulo.innerText = historia.titulo;
                situacao.innerText = historia.situacao;
                curtidas.innerHTML = historia.curtidas.toString();
                const row = document.createElement("div");
                row.append(titulo, situacao, curtidas);
                row.addEventListener("click", () => this.onApresentarHistoria(historia.titulo));
                this.historias.appendChild(row);
            });
        }
    }
    class MinhasHistoriasService extends service_6.default {
        obterMinhasHistorias() {
            const historias = [
                {
                    titulo: "Primeira História",
                    conteudo: "Primeira\nHistória.",
                    situacao: const_model_3.HistoriaSituacaoAnalise,
                    visualizacoes: 0,
                    curtidas: 0,
                    motivoSituacao: null
                },
                {
                    titulo: "Segunda História",
                    conteudo: "Segunda\nHistória.",
                    situacao: const_model_3.HistoriaSituacaoAprovada,
                    visualizacoes: 37,
                    curtidas: 14,
                    motivoSituacao: null
                }
            ];
            return Promise.resolve(historias);
        }
    }
    class MinhasHistoriasComponent extends component_6.default {
        constructor() {
            super("minhas-historias");
        }
        async initialize() {
            await this.initializeResources(MinhasHistoriasViewModel, MinhasHistoriasService);
            const historias = await this.service.obterMinhasHistorias();
            this.viewModel.apresentarHistorias(historias);
            this.viewModel.onApresentarHistoria = (titulo) => this.dispatchEvent(new CustomEvent("apresentarHistoria", { detail: titulo }));
        }
    }
    exports.default = MinhasHistoriasComponent;
});
define("components/minha-historia.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_7, service_7, viewmodel_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_7 = __importDefault(component_7);
    service_7 = __importDefault(service_7);
    viewmodel_7 = __importDefault(viewmodel_7);
    class MinhaHistoriaViewModel extends viewmodel_7.default {
        excluir;
        _titulo;
        get titulo() { return this._titulo.innerText; }
        set titulo(value) { this._titulo.innerText = value; }
        onExcluir = () => { };
        constructor() {
            super();
            this._titulo = this.getElement("tituloHistoria");
            this.excluir = this.getElement("excluir");
            this.excluir.addEventListener("click", () => this.onExcluir());
        }
    }
    class MinhaHistoriaService extends service_7.default {
    }
    class MinhaHistoriaComponent extends component_7.default {
        constructor() {
            super("minha-historia");
        }
        async initialize() {
            await this.initializeResources(MinhaHistoriaViewModel, MinhaHistoriaService);
            this.viewModel.onExcluir = () => this.dispatchEvent(new Event("excluir"));
            this.addEventListener("initializeData", (ev) => {
                const titulo = ev.detail;
                this.viewModel.titulo = titulo;
            });
        }
    }
    exports.default = MinhaHistoriaComponent;
});
define("components/visualizar-nova-historia.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_8, service_8, viewmodel_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_8 = __importDefault(component_8);
    service_8 = __importDefault(service_8);
    viewmodel_8 = __importDefault(viewmodel_8);
    class VisualizarNovaHistoriaViewModel extends viewmodel_8.default {
        salvar;
        onSalvar = () => { };
        constructor() {
            super();
            this.salvar = this.getElement("salvar");
            this.salvar.addEventListener("click", () => this.onSalvar());
        }
    }
    class VisualizarNovaHistoriaService extends service_8.default {
    }
    class VisualizarNovaHistoriaComponent extends component_8.default {
        constructor() {
            super("visualizar-nova-historia");
        }
        async initialize() {
            await this.initializeResources(VisualizarNovaHistoriaViewModel, VisualizarNovaHistoriaService);
            this.viewModel.onSalvar = () => this.dispatchEvent(new Event("salvar"));
        }
    }
    exports.default = VisualizarNovaHistoriaComponent;
});
define("components/historias-visualizadas.component", ["require", "exports", "models/const.model", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, const_model_4, component_9, service_9, viewmodel_9) {
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
                    situacao: const_model_4.HistoriaSituacaoAprovada,
                    visualizacoes: 30,
                    curtidas: 15,
                    motivoSituacao: null
                },
                {
                    titulo: "Segunda História",
                    conteudo: "Segunda\nHistória.",
                    situacao: const_model_4.HistoriaSituacaoAprovada,
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
define("components/historia-visualizada.component copy", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_10, service_10, viewmodel_10) {
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
define("components/pendentes-aprovacao.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_11, service_11, viewmodel_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_11 = __importDefault(component_11);
    service_11 = __importDefault(service_11);
    viewmodel_11 = __importDefault(viewmodel_11);
    class PendentesAprovacaoViewModel extends viewmodel_11.default {
        aprovar;
        reprovar;
        motivoReprovacao;
        onAprovar = () => { };
        onReprovar = (motivoReprovacao) => { };
        constructor() {
            super();
            this.aprovar = this.getElement("aprovar");
            this.reprovar = this.getElement("reprovar");
            this.motivoReprovacao = this.getElement("motivoReprovacao");
            this.aprovar.addEventListener("click", () => this.onAprovar());
            this.reprovar.addEventListener("click", () => this.onReprovar(this.motivoReprovacao.value));
        }
    }
    class PendentesAprovacaoService extends service_11.default {
    }
    class PendentesAprovacaoComponent extends component_11.default {
        constructor() {
            super("pendentes-aprovacao");
        }
        async initialize() {
            await this.initializeResources(PendentesAprovacaoViewModel, PendentesAprovacaoService);
            this.viewModel.onAprovar = () => this.dispatchEvent(new Event("aprovar"));
            this.viewModel.onReprovar = (motivoReprovacao) => this.dispatchEvent(new Event("reprovar"));
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
define("app", ["require", "exports", "components/header.component", "components/index.component", "models/const.model", "components/intro.component", "components/nova-historia.component", "components/minhas-historias.component", "components/minha-historia.component", "components/visualizar-nova-historia.component", "components/historias-visualizadas.component", "components/historia-visualizada.component copy", "components/pendentes-aprovacao.component", "components/acesso.component", "services/token.service"], function (require, exports, header_component_1, index_component_1, const_model_5, intro_component_1, nova_historia_component_1, minhas_historias_component_1, minha_historia_component_1, visualizar_nova_historia_component_1, historias_visualizadas_component_1, historia_visualizada_component_copy_1, pendentes_aprovacao_component_1, acesso_component_1, token_service_2) {
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
    historia_visualizada_component_copy_1 = __importDefault(historia_visualizada_component_copy_1);
    pendentes_aprovacao_component_1 = __importDefault(pendentes_aprovacao_component_1);
    acesso_component_1 = __importDefault(acesso_component_1);
    token_service_2 = __importDefault(token_service_2);
    class App {
        mainElement;
        loadedComponents = [];
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
            headerComponent.addEventListener(const_model_5.headerMenuClick, () => this.currentComponent?.dispatchEvent(new Event(const_model_5.headerMenuClick)));
            headerComponent.addEventListener(const_model_5.headerVoltarClick, () => this.currentComponent?.dispatchEvent(new Event(const_model_5.headerVoltarClick)));
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
                case "visualizar-historia-component":
                    this.visualizarNovaHistoria();
                    break;
                case "minhas-historias-component":
                case "minha-historia-component":
                    this.minhasHistorias();
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
            if (!this.loadedComponents.includes(name)) {
                customElements.define(name, constructor);
                this.loadedComponents.push(name);
            }
            this.currentComponent?.remove();
            this.currentComponent = document.createElement(name);
            this.mainElement.appendChild(this.currentComponent);
            return this.currentComponent;
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
            this.headerComponent.addEventListener(const_model_5.headerVoltarClick, () => this.index());
            component.addEventListener("visualizar", () => this.visualizarNovaHistoria());
        }
        visualizarNovaHistoria() {
            const component = this.loadComponent("visualizar-nova-historia-component", visualizar_nova_historia_component_1.default, "Visualizar História", true);
            this.headerComponent.addEventListener(const_model_5.headerVoltarClick, () => this.novaHistoria());
            component.addEventListener("salvar", () => this.index());
        }
        minhasHistorias() {
            const component = this.loadComponent("minhas-historias-component", minhas_historias_component_1.default, "Minhas Histórias", true);
            this.headerComponent.addEventListener(const_model_5.headerVoltarClick, () => this.index());
            component.addEventListener("apresentarHistoria", (ev) => {
                const titulo = ev.detail;
                this.minhaHistoria(titulo);
            });
        }
        minhaHistoria(titulo) {
            const component = this.loadComponent("minha-historia-component", minha_historia_component_1.default, "Minha História", true);
            this.headerComponent.addEventListener(const_model_5.headerVoltarClick, () => this.minhasHistorias());
            component.addEventListener("excluir", () => this.minhasHistorias());
            component.addEventListener("initialized", () => component.dispatchEvent(new CustomEvent("initializeData", { detail: titulo })));
        }
        historiasVisualizadas() {
            const component = this.loadComponent("historias-visualizadas-component", historias_visualizadas_component_1.default, "Histórias Visualizadas", true);
            this.headerComponent.addEventListener(const_model_5.headerVoltarClick, () => this.index());
            component.addEventListener("apresentarHistoriaVisualizada", (ev) => {
                const historia = ev.detail;
                this.historiaVisualizada(historia);
            });
        }
        historiaVisualizada(historia) {
            const component = this.loadComponent("historia-visualizada-component", historia_visualizada_component_copy_1.default, "História Visualizada", true);
            this.headerComponent.addEventListener(const_model_5.headerVoltarClick, () => this.historiasVisualizadas());
            component.addEventListener("curtir", () => this.historiasVisualizadas());
            component.addEventListener("initialized", () => component.dispatchEvent(new CustomEvent("initializeData", { detail: historia })));
        }
        pendentesAprovacao() {
            const component = this.loadComponent("pendentes-aprovacao-component", pendentes_aprovacao_component_1.default, "Pendentes de Aprovação", true);
            this.headerComponent.addEventListener(const_model_5.headerVoltarClick, () => this.index());
            component.addEventListener("aprovar", () => this.index());
            component.addEventListener("reprovar", () => this.index());
        }
        acesso() {
            const component = this.loadComponent("acesso-component", acesso_component_1.default, "Dados de Acesso", true);
            this.headerComponent.addEventListener(const_model_5.headerVoltarClick, () => this.index());
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