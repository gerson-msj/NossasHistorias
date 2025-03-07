import HeaderComponent, { HeaderConfig } from "./components/header.component";
import IndexComponent from "./components/index.component";
import AboutComponent from "./components/about.component";
import { headerMenuClick, headerVoltarClick } from "./models/const.model";
import IntroComponent from "./components/intro.component";

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
        const component = this.loadComponent("index-component", IndexComponent);
        component.addEventListener("about", () => this.about());
    }

    private about() {
        const component = this.loadComponent("about-component", AboutComponent, null, true);
        component.addEventListener("voltar", () =>
            this.index());
    }
}

const main = () => new App();

export default main;

