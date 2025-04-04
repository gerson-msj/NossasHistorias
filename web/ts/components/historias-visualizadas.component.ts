import { HistoriaSituacaoAprovada } from "../models/const.model";
import { HistoriaModel } from "../models/model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class HistoriasVisualizadasViewModel extends ViewModel {

    private historias: HTMLElement;

    public onApresentarHistoria = (historia: HistoriaModel) => { };

    constructor() {
        super();

        this.historias = this.getElement("historias");
    }

    public apresentarHistorias(historias: HistoriaModel[]) {
        this.historias.innerHTML = "";
        historias.forEach(historia => {
            const titulo = document.createElement("span");
            const curtidas = document.createElement("span");
            titulo.innerText = historia.titulo;
            curtidas.innerHTML = historia.curtidas.toString();
            const row = document.createElement("div");
            row.append(titulo, curtidas);
            row.addEventListener("click", () => this.onApresentarHistoria(historia));
            this.historias.appendChild(row);
        });
    }
}

class HistoriasVisualizadasService extends Service {
    public obterHistoriasVisualizadas(): Promise<HistoriaModel[]> {
        const historias: HistoriaModel[] = [
            {
                titulo: "Primeira História",
                conteudo: "Primeira\nHistória.",
                situacao: HistoriaSituacaoAprovada,
                visualizacoes: 30,
                curtidas: 15,
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

class HistoriasVisualizadasComponent extends Component<HistoriasVisualizadasViewModel, HistoriasVisualizadasService> {

    constructor() {
        super("historias-visualizadas");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(HistoriasVisualizadasViewModel, HistoriasVisualizadasService);

        const historias = await this.service.obterHistoriasVisualizadas();
        this.viewModel.apresentarHistorias(historias);

        this.viewModel.onApresentarHistoria = (historia: HistoriaModel) =>
            this.dispatchEvent(new CustomEvent("apresentarHistoriaVisualizada", { detail: historia }));

    }

    

}

export default HistoriasVisualizadasComponent;