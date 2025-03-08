import HeaderComponent, { HeaderConfig } from "./components/header.component";
import IndexComponent from "./components/index.component";
import AboutComponent from "./components/about.component";
import { headerMenuClick, headerVoltarClick } from "./models/const.model";
import IntroComponent from "./components/intro.component";
import NovaHistoriaComponent from "./components/nova-historia.component";
import VisualizarHistoriaComponent from "./components/visualizar-historia.component";

class App {
    private mainElement: HTMLElement;
    private loadedComponents: string[] = [];
    private headerComponent: HTMLElement;
    private currentComponent: HTMLElement | null = null;

    constructor() {
        this.mainElement = document.querySelector("main") as HTMLElement;
        document.addEventListener("unauthorized", () =>
            this.index());
        this.headerComponent = this.header();
        // window.addEventListener("popstate", (ev: PopStateEvent) => {
        //     this.load();
        // });

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
            case "visualizar-historia-component":
                this.visualizarHistoria();
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
        //history.pushState({ currentComponentName: name }, name, path);
        const headerConfig: HeaderConfig = { titulo: titulo ?? "Nossas Histórias", exibirVoltar: exibirVoltar, exibirMenu: exibirMenu };
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

    private footer() {
        const div = document.querySelector("#footer");
        div?.classList.remove("oculto");
    }

    private intro() {
        const introVisualizada = localStorage.getItem("intro");
        if (introVisualizada) {
            this.index();
        }
        else {
            const component = this.loadComponent("intro-component", IntroComponent);
            component.addEventListener("entrar", () => this.index());
        }
    }

    private index() {
        const component = this.loadComponent("index-component", IndexComponent, null, false, true);
        component.addEventListener("novaHistoria", () =>
            this.novaHistoria());
    }

    private novaHistoria() {
        const component = this.loadComponent("nova-historia-component", NovaHistoriaComponent, "Compartilhar uma História", true);
        this.headerComponent.addEventListener(headerVoltarClick, () => this.index());
        component.addEventListener("visualizar", () => this.visualizarHistoria());
    }

    private visualizarHistoria() {
        const component = this.loadComponent("visualizar-historia-component", VisualizarHistoriaComponent, "Compartilhar uma História", true);
        this.headerComponent.addEventListener(headerVoltarClick, () => this.novaHistoria());
        component.addEventListener("salvar", () => this.index());
    }
}

const main = () => new App();

export default main;

