import { headerMenuClick } from "../models/const.model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class IndexViewModel extends ViewModel {

    private menuContainer: HTMLDivElement;
    private menuBackdrop: HTMLDivElement;

    private novaHistoria: HTMLButtonElement;
    private minhasHistorias: HTMLButtonElement;
    private historiasVisualizadas: HTMLButtonElement;
    private pendentesAprovacao: HTMLButtonElement;
    
    public onNovaHistoria = () => { }
    public onMinhasHistorias = () => { }
    public onHistoriasVisualizadas = () => { }
    public onPendentesAprovacao = () => { }

    constructor() {
        super();

        this.menuContainer = this.getElement("menuContainer");
        this.menuBackdrop = this.getElement("menuBackdrop");
        this.novaHistoria = this.getElement("novaHistoria");
        this.minhasHistorias = this.getElement("minhasHistorias");
        this.historiasVisualizadas = this.getElement("historiasVisualizadas");
        this.pendentesAprovacao = this.getElement("pendentesAprovacao");

        this.menuBackdrop.addEventListener("click", () => 
            this.ocultarMenu());

        this.novaHistoria.addEventListener("click", () => 
            this.onNovaHistoria());

        this.minhasHistorias.addEventListener("click", () =>
            this.onMinhasHistorias());

        this.historiasVisualizadas.addEventListener("click", () =>
            this.onHistoriasVisualizadas());
        
        this.pendentesAprovacao.addEventListener("click", () =>
            this.onPendentesAprovacao());
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
        this.viewModel.onHistoriasVisualizadas = () => this.dispatchEvent(new Event("historiasVisualizadas"));
        this.viewModel.onPendentesAprovacao = () => this.dispatchEvent(new Event("pendentesAprovacao"));
    }

}

export default IndexComponent;