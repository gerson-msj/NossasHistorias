import HeaderComponent, { HeaderConfig } from "./components/header.component";
import IndexComponent from "./components/index.component";
import { headerMenuClick, headerVoltarClick } from "./models/const.model";
import IntroComponent from "./components/intro.component";
import NovaHistoriaComponent from "./components/nova-historia.component";
import MinhasHistoriasComponent from "./components/minhas-historias.component";
import MinhaHistoriaComponent from "./components/minha-historia.component";
import VisualizarNovaHistoriaComponent from "./components/visualizar-nova-historia.component";
import HistoriasVisualizadasComponent from "./components/historias-visualizadas.component";
import { HistoriaModel } from "./models/model";
import HistoriaVisualizadaComponent from "./components/historia-visualizada.component copy";
import PendentesAprovacaoComponent from "./components/pendentes-aprovacao.component";
import AcessoComponent from "./components/acesso.component";
import TokenService from "./services/token.service";

class App {
    private mainElement: HTMLElement;
    private headerComponent: HTMLElement;
    private currentComponent: HTMLElement | null = null;

    constructor() {
        this.mainElement = document.querySelector("main") as HTMLElement;
        document.addEventListener("unauthorized", () => {
            localStorage.clear();
            this.intro();
        });

        this.headerComponent = this.header();

        if (location.pathname !== "/")
            history.pushState({}, "", "/");
    }

    private header(): HTMLElement {
        customElements.define("header-component", HeaderComponent);
        const headerComponent = document.createElement("header-component");
        const headerElement = document.querySelector("header") as HTMLElement;
        headerElement.appendChild(headerComponent);

        headerComponent.addEventListener(headerMenuClick, () =>
            this.currentComponent?.dispatchEvent(new Event(headerMenuClick)));

        headerComponent.addEventListener(headerVoltarClick, () =>
            this.currentComponent?.dispatchEvent(new Event(headerVoltarClick)));

        headerComponent.addEventListener("initialized", () => {
            this.load();
            this.currentComponent?.addEventListener("initialized", () => {
                this.footer();
            });
        });

        return headerComponent;
    }

    private load() {
        const currentComponentName = localStorage.getItem("currentComponentName");
        switch (currentComponentName) {
            case "nova-historia-component":
                this.novaHistoria();
                break;
            case "visualizar-nova-historia-component":
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

    private loadComponent(
        name: string,
        constructor: CustomElementConstructor,
        titulo: string | null = null,
        exibirVoltar: boolean = false,
        exibirMenu: boolean = false): HTMLElement {

        localStorage.setItem("currentComponentName", name);
        const headerConfig: HeaderConfig = { titulo: titulo ?? "Nossas Histórias", exibirVoltar: exibirVoltar, exibirMenu: exibirMenu };
        this.headerComponent.dispatchEvent(new CustomEvent("config", { detail: headerConfig }));

        if(!customElements.get(name))
            customElements.define(name, constructor);

        this.currentComponent?.remove();
        this.currentComponent = document.createElement(name);
        this.mainElement.appendChild(this.currentComponent);

        return this.currentComponent;

    }

    private loadIfCurrent(component: HTMLElement, load: () => void) {
        if (this.currentComponent === component)
            load();
    }

    private footer() {
        const div = document.querySelector("#footer");
        div?.classList.remove("oculto");
    }

    private intro() {
        if (TokenService.possuiToken()) {
            this.index();
        } else {
            const component = this.loadComponent("intro-component", IntroComponent);
            component.addEventListener("entrar", () => this.index());
        }
    }

    private index() {
        const component = this.loadComponent("index-component", IndexComponent, null, false, true);
        component.addEventListener("novaHistoria", () => this.novaHistoria());
        component.addEventListener("minhasHistorias", () => this.minhasHistorias());
        component.addEventListener("historiasVisualizadas", () => this.historiasVisualizadas());
        component.addEventListener("pendentesAprovacao", () => this.pendentesAprovacao());
        component.addEventListener("acesso", () => this.acesso());
        component.addEventListener("voltar", () => {

        });
    }

    private novaHistoria() {
        const component = this.loadComponent("nova-historia-component", NovaHistoriaComponent, "Compartilhar uma História", true);
        this.headerComponent.addEventListener(headerVoltarClick, () => this.loadIfCurrent(component, this.index.bind(this)));
        component.addEventListener("visualizar", () => this.visualizarNovaHistoria());
    }

    private visualizarNovaHistoria() {
        const component = this.loadComponent("visualizar-nova-historia-component", VisualizarNovaHistoriaComponent, "Visualizar História", true);
        this.headerComponent.addEventListener(headerVoltarClick, () => this.loadIfCurrent(component, this.novaHistoria.bind(this)));
        component.addEventListener("salvar", () => this.index());
    }

    private minhasHistorias() {
        const component = this.loadComponent("minhas-historias-component", MinhasHistoriasComponent, "Minhas Histórias", true);
        this.headerComponent.addEventListener(headerVoltarClick, () => this.loadIfCurrent(component, this.index.bind(this)));
        component.addEventListener("apresentarHistoria", (ev) => {
            const titulo = (ev as CustomEvent).detail;
            this.minhaHistoria(titulo);
        });
    }

    private minhaHistoria(titulo: string) {
        const component = this.loadComponent("minha-historia-component", MinhaHistoriaComponent, "Minha História", true);
        this.headerComponent.addEventListener(headerVoltarClick, () => this.loadIfCurrent(component, this.minhasHistorias));
        component.addEventListener("excluir", () => this.minhasHistorias());
        component.addEventListener("initialized", () =>
            component.dispatchEvent(new CustomEvent("initializeData", { detail: titulo }))
        );
    }

    private historiasVisualizadas() {
        const component = this.loadComponent("historias-visualizadas-component", HistoriasVisualizadasComponent, "Histórias Visualizadas", true);
        this.headerComponent.addEventListener(headerVoltarClick, () => this.loadIfCurrent(component, this.index.bind(this)));
        component.addEventListener("apresentarHistoriaVisualizada", (ev) => {
            const historia = (ev as CustomEvent).detail as HistoriaModel;
            this.historiaVisualizada(historia);
        });
    }

    private historiaVisualizada(historia: HistoriaModel) {
        const component = this.loadComponent("historia-visualizada-component", HistoriaVisualizadaComponent, "História Visualizada", true);
        this.headerComponent.addEventListener(headerVoltarClick, () => this.loadIfCurrent(component, this.historiasVisualizadas.bind(this)));
        component.addEventListener("curtir", () => this.historiasVisualizadas());
        component.addEventListener("initialized", () =>
            component.dispatchEvent(new CustomEvent("initializeData", { detail: historia }))
        );
    }

    private pendentesAprovacao() {
        const component = this.loadComponent("pendentes-aprovacao-component", PendentesAprovacaoComponent, "Pendentes de Aprovação", true);
        this.headerComponent.addEventListener(headerVoltarClick, () => this.loadIfCurrent(component, this.index.bind(this)));
        component.addEventListener("aprovar", () => this.index());
        component.addEventListener("reprovar", () => this.index());
    }

    private acesso() {
        const component = this.loadComponent("acesso-component", AcessoComponent, "Dados de Acesso", true);
        this.headerComponent.addEventListener(headerVoltarClick, () => this.loadIfCurrent(component, this.index.bind(this)));
    }


}

const main = () => new App();

export default main;

