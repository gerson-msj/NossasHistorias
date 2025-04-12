import { HistoriaSituacaoAnalise, HistoriaSituacaoAprovada, localStorageKey_minhasHistorias_pagina } from "../models/const.model";
import { HistoriaModel } from "../models/model";
import { MinhasHistoriasResponseModel } from "../models/response.model";
import ApiService from "../services/api.service";
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
    
    public get pagina() : number {
        const p = localStorage.getItem(localStorageKey_minhasHistorias_pagina);
        return p ? parseInt(atob(p)) : 1;
    }
    
    public set pagina(v : number) {
        localStorage.setItem(localStorageKey_minhasHistorias_pagina, btoa(v.toString()));
    }

    private paginas?: number;

    public onIrParaPagina = (pagina: number) => { }
    
    public onApresentarHistoria = (titulo: string) => { };

    constructor() {
        super();

        this.primeira = this.getElement("primeira");
        this.anterior = this.getElement("anterior");
        this.visorPagina = this.getElement("visorPagina");
        this.proxima = this.getElement("proxima");
        this.ultima = this.getElement("ultima");

        this.historias = this.getElement("historias");

        this.primeira.addEventListener("click", () => {
            if(this.pagina > 1)
                this.onIrParaPagina(1);
        });

        this.anterior.addEventListener("click", () => {
            if(this.pagina > 1)
                this.onIrParaPagina(this.pagina - 1);
        });

        this.proxima.addEventListener("click", () => {
            if(this.paginas && this.pagina < this.paginas)
                this.onIrParaPagina(this.pagina + 1);
        });

        this.ultima.addEventListener("click", () => {
            if(this.paginas && this.pagina < this.paginas)
                this.onIrParaPagina(this.paginas);
        });
    }

    public apresentarHistorias(minhasHistorias: MinhasHistoriasResponseModel) {
        this.historias.innerHTML = "";
        minhasHistorias.historias.forEach(historia => {
            const titulo = document.createElement("span");
            const situacao = document.createElement("span");
            const vc = document.createElement("span");
            titulo.innerText = historia.titulo;
            situacao.innerText = historia.situacao;
            vc.innerHTML = `${historia.visualizacoes} / ${historia.curtidas}`;
            const row = document.createElement("div");
            row.append(titulo, situacao, vc);
            row.addEventListener("click", () => this.onApresentarHistoria(historia.titulo));
            this.historias.appendChild(row);
        });

        this.visorPagina.innerText = `página ${minhasHistorias.pagina} de ${minhasHistorias.paginas}`;

        this.exibirLink(minhasHistorias.pagina !== 1, this.primeira, this.anterior);
        this.exibirLink(minhasHistorias.pagina !== minhasHistorias.paginas, this.proxima, this.ultima);

        this.pagina = minhasHistorias.pagina;
        this.paginas = minhasHistorias.paginas;
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

class MinhasHistoriasService extends Service {

    private apiMinhasHistorias: ApiService;

    constructor() {
        super();
        this.apiMinhasHistorias = new ApiService("minhas-historias");
    }

    public obterMinhasHistorias(pagina: number): Promise<MinhasHistoriasResponseModel> {
        const searchParams = new URLSearchParams();
        searchParams.append("pagina", pagina.toString());
        return this.apiMinhasHistorias.doGet<MinhasHistoriasResponseModel>(searchParams);
    }
}

class MinhasHistoriasComponent extends Component<MinhasHistoriasViewModel, MinhasHistoriasService> {

    constructor() {
        super("minhas-historias");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(MinhasHistoriasViewModel, MinhasHistoriasService);

        await this.apresentarHistorias(this.viewModel.pagina);

        this.viewModel.onApresentarHistoria = (titulo: string) =>
            this.dispatchEvent(new CustomEvent("apresentarHistoria", { detail: titulo }));

        this.viewModel.onIrParaPagina = async (pagina: number) => {
            await this.apresentarHistorias(pagina);
        }

    }

    private async apresentarHistorias(pagina: number) {
        const historias = await this.service.obterMinhasHistorias(pagina);
        this.viewModel.apresentarHistorias(historias);
    }

}

export default MinhasHistoriasComponent;