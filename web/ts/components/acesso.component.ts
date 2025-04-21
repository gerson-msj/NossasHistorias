import { UsuarioResponseModel } from "../models/response.model";
import ApiService from "../services/api.service";
import StorageService from "../services/storage.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";
import DialogComponent from "./dialog.component";

class AcessoViewModel extends ViewModel {

    private idAtual: HTMLSpanElement = this.getElement("idAtual");
    private tokenAtual: HTMLParagraphElement = this.getElement("tokenAtual");
    private copiar: HTMLButtonElement = this.getElement("copiar");
    private tokenExistente = this.getElement<HTMLInputElement>("tokenExistente");
    private trocarUsuario = this.getElement<HTMLButtonElement>("trocarUsuario");

    public dialog?: DialogComponent;

    public onTrocarUsuario = (token: string) => { }

    constructor() {
        super();

        this.copiar.addEventListener("click", async () => {
            await navigator.clipboard.writeText(this.tokenAtual.innerText);
            this.dialog!.openMsgBox({
                titulo: `Usuário #${this.idAtual.innerText}`,
                mensagem: "O identificador atual foi copiado para a área de transferência",
                icone: "inventory",
                ok: "Ok"
            });
        });

        this.trocarUsuario.disabled = true;

        this.tokenExistente.addEventListener("keyup", (ev) => {
            if (ev.key === "Escape")
                this.tokenExistente.value = "";

            this.trocarUsuario.disabled = this.tokenExistente.value === "";
        });

        this.trocarUsuario.addEventListener("click", () => {
            this.onTrocarUsuario(this.tokenExistente.value);
        });
    }

    public apresentarToken(id?: number) {
        this.tokenExistente.value = "";
        this.idAtual.innerText = id?.toString() ?? "";
        this.tokenAtual.innerText = StorageService.token ?? "";
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
            this.viewModel.dialog!.openMsgBox({
                titulo: "Trocar Usuário",
                mensagem: "O identificador informado é válido<br />Deseja substituir o identificador atual?",
                icone: "manage_accounts",
                cancel: "Não",
                ok: "Sim"
            }, () => {
                StorageService.token = token;
                this.viewModel.dialog!.openMsgBox({
                    titulo: "Trocar Usuário",
                    mensagem: "O identificador atual foi substituído com sucesso.",
                    icone: "person_check",
                    ok: "Ok"
                }, this.apresentarAtual.bind(this), this.apresentarAtual.bind(this));
            });
        } else {
            this.viewModel.dialog!.openMsgBox({
                titulo: "Trocar Usuário",
                mensagem: "O identificador informado é inválido!",
                icone: "manage_accounts",
                ok: "Ok"
            });
        }
    }

    private async apresentarAtual() {
        const usuario = await this.service.obterUsuario();
        this.viewModel.apresentarToken(usuario.id);
    }
}





export default AcessoComponent;