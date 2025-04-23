import { DialogModel } from "../models/model";
import { UsuarioResponseModel } from "../models/response.model";
import ApiService from "../services/api.service";
import StorageService from "../services/storage.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";
import DialogComponent from "./dialog.component";

class AcessoViewModel extends ViewModel {

    private idAtual = this.getElement<HTMLSpanElement>("idAtual");
    private tokenAtual = this.getElement<HTMLParagraphElement>("tokenAtual");
    private copiar = this.getElement<HTMLButtonElement>("copiar");
    private tokenExistente = this.getElement<HTMLInputElement>("tokenExistente");
    private trocarUsuario = this.getElement<HTMLButtonElement>("trocarUsuario");

    public dialog?: DialogComponent;

    public onTrocarUsuario = (token: string) => { }

    constructor() {
        super();
        this.trocarUsuario.disabled = true;
        this.configEvents();
    }

    public apresentarToken(id?: number) {
        this.tokenExistente.value = "";
        this.idAtual.innerText = id?.toString() ?? "";
        this.tokenAtual.innerText = StorageService.token ?? "";
    }

    private configEvents() {

        this.copiar.addEventListener("click", async () => {
            await navigator.clipboard.writeText(this.tokenAtual.innerText);
            const msg: DialogModel = {
                titulo: `Usuário #${this.idAtual.innerText}`,
                mensagem: "O identificador atual foi copiado para a área de transferência",
                icone: "inventory",
                ok: "Ok"
            };
            this.dialog!.openMsgBox(msg);
        });

        this.tokenExistente.addEventListener("keyup", (ev) => {
            if (ev.key === "Escape")
                this.tokenExistente.value = "";

            this.trocarUsuario.disabled = this.tokenExistente.value === "";
        });

        this.trocarUsuario.addEventListener("click", () => {
            this.onTrocarUsuario(this.tokenExistente.value);
        });

    }

}

class AcessoService extends Service {
    private apiUsuario: ApiService;

    constructor() {
        super();
        this.apiUsuario = new ApiService("usuario");
    }

    public obterUsuario(token?: string): Promise<UsuarioResponseModel> {
        const p = new URLSearchParams();

        if (token)
            p.append("token", token);

        return this.apiUsuario.doGet<UsuarioResponseModel>(p);
    }
}

class AcessoComponent extends Component<AcessoViewModel, AcessoService> {

    constructor() {
        super("Acesso");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(AcessoViewModel, AcessoService);

        this.viewModel.dialog = await DialogComponent.load(this);

        await this.apresentarAtual();

        this.viewModel.onTrocarUsuario = this.trocarUsuario.bind(this);
    }

    private async trocarUsuario(token: string) {

        if (token === StorageService.token) {
            this.viewModel.dialog!.openMsgBox({
                titulo: "Trocar Usuário",
                mensagem: "O identificador informado é o identificador atual<br />Informe outro identificador.",
                icone: "manage_accounts",
                ok: "Ok"
            });

            return;
        }

        const novoUsuario = await this.service.obterUsuario(token);
        if (novoUsuario.usuarioExistente) {

            const msgQuest: DialogModel = {
                titulo: "Trocar Usuário",
                mensagem: "O identificador informado é válido<br />Deseja substituir o identificador atual?",
                icone: "manage_accounts",
                cancel: "Não",
                ok: "Sim"
            };

            const msgConfirm: DialogModel = {
                titulo: "Trocar Usuário",
                mensagem: "O identificador atual foi substituído com sucesso.",
                icone: "person_check",
                ok: "Ok"
            };

            const msgQuestOk = () => {
                StorageService.token = token;
                this.viewModel.dialog!.openMsgBox(msgConfirm, this.apresentarAtual.bind(this), this.apresentarAtual.bind(this));
            };

            this.viewModel.dialog!.openMsgBox(msgQuest, msgQuestOk);

        } else {

            const msgInvalid: DialogModel = {
                titulo: "Trocar Usuário",
                mensagem: "O identificador informado é inválido!",
                icone: "manage_accounts",
                ok: "Ok"
            };

            this.viewModel.dialog!.openMsgBox(msgInvalid);
        }
    }

    private async apresentarAtual() {
        const usuario = await this.service.obterUsuario();
        this.viewModel.apresentarToken(usuario.id);
    }
}

export default AcessoComponent;