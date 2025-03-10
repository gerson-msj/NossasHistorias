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
define("models/model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                return false;
            }
        }
        initializeResources(viewModel, service) {
            this._service = new service();
            this._viewModel = new viewModel();
            return Promise.resolve();
        }
        dispatch(event, eventName) {
            event = () => this.dispatchEvent(new Event(eventName));
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
define("components/index.component", ["require", "exports", "models/const.model", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, const_model_2, component_2, service_2, viewmodel_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_2 = __importDefault(component_2);
    service_2 = __importDefault(service_2);
    viewmodel_2 = __importDefault(viewmodel_2);
    class IndexViewModel extends viewmodel_2.default {
        menuContainer;
        menuBackdrop;
        novaHistoria;
        minhasHistorias;
        onNovaHistoria = () => { };
        onMinhasHistorias = () => { };
        constructor() {
            super();
            this.menuContainer = this.getElement("menuContainer");
            this.menuBackdrop = this.getElement("menuBackdrop");
            this.novaHistoria = this.getElement("novaHistoria");
            this.minhasHistorias = this.getElement("minhasHistorias");
            this.menuBackdrop.addEventListener("click", () => this.ocultarMenu());
            this.novaHistoria.addEventListener("click", () => this.onNovaHistoria());
            this.minhasHistorias.addEventListener("click", () => this.onMinhasHistorias());
        }
        exibirMenu() {
            this.menuContainer.classList.remove("oculto");
        }
        ocultarMenu() {
            this.menuContainer.classList.add("oculto");
        }
    }
    class IndexService extends service_2.default {
    }
    class IndexComponent extends component_2.default {
        constructor() {
            super("index");
        }
        async initialize() {
            await this.initializeResources(IndexViewModel, IndexService);
            this.addEventListener(const_model_2.headerMenuClick, () => this.viewModel.exibirMenu());
            this.viewModel.onNovaHistoria = () => this.dispatchEvent(new Event("novaHistoria"));
            this.viewModel.onMinhasHistorias = () => this.dispatchEvent(new Event("minhasHistorias"));
        }
    }
    exports.default = IndexComponent;
});
define("components/about.component", ["require", "exports", "models/const.model", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, const_model_3, component_3, service_3, viewmodel_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_3 = __importDefault(component_3);
    service_3 = __importDefault(service_3);
    viewmodel_3 = __importDefault(viewmodel_3);
    class AboutViewModel extends viewmodel_3.default {
    }
    class AboutService extends service_3.default {
    }
    class AboutComponent extends component_3.default {
        constructor() {
            super("about");
        }
        async initialize() {
            await this.initializeResources(AboutViewModel, AboutService);
            this.addEventListener(const_model_3.headerVoltarClick, () => this.dispatchEvent(new Event("voltar")));
        }
    }
    exports.default = AboutComponent;
});
define("components/intro.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_4, service_4, viewmodel_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    }
    class IntroComponent extends component_4.default {
        constructor() {
            super("intro");
        }
        async initialize() {
            await this.initializeResources(IntroViewModel, IntroService);
            this.viewModel.onEntrar = () => this.dispatchEvent(new Event("entrar"));
            localStorage.setItem("intro", "true");
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
define("components/visualizar-historia.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_6, service_6, viewmodel_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_6 = __importDefault(component_6);
    service_6 = __importDefault(service_6);
    viewmodel_6 = __importDefault(viewmodel_6);
    class VisualizarHistoriaViewModel extends viewmodel_6.default {
        salvar;
        onSalvar = () => { };
        constructor() {
            super();
            this.salvar = this.getElement("salvar");
            this.salvar.addEventListener("click", () => this.onSalvar());
        }
    }
    class VisualizarHistoriaService extends service_6.default {
    }
    class VisualizarHistoriaComponent extends component_6.default {
        constructor() {
            super("visualizar-historia");
        }
        async initialize() {
            await this.initializeResources(VisualizarHistoriaViewModel, VisualizarHistoriaService);
            this.viewModel.onSalvar = () => this.dispatchEvent(new Event("salvar"));
        }
    }
    exports.default = VisualizarHistoriaComponent;
});
define("components/minhas-historias.component", ["require", "exports", "models/const.model", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, const_model_4, component_7, service_7, viewmodel_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_7 = __importDefault(component_7);
    service_7 = __importDefault(service_7);
    viewmodel_7 = __importDefault(viewmodel_7);
    class MinhasHistoriasViewModel extends viewmodel_7.default {
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
    class MinhasHistoriasService extends service_7.default {
        obterMinhasHistorias() {
            const historias = [
                {
                    titulo: "Primeira História",
                    conteudo: "Primeira\nHistória.",
                    situacao: const_model_4.HistoriaSituacaoAnalise,
                    visualizacoes: 0,
                    curtidas: 0,
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
    class MinhasHistoriasComponent extends component_7.default {
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
define("components/minha-historia.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_8, service_8, viewmodel_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_8 = __importDefault(component_8);
    service_8 = __importDefault(service_8);
    viewmodel_8 = __importDefault(viewmodel_8);
    class MinhaHistoriaViewModel extends viewmodel_8.default {
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
    class MinhaHistoriaService extends service_8.default {
    }
    class MinhaHistoriaComponent extends component_8.default {
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
define("app", ["require", "exports", "components/header.component", "components/index.component", "models/const.model", "components/intro.component", "components/nova-historia.component", "components/visualizar-historia.component", "components/minhas-historias.component", "components/minha-historia.component"], function (require, exports, header_component_1, index_component_1, const_model_5, intro_component_1, nova_historia_component_1, visualizar_historia_component_1, minhas_historias_component_1, minha_historia_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    header_component_1 = __importDefault(header_component_1);
    index_component_1 = __importDefault(index_component_1);
    intro_component_1 = __importDefault(intro_component_1);
    nova_historia_component_1 = __importDefault(nova_historia_component_1);
    visualizar_historia_component_1 = __importDefault(visualizar_historia_component_1);
    minhas_historias_component_1 = __importDefault(minhas_historias_component_1);
    minha_historia_component_1 = __importDefault(minha_historia_component_1);
    class App {
        mainElement;
        loadedComponents = [];
        headerComponent;
        currentComponent = null;
        constructor() {
            this.mainElement = document.querySelector("main");
            document.addEventListener("unauthorized", () => this.index());
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
                    this.visualizarHistoria();
                    break;
                case "minhas-historias-component":
                case "minha-historia-component":
                    this.minhasHistorias();
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
            const introVisualizada = localStorage.getItem("intro");
            if (introVisualizada) {
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
        }
        novaHistoria() {
            const component = this.loadComponent("nova-historia-component", nova_historia_component_1.default, "Compartilhar uma História", true);
            this.headerComponent.addEventListener(const_model_5.headerVoltarClick, () => this.index());
            component.addEventListener("visualizar", () => this.visualizarHistoria());
        }
        visualizarHistoria() {
            const component = this.loadComponent("visualizar-historia-component", visualizar_historia_component_1.default, "Visualizar História", true);
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
define("services/api.service", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            const token = localStorage.getItem("token");
            const headers = { "content-type": "application/json; charset=utf-8" };
            if (token !== null)
                headers["authorization"] = `Bearer ${token}`;
            return headers;
        }
    }
    exports.default = ApiService;
});
define("services/token.service", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TokenService {
        static VerificarToken(perfil) {
            const tokenSub = this.obterTokenSubject();
            if (tokenSub == null || tokenSub.perfil != perfil) {
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
//# sourceMappingURL=app.js.map