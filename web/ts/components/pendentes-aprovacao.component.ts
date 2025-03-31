import { HistoriaModeracaoRequestModel, Situacao } from "../models/request.model";
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

    public onModerar = (request: HistoriaModeracaoRequestModel) => { }

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
            }, () => this.onModerar({ idHistoria: this.historia!.id, idSituacao: Situacao.aprovada }));
        });

        this.reprovar.addEventListener("click", () => {
            this.dialog?.openInputBox({
                titulo: "Reprovar",
                icone: "bookmark_remove",
                mensagem: "Informe o motivo da reprovação desta história",
                cancel: "Cancelar",
                ok: "Reprovar"
            }, (inputText: string) => this.onModerar({ idHistoria: this.historia!.id, idSituacao: Situacao.reprovada, motivoModeracao: inputText }));
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

    public moderar(request: HistoriaModeracaoRequestModel): Promise<void> {
        return this.apiModerador.doPut<void>(request);
    }
}

class PendentesAprovacaoComponent extends Component<PendentesAprovacaoViewModel, PendentesAprovacaoService> {

    constructor() {
        super("pendentes-aprovacao");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(PendentesAprovacaoViewModel, PendentesAprovacaoService);
        this.viewModel.dialog = await DialogComponent.load(this);

        await this.apresentarHistoria();

        this.viewModel.onModerar = async (request) => {
            await this.service.moderar(request)
            const aprovada = request.idSituacao == Situacao.aprovada;
            this.viewModel.dialog!.openMsgBox({
                titulo: aprovada ? "História Aprovada" : "História Reprovada",
                mensagem: aprovada ? "A história foi aprovada." : "A história foi reprovada.",
                icone: aprovada ? "bookmark_add" : "bookmark_remove",
                cancel: "Encerrar Moderação",
                ok: "Próxima História"
            }, async () => {
                await this.apresentarHistoria();
            }, () => {
                this.dispatchEvent(new Event("voltar"));
            })
        };
    }

    private async apresentarHistoria(): Promise<void> {
        const historia = await this.service.obterHistoria();
        this.viewModel.apresentarHistoria(historia);
    }
}

export default PendentesAprovacaoComponent;