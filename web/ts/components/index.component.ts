import { headerMenuClick } from "../models/const.model";
import { ProximaHistoriaRequestModel } from "../models/request.model";
import { ProximaHistoriaResponseModel, UsuarioResponseModel } from "../models/response.model";
import ApiService from "../services/api.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class IndexViewModel extends ViewModel {

    // Menu
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

    // História
    private tituloHistoria: HTMLElement;
    private conteudoHistoria: HTMLElement;
    private curtir: HTMLButtonElement;
    private proxima: HTMLButtonElement;
    private idHistoria?: number;

    public onCurtir = (idHistoria: number) => { }
    public onProxima = () => { }

    constructor() {
        super();

        // Menu
        this.menuContainer = this.getElement("menuContainer");
        this.menuBackdrop = this.getElement("menuBackdrop");
        this.novaHistoria = this.getElement("novaHistoria");
        this.minhasHistorias = this.getElement("minhasHistorias");
        this.historiasVisualizadas = this.getElement("historiasVisualizadas");
        this.pendentesAprovacao = this.getElement("pendentesAprovacao");
        this.acesso = this.getElement("acesso");

        this.menuBackdrop.addEventListener("click", () => this.ocultarMenu());
        this.novaHistoria.addEventListener("click", () => this.onNovaHistoria());
        this.minhasHistorias.addEventListener("click", () => this.onMinhasHistorias());
        this.historiasVisualizadas.addEventListener("click", () => this.onHistoriasVisualizadas());
        this.pendentesAprovacao.addEventListener("click", () => this.onPendentesAprovacao());
        this.acesso.addEventListener("click", () => this.onAcesso());

        // História
        this.tituloHistoria = this.getElement("tituloHistoria");
        this.conteudoHistoria = this.getElement("conteudoHistoria");
        this.curtir = this.getElement("curtir");
        this.proxima = this.getElement("proxima");
        this.curtir.addEventListener("click", () => this.onCurtir(this.idHistoria ?? 0));
        this.proxima.addEventListener("click", () => this.onProxima());
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

    apresentar(historia?: ProximaHistoriaResponseModel) {
        if (!historia) {
            // Informar que não existem mais histórias
            localStorage.removeItem("idHistoria");
            return;
        }

        localStorage.setItem("idHistoria", btoa(historia.id.toString()));
        this.tituloHistoria.innerText = historia.titulo;
        this.conteudoHistoria.innerHTML = "";
        const values = historia.conteudo.split(/\r?\n/);
        values.forEach(v => {
            const p = document.createElement("p");
            p.innerText = v;
            this.conteudoHistoria.appendChild(p);
        });
        const p = document.createElement("p");
        p.innerText = `Visualizações: ${historia.visualizacoes} | Curtidas: ${historia.curtidas}`;
        this.conteudoHistoria.appendChild(p);

        var dbRequest = indexedDB.open("NossasHistorias");
        dbRequest.addEventListener("success", e => {

        })

    }

}

class IndexService extends Service {
    private apiUsuario: ApiService;
    private apiHistoria: ApiService;

    constructor() {
        super();
        this.apiUsuario = new ApiService("usuario");
        this.apiHistoria = new ApiService("historia");
    }

    public obterUsuario(): Promise<UsuarioResponseModel> {
        return this.apiUsuario.doGet<UsuarioResponseModel>();
    }

    public obterProximaHistoria(idHistoria: string | null): Promise<ProximaHistoriaResponseModel | undefined> {
        const searchParams = new URLSearchParams();
        if(idHistoria)
            searchParams.append("idHistoria", atob(idHistoria));
        
        return this.apiHistoria.doGet<ProximaHistoriaResponseModel | undefined>(searchParams);
    }
}

class IndexComponent extends Component<IndexViewModel, IndexService> {

    constructor() {
        super("index");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(IndexViewModel, IndexService);

        //Menu
        this.addEventListener(headerMenuClick, () =>
            this.viewModel.exibirMenu());

        this.viewModel.onNovaHistoria = () => this.dispatchEvent(new Event("novaHistoria"));
        this.viewModel.onMinhasHistorias = () => this.dispatchEvent(new Event("minhasHistorias"));
        this.viewModel.onHistoriasVisualizadas = () => this.dispatchEvent(new Event("historiasVisualizadas"));
        this.viewModel.onPendentesAprovacao = () => this.dispatchEvent(new Event("pendentesAprovacao"));
        this.viewModel.onAcesso = () => this.dispatchEvent(new Event("acesso"));

        const usuario = await this.service.obterUsuario();
        if (!usuario.usuarioExistente)
            document.dispatchEvent(new Event("unauthorized"));

        if (usuario.moderador)
            this.viewModel.exibirPendentesAprovacao();

        //História
        const idHistoria = localStorage.getItem("idHistoria");
        const historia = await this.service.obterProximaHistoria(idHistoria);
        this.viewModel.apresentar(historia);
    }

}

export default IndexComponent;