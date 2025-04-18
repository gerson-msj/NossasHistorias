import { headerMenuClick } from "../models/const.model";
import { CurtirRequestModel } from "../models/request.model";
import { ProximaHistoriaResponseModel, UsuarioResponseModel } from "../models/response.model";
import ApiService from "../services/api.service";
import StorageService from "../services/storage.service";
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
    private curtir: HTMLSpanElement;
    private proxima: HTMLButtonElement;
    private historia?: ProximaHistoriaResponseModel;

    public onCurtir = async (request: CurtirRequestModel): Promise<void> => { }
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
        this.curtir.addEventListener("click", async () => {
            if (this.historia) {
                this.historia.curtida = !this.historia.curtida;
                await this.onCurtir({ idHistoria: this.historia.id, curtida: this.historia.curtida });
                this.apresentarCurtir();
            }
        });
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
        this.historia = historia;
        if (!historia) {
            this.tituloHistoria.innerText = "Não existem novas histórias (⊙_◎)";
            this.conteudoHistoria.innerHTML = "";
            const p = document.createElement("p");
            p.innerText = `Não deixe as histórias acabarem, compartilhe suas histórias!`;
            this.conteudoHistoria.appendChild(p);
            StorageService.index_idHistoria = undefined;
            this.curtir.classList.add("oculto");
            this.proxima.classList.add("oculto");
            return;
        }

        StorageService.index_idHistoria = historia.id;
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

        this.apresentarCurtir();

        this.curtir.classList.remove("oculto");
        this.proxima.classList.remove("oculto");
    }

    private apresentarCurtir() {
        if (this.historia?.curtida)
            this.curtir.classList.add("fill");
        else
            this.curtir.classList.remove("fill");
    }

}

class IndexService extends Service {
    private apiUsuario: ApiService;
    private apiHistoria: ApiService;
    private apiVisualizacoes: ApiService;

    constructor() {
        super();
        this.apiUsuario = new ApiService("usuario");
        this.apiHistoria = new ApiService("historia");
        this.apiVisualizacoes = new ApiService("visualizacoes");
    }

    public obterUsuario(): Promise<UsuarioResponseModel> {
        return this.apiUsuario.doGet<UsuarioResponseModel>();
    }

    public obterProximaHistoria(idHistoria: number | undefined): Promise<ProximaHistoriaResponseModel | undefined> {
        const searchParams = new URLSearchParams();
        if (idHistoria)
            searchParams.append("idHistoria", (idHistoria.toString()));

        return this.apiHistoria.doGet<ProximaHistoriaResponseModel | undefined>(searchParams);
    }

    public curtir(request: CurtirRequestModel): Promise<void> {
        return this.apiVisualizacoes.doPut<void>(request);
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
        const idHistoria = StorageService.index_idHistoria;
        const historia = await this.service.obterProximaHistoria(idHistoria);
        this.viewModel.apresentar(historia);

        this.viewModel.onCurtir = (request: CurtirRequestModel) => this.service.curtir(request);
        this.viewModel.onProxima = () => this.obterProximaHistoria();
    }

    private async obterProximaHistoria() {
        StorageService.index_idHistoria = undefined;
        const historia = await this.service.obterProximaHistoria(undefined);
        this.viewModel.apresentar(historia);
    }

}

export default IndexComponent;