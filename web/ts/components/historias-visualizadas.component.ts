import { HistoriaSituacaoAprovada, localStorageKey_historiasVisualizadas_curtida, localStorageKey_historiasVisualizadas_pagina, localStorageKey_historiasVisualizadas_titulo } from "../models/const.model";
import { HistoriaModel } from "../models/model";
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

    public onApresentarHistoria = (historia: HistoriaModel) => { };

    constructor() {
        super();

        this.filtroTitulo = this.getElement("titulo");
        this.filtroCurtida = this.getElement("curtida");
        this.buscar = this.getElement("buscar");
        this.historias = this.getElement("historias");
        this.primeira = this.getElement("primeira");
        this.anterior = this.getElement("anterior");
        this.visorPagina = this.getElement("visorPagina");
        this.proxima = this.getElement("proxima");
        this.ultima = this.getElement("ultima");

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