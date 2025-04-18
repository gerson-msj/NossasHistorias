import { localStorageKey_minhaHistoria_historia } from "../models/const.model";
import { HistoriaResponseModel } from "../models/response.model";
import ApiService from "../services/api.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";
import DialogComponent from "./dialog.component";

class MinhaHistoriaViewModel extends ViewModel {

    private excluir: HTMLButtonElement;
    private titulo: HTMLHeadingElement;
    private conteudo: HTMLElement;

    private _historia?: HistoriaResponseModel;

    public get historia(): HistoriaResponseModel | undefined {
        if (this._historia)
            return this._historia;

        const v = localStorage.getItem(localStorageKey_minhaHistoria_historia);
        this._historia = v ? JSON.parse(atob(v)) as HistoriaResponseModel : undefined;

        return this._historia;
    }

    public set historia(v: HistoriaResponseModel) {
        localStorage.setItem(localStorageKey_minhaHistoria_historia, btoa(JSON.stringify(v)));
        this._historia = v;
    }

    public dialog?: DialogComponent;

    public onExcluir = (idHistoria: number) => { }

    constructor() {
        super();
        this.titulo = this.getElement("titulo");
        this.conteudo = this.getElement("conteudo");
        this.excluir = this.getElement("excluir");
        this.excluir.addEventListener("click", () => {
            if (!this.historia || !this.dialog)
                return;

            this.dialog.openMsgBox({
                titulo: "Excluir",
                icone: "bookmark_remove",
                mensagem: "A exclusão não poderá ser desfeita<br />Deseja realmente excluir esta história?",
                ok: "Sim",
                cancel: "Não"
            }, () => this.onExcluir(this.historia!.id));
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
    }
}

class MinhaHistoriaService extends Service {

    private apiMinhasHistorias: ApiService;

    constructor() {
        super();
        this.apiMinhasHistorias = new ApiService("minhas-historias");
    }

    public excluir(idHistoria: number): Promise<void> {
        const p = new URLSearchParams({ idHistoria: idHistoria.toString() });
        return this.apiMinhasHistorias.doDelete<void>(p);
    }
}

class MinhaHistoriaComponent extends Component<MinhaHistoriaViewModel, MinhaHistoriaService> {

    constructor() {
        super("minha-historia");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(MinhaHistoriaViewModel, MinhaHistoriaService);
        this.viewModel.dialog = await DialogComponent.load(this);

        this.viewModel.onExcluir = async (idHistoria: number) => {
            await this.service.excluir(idHistoria);
            this.viewModel.dialog!.openMsgBox({
                titulo: "Excluir",
                mensagem: "A exclusão foi realizada.",
                icone: "bookmark_remove",
                ok: "Ok"
            },
                () => this.voltar(),
                () => this.voltar());
        };

        if (this.viewModel.historia)
            this.viewModel.apresentarHistoria(this.viewModel.historia);

        this.addEventListener("initializeData", (ev) => {
            const historia: HistoriaResponseModel = (ev as CustomEvent).detail;
            this.viewModel.apresentarHistoria(historia);
        });
    }

    private voltar() {
        localStorage.removeItem(localStorageKey_minhaHistoria_historia);
        this.dispatchEvent(new Event("voltar"));
    }

}

export default MinhaHistoriaComponent;