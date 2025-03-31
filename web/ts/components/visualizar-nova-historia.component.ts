import { HistoriaRequestModel } from "../models/request.model";
import ApiService from "../services/api.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";
import DialogComponent from "./dialog.component";

class VisualizarNovaHistoriaViewModel extends ViewModel {

    private tituloNovaHistoria: HTMLElement;
    private novaHistoria: HTMLElement;

    private _dialog: DialogComponent | null = null;
    public get dialog(): DialogComponent { return this._dialog!; }
    public set dialog(v: DialogComponent) { this._dialog = v; }

    private salvar: HTMLButtonElement;

    public onSalvar = (titulo: string, conteudo: string) => { };
    
    constructor() {
        super();

        this.tituloNovaHistoria = this.getElement("tituloNovaHistoria");
        this.novaHistoria = this.getElement("novaHistoria");

        this.restoreData(this.tituloNovaHistoria, this.novaHistoria);

        this.salvar = this.getElement("salvar");
        this.salvar.addEventListener("click", () => this.doSalvar());
    }

    private restoreData(...target: HTMLElement[]) {
        target.forEach(t => {
            const value = localStorage.getItem(t.id) ?? "";
            const e = t as HTMLElement;
            e.innerHTML = "";
            const values = value.split(/\r?\n/);
            values.forEach(v => {
                const p = document.createElement("p");
                p.innerText = v;
                e.appendChild(p);
            });
        });
    }

    private doSalvar() {
        this.dialog.openMsgBox({
            titulo: "Salvar História",
            icone: "bookmark_add",
            mensagem: `
                Sua história será avaliada antes de ser publicada.
                <br />
                Você deseja continuar com a gravação?
            `,
            cancel: "Não",
            ok: "Sim"
        }, () => {
            const titulo = localStorage.getItem(this.tituloNovaHistoria.id) ?? "";
            const conteudo = localStorage.getItem(this.novaHistoria.id) ?? "";
            this.onSalvar(titulo, conteudo);
        });
    }

    public clearData() {
        localStorage.removeItem(this.tituloNovaHistoria.id);
        localStorage.removeItem(this.novaHistoria.id);
    }
}

class VisualizarNovaHistoriaService extends Service {

    private apiHistoria: ApiService;

    constructor() {
        super();
        this.apiHistoria = new ApiService("historia");
    }

    public salvar(titulo: string, conteudo: string): Promise<void> {
        const request: HistoriaRequestModel = {
            titulo: titulo,
            conteudo: conteudo
        };

        return this.apiHistoria.doPost(request);
    }

}

class VisualizarNovaHistoriaComponent extends Component<VisualizarNovaHistoriaViewModel, VisualizarNovaHistoriaService> {

    constructor() {
        super("visualizar-nova-historia");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(VisualizarNovaHistoriaViewModel, VisualizarNovaHistoriaService);

        this.viewModel.dialog = await DialogComponent.load(this);

        this.viewModel.onSalvar = async (titulo: string, conteudo: string) => {
            await this.service.salvar(titulo, conteudo);
            
            this.viewModel.dialog.openMsgBox({
                titulo: "Salvar História",
                icone: "bookmark_added",
                mensagem: `
                    Gravação realizada com sucesso!
                    <br />
                    Sua história será avaliada antes de ser publicada.
                `,
                ok: "ok"
            }, () => {
                this.viewModel.clearData();
                this.dispatchEvent(new Event("voltar"));
            });
        };
    }

}

export default VisualizarNovaHistoriaComponent;