import { headerMenuClick } from "../models/const.model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class IndexViewModel extends ViewModel {

    private menuContainer: HTMLDivElement;
    private menuBackdrop: HTMLDivElement;

    private novaHistoria: HTMLButtonElement;
    private minhasHistorias: HTMLButtonElement;

    public onNovaHistoria = () => { };
    public onMinhasHistorias = () => { };

    constructor() {
        super();

        this.menuContainer = this.getElement("menuContainer");
        this.menuBackdrop = this.getElement("menuBackdrop");
        this.novaHistoria = this.getElement("novaHistoria");
        this.minhasHistorias = this.getElement("minhasHistorias");

        this.menuBackdrop.addEventListener("click", () => 
            this.ocultarMenu());

        this.novaHistoria.addEventListener("click", () => 
            this.onNovaHistoria());

        this.minhasHistorias.addEventListener("click", () =>
            this.onMinhasHistorias());
    }

    exibirMenu() {
        this.menuContainer.classList.remove("oculto");
    }

    ocultarMenu() {
        this.menuContainer.classList.add("oculto");
    }
}

class IndexService extends Service {

}

class IndexComponent extends Component<IndexViewModel, IndexService> {

    constructor() {
        super("index");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(IndexViewModel, IndexService);
        
        this.addEventListener(headerMenuClick, () => 
            this.viewModel.exibirMenu());

        this.viewModel.onNovaHistoria = () => this.dispatchEvent(new Event("novaHistoria"));
        this.viewModel.onMinhasHistorias = () => this.dispatchEvent(new Event("minhasHistorias"));
    }

}

export default IndexComponent;