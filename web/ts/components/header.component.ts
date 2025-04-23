import { headerMenuClick, headerVoltarClick } from "../models/const.model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

export interface HeaderConfig {
    titulo: string;
    exibirVoltar: boolean;
    exibirMenu: boolean;
}

class HeaderViewModel extends ViewModel {

    private headerIcone: HTMLSpanElement;
    private headerTitulo: HTMLHeadingElement;
    private headerMenu: HTMLSpanElement;

    private cssPointer = "pointer";
    private cssOculto = "oculto";

    public onMenuClick = () => { }
    public onVoltarClick = () => { }

    constructor() {
        super();
        this.headerIcone = this.getElement("headerIcone");
        this.headerTitulo = this.getElement("headerTitulo");
        this.headerMenu = this.getElement("headerMenu");

        this.headerMenu.addEventListener("click", () => this.onMenuClick());

        this.headerIcone.addEventListener("click", () => {
            if(this.headerIcone.innerText == "chevron_left")
                this.onVoltarClick();
        });

    }

    config(headerConfig: HeaderConfig) {
        
        this.headerTitulo.innerText = headerConfig.titulo;
        
        if (headerConfig.exibirVoltar) {
            this.headerIcone.innerText = "chevron_left";
            if (!this.headerIcone.classList.contains(this.cssPointer))
                this.headerIcone.classList.add(this.cssPointer);
        } else {
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

class HeaderService extends Service {

    constructor() {
        super();
    }

}

export default class HeaderComponent extends Component<HeaderViewModel, HeaderService> {

    constructor() {
        super("header");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(HeaderViewModel, HeaderService);

        this.viewModel.onMenuClick = () =>
            this.dispatchEvent(new Event(headerMenuClick));

        this.viewModel.onVoltarClick =() =>
            this.dispatchEvent(new Event(headerVoltarClick));

        this.addEventListener("config", (ev) => {
            const headerConfig = (ev as CustomEvent).detail as HeaderConfig;
            this.viewModel.config(headerConfig);
        });
    }
}