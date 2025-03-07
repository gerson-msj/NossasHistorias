"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("models/const.model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tokenLSKey = exports.headerMenuVisible = exports.headerVoltarClick = exports.headerMenuClick = exports.PerfilDep = exports.PerfilResp = void 0;
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
define("components/index.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_2, service_2, viewmodel_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_2 = __importDefault(component_2);
    service_2 = __importDefault(service_2);
    viewmodel_2 = __importDefault(viewmodel_2);
    class IndexViewModel extends viewmodel_2.default {
        about;
        onAbout = () => { };
        constructor() {
            super();
            this.about = this.getElement("about");
            this.about.addEventListener("click", () => this.onAbout());
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
            this.viewModel.onAbout = () => this.dispatchEvent(new Event("about"));
        }
    }
    exports.default = IndexComponent;
});
define("components/about.component", ["require", "exports", "models/const.model", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, const_model_2, component_3, service_3, viewmodel_3) {
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
            this.addEventListener(const_model_2.headerVoltarClick, () => this.dispatchEvent(new Event("voltar")));
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
            //localStorage.setItem("intro", "true");
        }
    }
    exports.default = IntroComponent;
});
define("app", ["require", "exports", "components/header.component", "components/index.component", "components/about.component", "models/const.model", "components/intro.component"], function (require, exports, header_component_1, index_component_1, about_component_1, const_model_3, intro_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    header_component_1 = __importDefault(header_component_1);
    index_component_1 = __importDefault(index_component_1);
    about_component_1 = __importDefault(about_component_1);
    intro_component_1 = __importDefault(intro_component_1);
    class App {
        mainElement;
        loadedComponents = [];
        headerComponent;
        currentComponent = null;
        constructor() {
            this.mainElement = document.querySelector("main");
            document.addEventListener("unauthorized", () => this.index());
            this.headerComponent = this.header();
            // window.addEventListener("popstate", (ev: PopStateEvent) => {
            //     this.load();
            // });
            if (location.pathname !== "/")
                history.pushState({}, "", "/");
        }
        header() {
            customElements.define("header-component", header_component_1.default);
            const headerComponent = document.createElement("header-component");
            const headerElement = document.querySelector("header");
            headerElement.appendChild(headerComponent);
            headerComponent.addEventListener(const_model_3.headerMenuClick, () => this.currentComponent?.dispatchEvent(new Event(const_model_3.headerMenuClick)));
            headerComponent.addEventListener(const_model_3.headerVoltarClick, () => this.currentComponent?.dispatchEvent(new Event(const_model_3.headerVoltarClick)));
            headerComponent.addEventListener("initialized", () => {
                this.load();
                this.currentComponent?.addEventListener("initialized", () => {
                    this.footer();
                });
            });
            return headerComponent;
        }
        load() {
            //const path = location.pathname;
            const currentComponentName = localStorage.getItem("currentComponentName");
            // switch (location.pathname) {
            //     case "/about":
            //         this.about();
            //         break;
            //     default:
            //         this.index();
            //         break;
            // }
            switch (currentComponentName) {
                case "about-component":
                    this.about();
                    break;
                default:
                    this.intro();
                    break;
            }
        }
        loadComponent(name, constructor, titulo = null, exibirVoltar = false, exibirMenu = false) {
            localStorage.setItem("currentComponentName", name);
            //history.pushState({ currentComponentName: name }, name, path);
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
            const component = this.loadComponent("index-component", index_component_1.default);
            component.addEventListener("about", () => this.about());
        }
        about() {
            const component = this.loadComponent("about-component", about_component_1.default, null, true);
            component.addEventListener("voltar", () => this.index());
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