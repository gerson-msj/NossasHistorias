import { MinhaHistoriaResponseModel } from "../models/response.model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class MinhaHistoriaViewModel extends ViewModel {

    private excluir: HTMLButtonElement;
    private titulo: HTMLHeadingElement;
    private conteudo: HTMLElement;
    private idHistoria?: number;

    public onExcluir = (idHistoria: number) => { }

    constructor() {
        super();
        this.titulo = this.getElement("titulo");
        this.conteudo = this.getElement("conteudo");
        this.excluir = this.getElement("excluir");
        this.excluir.addEventListener("click", () => {
            if(this.idHistoria)
                this.onExcluir(this.idHistoria);
        });
    }

    public apresentarHistoria(historia: MinhaHistoriaResponseModel) {
        this.titulo.innerText = historia.titulo;
        this.conteudo.innerHTML = "";
        const values = historia.conteudo.split(/\r?\n/);
        values.forEach(v => {
            const p = document.createElement("p");
            p.innerText = v;
            this.conteudo.appendChild(p);
        });
        this.idHistoria = historia.id;
    }
}

class MinhaHistoriaService extends Service {

}

class MinhaHistoriaComponent extends Component<MinhaHistoriaViewModel, MinhaHistoriaService> {

    constructor() {
        super("minha-historia");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(MinhaHistoriaViewModel, MinhaHistoriaService);
        this.viewModel.onExcluir = (idHistoria: number) => { alert(idHistoria); };
        
        this.addEventListener("initializeData", (ev) => {
            const historia: MinhaHistoriaResponseModel = (ev as CustomEvent).detail;
            this.viewModel.apresentarHistoria(historia);
        });
    }

}

export default MinhaHistoriaComponent;