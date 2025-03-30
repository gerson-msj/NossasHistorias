import { HistoriaModeradorResponseModel } from "../models/response.model";
import ApiService from "../services/api.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";
import DialogComponent from "./dialog.component";

class PendentesAprovacaoViewModel extends ViewModel {

    private tituloPendente: HTMLElement;
    private conteudoPendente: HTMLElement;

    private aprovar: HTMLButtonElement;
    private reprovar: HTMLButtonElement;
    public dialog?: DialogComponent;

    private historia?: HistoriaModeradorResponseModel;

    public onAprovar = () => { }
    public onReprovar = (motivoModeracao: string) => { }

    constructor() {
        super();

        this.tituloPendente = this.getElement("tituloPendente");
        this.conteudoPendente = this.getElement("conteudoPendente");

        this.aprovar = this.getElement("aprovar");
        this.reprovar = this.getElement("reprovar");

        this.aprovar.addEventListener("click", () => {
            this.dialog?.openMsgBox({
                titulo: "Aprovar",
                icone: "bookmark_add",
                mensagem: "Confirma a aprovação da história?",
                cancel: "Cancelar",
                ok: "Aprovar"
            }, () => this.onAprovar());
        });

        this.reprovar.addEventListener("click", () => {
            this.dialog?.openInputBox({
                titulo: "Reprovar",
                icone: "bookmark_remove",
                mensagem: "Informe o motivo da reprovação desta história",
                cancel: "Cancelar",
                ok: "Reprovar"
            }, (inputText: string) => this.onReprovar(inputText));
        });
    }

    public apresentarHistoria(historia: HistoriaModeradorResponseModel) {
        if (historia.id > 0) {
            this.tituloPendente.innerText = historia.titulo;
            this.conteudoPendente.innerHTML = "";
            const values = historia.conteudo.split(/\r?\n/);
            values.forEach(v => {
                const p = document.createElement("p");
                p.innerHTML = v;
                this.conteudoPendente.appendChild(p);
            });
            this.historia = historia;
            this.aprovar.disabled = false;
            this.reprovar.disabled = false;
        } else {
            this.tituloPendente.innerText = "-- Fim das Histórias --";
            this.conteudoPendente.innerHTML = "";
            const p = document.createElement("p");
            p.innerText = "Não existem mais histórias pendentes de aprovação."
            this.historia = undefined;
            this.aprovar.disabled = true;
            this.reprovar.disabled = true;
        }
    }
}

class PendentesAprovacaoService extends Service {
    private apiModerador: ApiService;

    constructor() {
        super();
        this.apiModerador = new ApiService("moderador");
    }

    public obterHistoria(): Promise<HistoriaModeradorResponseModel> {
        return this.apiModerador.doGet<HistoriaModeradorResponseModel>();
    }
}

class PendentesAprovacaoComponent extends Component<PendentesAprovacaoViewModel, PendentesAprovacaoService> {

    constructor() {
        super("pendentes-aprovacao");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(PendentesAprovacaoViewModel, PendentesAprovacaoService);
        this.viewModel.dialog = await DialogComponent.load(this);

        const historia = await this.service.obterHistoria();
        this.viewModel.apresentarHistoria(historia);

        // this.viewModel.onAprovar = () => this.dispatchEvent(new Event("aprovar"));
        // this.viewModel.onReprovar = () => this.dispatchEvent(new Event("reprovar"));
    }



}

export default PendentesAprovacaoComponent;