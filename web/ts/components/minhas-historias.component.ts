import { HistoriaSituacaoAnalise, HistoriaSituacaoAprovada } from "../models/const.model";
import { HistoriaModel } from "../models/model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class MinhasHistoriasViewModel extends ViewModel {

    private primeira: HTMLSpanElement;
    private anterior: HTMLSpanElement;
    private visorPagina: HTMLSpanElement;
    private proxima: HTMLSpanElement;
    private ultima: HTMLSpanElement;

    private historias: HTMLElement;

    public onApresentarHistoria = (titulo: string) => { };

    constructor() {
        super();

        this.primeira = this.getElement("primeira");
        this.anterior = this.getElement("anterior");
        this.visorPagina = this.getElement("visorPagina");
        this.proxima = this.getElement("proxima");
        this.ultima = this.getElement("ultima");

        this.historias = this.getElement("historias");
    }

    public apresentarHistorias(historias: HistoriaModel[]) {
        this.historias.innerHTML = "";
        historias.forEach(historia => {
            const titulo = document.createElement("span");
            const situacao = document.createElement("span");
            const vc = document.createElement("span");
            titulo.innerText = historia.titulo;
            situacao.innerText = historia.situacao;
            vc.innerHTML = historia.curtidas.toString();
            const row = document.createElement("div");
            row.append(titulo, situacao, vc);
            row.addEventListener("click", () => this.onApresentarHistoria(historia.titulo));
            this.historias.appendChild(row);
        });
    }
}

class MinhasHistoriasService extends Service {
    public obterMinhasHistorias(): Promise<HistoriaModel[]> {
        const historias: HistoriaModel[] = [
            {
                titulo: "Primeira História",
                conteudo: "Primeira\nHistória.",
                situacao: HistoriaSituacaoAnalise,
                visualizacoes: 0,
                curtidas: 0,
                motivoSituacao: null
            },
            {
                titulo: "Segunda História",
                conteudo: "Segunda\nHistória.",
                situacao: HistoriaSituacaoAprovada,
                visualizacoes: 37,
                curtidas: 14,
                motivoSituacao: null
            }
        ];
        return Promise.resolve(historias);
    }
}

class MinhasHistoriasComponent extends Component<MinhasHistoriasViewModel, MinhasHistoriasService> {

    constructor() {
        super("minhas-historias");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(MinhasHistoriasViewModel, MinhasHistoriasService);

        const historias = await this.service.obterMinhasHistorias();
        this.viewModel.apresentarHistorias(historias);

        this.viewModel.onApresentarHistoria = (titulo: string) =>
            this.dispatchEvent(new CustomEvent("apresentarHistoria", { detail: titulo }));

    }

}

export default MinhasHistoriasComponent;