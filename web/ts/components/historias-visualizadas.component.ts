import { HistoriaSituacaoAprovada, localStorageKey_historiasVisualizadas_curtida, localStorageKey_historiasVisualizadas_pagina, localStorageKey_historiasVisualizadas_titulo } from "../models/const.model";
import { HistoriaModel } from "../models/model";
import { HistoriaResponseModel, HistoriasResponseModel } from "../models/response.model";
import ApiService from "../services/api.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class HistoriasVisualizadasViewModel extends ViewModel {

    private filtroTitulo: HTMLInputElement;
    private filtroCurtida: HTMLInputElement;
    private buscar: HTMLButtonElement;
    private historias: HTMLElement;
    private primeira: HTMLSpanElement;
    private anterior: HTMLSpanElement;
    private visorPagina: HTMLSpanElement;
    private proxima: HTMLSpanElement;
    private ultima: HTMLSpanElement;

    public get pagina() : number {
        const p = localStorage.getItem(localStorageKey_historiasVisualizadas_pagina);
        return p ? parseInt(atob(p)) : 1;
    }
        
    public set pagina(v : number) {
        localStorage.setItem(localStorageKey_historiasVisualizadas_pagina, btoa(v.toString()));
    }

    public get titulo() : string {
        const p = localStorage.getItem(localStorageKey_historiasVisualizadas_titulo);
        return p ? atob(p) : "";
    }
        
    public set titulo(v : string) {
        localStorage.setItem(localStorageKey_historiasVisualizadas_titulo, btoa(v));
    }

    public get curtida() : number {
        const p = localStorage.getItem(localStorageKey_historiasVisualizadas_curtida);
        return p ? parseInt(atob(p)) : 0;
    }
        
    public set curtida(v : number) {
        localStorage.setItem(localStorageKey_historiasVisualizadas_curtida, btoa(v.toString()));
    }

    private paginas?: number;

    public onApresentarHistoria = (historia: HistoriaResponseModel) => { };

    constructor() {
        super();

        this.filtroTitulo = this.getElement("filtroTitulo");
        this.filtroCurtida = this.getElement("filtroCurtida");
        this.buscar = this.getElement("buscar");
        this.historias = this.getElement("historias");
        this.primeira = this.getElement("primeira");
        this.anterior = this.getElement("anterior");
        this.visorPagina = this.getElement("visorPagina");
        this.proxima = this.getElement("proxima");
        this.ultima = this.getElement("ultima");

    }

    public apresentarHistorias(historiasVisualizadas: HistoriasResponseModel) {
        this.historias.innerHTML = "";
        historiasVisualizadas.historias.forEach(historia => {
            const titulo = document.createElement("span");
            const vc = document.createElement("span");
            titulo.innerText = historia.titulo;
            vc.innerHTML = `${historia.visualizacoes} / ${historia.curtidas}`;
            const row = document.createElement("div");
            row.append(titulo, vc);
            row.addEventListener("click", () => this.onApresentarHistoria(historia));
            this.historias.appendChild(row);
        });

        this.visorPagina.innerText = `página ${historiasVisualizadas.pagina} de ${historiasVisualizadas.paginas}`;

        this.exibirLink(historiasVisualizadas.pagina !== 1, this.primeira, this.anterior);
        this.exibirLink(historiasVisualizadas.pagina !== historiasVisualizadas.paginas, this.proxima, this.ultima);

        this.pagina = historiasVisualizadas.pagina;
        this.paginas = historiasVisualizadas.paginas;
    }

    private exibirLink(exibir: boolean, ...elements: HTMLSpanElement[]) {
        elements.forEach(e => {
            if (exibir) {
                e.classList.add('link');
                e.classList.remove('disabled');
            } else {
                e.classList.remove('link');
                e.classList.add('disabled');
            }
        });
    }
}

class HistoriasVisualizadasService extends Service {

    private apiHistoriasVisualizadas = new ApiService("historias-visualizadas");

    public obterHistoriasVisualizadas(pagina: number, titulo: string, curtida: number): Promise<HistoriasResponseModel> {
        const sp = new URLSearchParams([
            ["pagina", pagina.toString()],
            ["titulo", titulo],
            ["curtida", curtida.toString()]
        ]);
        return this.apiHistoriasVisualizadas.doGet<HistoriasResponseModel>(sp);
    }
}

class HistoriasVisualizadasComponent extends Component<HistoriasVisualizadasViewModel, HistoriasVisualizadasService> {

    constructor() {
        super("historias-visualizadas");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(HistoriasVisualizadasViewModel, HistoriasVisualizadasService);

        //await this.apresentarHistorias();

        // this.viewModel.onApresentarHistoria = (historia: HistoriaModel) =>
        //     this.dispatchEvent(new CustomEvent("apresentarHistoriaVisualizada", { detail: historia }));

    }

    private async apresentarHistorias() {
        const historias = await this.service.obterHistoriasVisualizadas(
            this.viewModel.pagina,
            this.viewModel.titulo,
            this.viewModel.curtida
        );

        this.viewModel.apresentarHistorias(historias);
    }

    

}

export default HistoriasVisualizadasComponent;