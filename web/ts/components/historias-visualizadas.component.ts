import { localStorageKey_historiasVisualizadas_curtida, localStorageKey_historiasVisualizadas_pagina, localStorageKey_historiasVisualizadas_titulo } from "../models/const.model";
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

    public get pagina(): number {
        const p = localStorage.getItem(localStorageKey_historiasVisualizadas_pagina);
        return p ? parseInt(atob(p)) : 1;
    }

    public set pagina(v: number) {
        localStorage.setItem(localStorageKey_historiasVisualizadas_pagina, btoa(v.toString()));
    }

    public get titulo(): string {
        const p = localStorage.getItem(localStorageKey_historiasVisualizadas_titulo);
        return p ? atob(p) : "";
    }

    public set titulo(v: string) {
        localStorage.setItem(localStorageKey_historiasVisualizadas_titulo, btoa(v));
    }

    public get curtida(): number {
        const p = localStorage.getItem(localStorageKey_historiasVisualizadas_curtida);
        return p ? parseInt(atob(p)) : 0;
    }

    public set curtida(v: number) {
        localStorage.setItem(localStorageKey_historiasVisualizadas_curtida, btoa(v.toString()));
    }

    private paginas?: number;

    public onApresentarHistoria = (historia: HistoriaResponseModel) => { }
    public onBuscar = async () => { }
    
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

        this.definirFiltro();
        this.definirPaginacao();
        
    }

    private definirPaginacao() {
        this.primeira.addEventListener("click", () => {
            if(this.pagina > 1) {
                this.pagina = 1;
                this.onBuscar();
            }
        });

        this.anterior.addEventListener("click", () => {
            if(this.pagina > 1){                
                this.pagina--;
                this.onBuscar();
            }
        });

        this.proxima.addEventListener("click", () => {
            if(this.paginas && this.pagina < this.paginas)
                this.pagina++;
                this.onBuscar();
        });

        this.ultima.addEventListener("click", () => {
            if(this.paginas && this.pagina < this.paginas)
                this.pagina = this.paginas;
                this.onBuscar();
        });
    }

    private definirFiltro() {
        this.filtroTitulo.value = this.titulo;
        this.filtroCurtida.checked = this.curtida === 1;
        this.filtroTitulo.focus();

        this.filtroTitulo.addEventListener("keypress", (ev) => {
            if (ev.key === "Enter")
                ev.preventDefault();
        });

        this.filtroTitulo.addEventListener("keyup", async (ev) => {
            if (ev.key === "Enter") {
                await this.doBuscar();
                this.filtroTitulo.focus();
            } else if (ev.key === "Escape") {
                this.filtroTitulo.value = "";
                await this.doBuscar();
                this.filtroTitulo.focus();
            }
        });

        this.filtroCurtida.addEventListener("keyup", async (ev) => {
            if (ev.key === "Enter") {
                await this.doBuscar();
            } else if (ev.key === "Escape") {
                this.filtroCurtida.checked = false;
                await this.doBuscar();
            }
        });

        this.buscar.addEventListener("click", async () => await this.doBuscar());
    }

    private async doBuscar() {
        this.titulo = this.filtroTitulo.value;
        this.curtida = this.filtroCurtida.checked ? 1 : 0;
        await this.onBuscar();
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

        this.viewModel.onBuscar = async () => await this.apresentarHistorias();

        await this.apresentarHistorias();

        this.viewModel.onApresentarHistoria = (historia: HistoriaResponseModel) =>
            this.dispatchEvent(new CustomEvent("apresentarHistoria", { detail: historia }));

    }

    private async apresentarHistorias() {
        const historias = await this.service.obterHistoriasVisualizadas(
            this.viewModel.pagina,
            this.viewModel.titulo,
            this.viewModel.curtida
        );

        this.viewModel.apresentarHistorias(historias);
    }

    public static RemoveStorage() {
        localStorage.removeItem(localStorageKey_historiasVisualizadas_titulo);
        localStorage.removeItem(localStorageKey_historiasVisualizadas_curtida);
        localStorage.removeItem(localStorageKey_historiasVisualizadas_pagina);
    }
}

export default HistoriasVisualizadasComponent;