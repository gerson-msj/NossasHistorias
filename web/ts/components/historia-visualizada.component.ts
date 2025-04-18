import { localStorageKey_historiaVisualizada_historia } from "../models/const.model";
import { CurtirRequestModel } from "../models/request.model";
import { HistoriaResponseModel } from "../models/response.model";
import ApiService from "../services/api.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class HistoriaVisualizadaViewModel extends ViewModel {

    private titulo: HTMLHeadingElement;
    private conteudo: HTMLElement;
    private curtir: HTMLSpanElement;

    private _historia?: HistoriaResponseModel;

    public get historia(): HistoriaResponseModel | undefined {
        if (this._historia)
            return this._historia;

        const v = localStorage.getItem(localStorageKey_historiaVisualizada_historia);
        this._historia = v ? JSON.parse(atob(v)) as HistoriaResponseModel : undefined;

        return this._historia;
    }

    public set historia(v: HistoriaResponseModel) {
        localStorage.setItem(localStorageKey_historiaVisualizada_historia, btoa(JSON.stringify(v)));
        this._historia = v;
    }

    public onCurtir = async (request: CurtirRequestModel): Promise<void> => { }

    constructor() {
        super();

        this.titulo = this.getElement("titulo");
        this.conteudo = this.getElement("conteudo");
        this.curtir = this.getElement("curtir");

        this.curtir.addEventListener("click", async () => {
            if (this.historia) {
                this.historia.curtida = !this.historia.curtida;
                await this.onCurtir({ idHistoria: this.historia.id, curtida: this.historia.curtida });
                this.apresentarCurtir();
            }
        });
    }

    public apresentarHistoria(historia: HistoriaResponseModel) {
        this.titulo.innerText = historia.titulo;
        
        this.conteudo.innerHTML = "";
        const values = historia.conteudo.split(/\r?\n/);
        values.forEach(v => {
            const p = document.createElement("p");
            p.innerText = v;
            this.conteudo.appendChild(p);
        });

        this.historia = historia;
        this.apresentarCurtir();
    }

    private apresentarCurtir() {
        if (this.historia?.curtida)
            this.curtir.classList.add("fill");
        else
            this.curtir.classList.remove("fill");
    }
}

class HistoriaVisualizadaService extends Service {
    
    private apiVisualizacoes: ApiService;

    constructor() {
        super();
        this.apiVisualizacoes = new ApiService("visualizacoes");
    }

    public curtir(request: CurtirRequestModel): Promise<void> {
        return this.apiVisualizacoes.doPut<void>(request);
    }
}

class HistoriaVisualizadaComponent extends Component<HistoriaVisualizadaViewModel, HistoriaVisualizadaService> {

    constructor() {
        super("historia-visualizada");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(HistoriaVisualizadaViewModel, HistoriaVisualizadaService);

        if (this.viewModel.historia)
            this.viewModel.apresentarHistoria(this.viewModel.historia);

        this.addEventListener("initializeData", (ev) => {
            const historia: HistoriaResponseModel = (ev as CustomEvent).detail;
            this.viewModel.apresentarHistoria(historia);
        });

        this.viewModel.onCurtir = (request: CurtirRequestModel) => this.service.curtir(request);
    }

    public static RemoveStorage() {
        localStorage.removeItem(localStorageKey_historiaVisualizada_historia);
    }

}

export default HistoriaVisualizadaComponent;