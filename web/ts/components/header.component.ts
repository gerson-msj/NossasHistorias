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

    private icone: HTMLSpanElement;
    private titulo: HTMLHeadingElement;
    private menu: HTMLSpanElement;

    private cssPointer = "pointer";
    private cssOculto = "oculto";

    public onMenuClick = () => { };
    public onVoltarClick = () => { };

    constructor() {
        super();
        this.icone = this.getElement("icone");
        this.titulo = this.getElement("titulo");
        this.menu = this.getElement("menu");

        this.menu.addEventListener("click", () => this.onMenuClick());

        this.icone.addEventListener("click", () => {
            if(this.icone.innerText == "chevron_left")
                this.onVoltarClick();
        });

    }

    config(headerConfig: HeaderConfig) {
        
        this.titulo.innerText = headerConfig.titulo;
        
        if (headerConfig.exibirVoltar) {
            this.icone.innerText = "chevron_left";
            if (!this.icone.classList.contains(this.cssPointer))
                this.icone.classList.add(this.cssPointer);
        } else {
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