import { headerMenuClick } from "../models/const.model";
import { UsuarioResponseModel } from "../models/response.model";
import ApiService from "../services/api.service";
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
    private acesso: HTMLButtonElement;
    
    public onNovaHistoria = () => { }
    public onMinhasHistorias = () => { }
    public onHistoriasVisualizadas = () => { }
    public onPendentesAprovacao = () => { }
    public onAcesso = () => { }
    
    constructor() {
        super();

        this.menuContainer = this.getElement("menuContainer");
        this.menuBackdrop = this.getElement("menuBackdrop");
        this.novaHistoria = this.getElement("novaHistoria");
        this.minhasHistorias = this.getElement("minhasHistorias");
        this.historiasVisualizadas = this.getElement("historiasVisualizadas");
        this.pendentesAprovacao = this.getElement("pendentesAprovacao");
        this.acesso = this.getElement("acesso");

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

        this.acesso?.addEventListener("click", () => 
            this.onAcesso());
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
}

class IndexService extends Service {
    private apiUsuario: ApiService;

    constructor() {
        super();
        this.apiUsuario = new ApiService("usuario");
    }

    public obterUsuario(): Promise<UsuarioResponseModel> {
        return this.apiUsuario.doGet<UsuarioResponseModel>();
    }
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
        this.viewModel.onAcesso = () => this.dispatchEvent(new Event("acesso"));

        const usuario = await this.service.obterUsuario();
        if(!usuario.usuarioExistente)
            document.dispatchEvent(new Event("unauthorized"));

        if(usuario.moderador)
            this.viewModel.exibirPendentesAprovacao();
    }

}

export default IndexComponent;