import { DialogModel } from "../models/model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";
import DialogComponent from "./dialog.component";

class NovaHistoriaViewModel extends ViewModel {

    private tituloNovaHistoria: HTMLInputElement;
    private novaHistoria: HTMLTextAreaElement;
    private visualizar: HTMLButtonElement;

    private _dialog: DialogComponent | null = null;
    public get dialog(): DialogComponent { return this._dialog!; }
    public set dialog(v: DialogComponent) { this._dialog = v; }

    private timeoutId: number | null = null;

    public onVisualizar = () => { };

    constructor() {
        super();

        this.tituloNovaHistoria = this.getElement("tituloNovaHistoria");
        this.novaHistoria = this.getElement("novaHistoria");
        this.visualizar = this.getElement("visualizar");

        this.visualizar.addEventListener("click", () => {
            if(this.podeVisualizar()){
                localStorage.setItem(this.tituloNovaHistoria.id, this.tituloNovaHistoria.value);
                localStorage.setItem(this.novaHistoria.id, this.novaHistoria.value);
                this.onVisualizar();
            }
        });

        this.tituloNovaHistoria.focus();

        this.restoreData(this.tituloNovaHistoria, this.novaHistoria);

        this.tituloNovaHistoria.addEventListener("keyup", this.saveData);
        this.novaHistoria.addEventListener("keyup", this.saveData);
    }

    private saveData(ev: KeyboardEvent) {
        if (this.timeoutId !== null)
            clearTimeout(this.timeoutId);

        this.timeoutId = setTimeout(() => {
            const target = ev.target as HTMLTextAreaElement | HTMLInputElement;
            localStorage.setItem(target.id, target.value);
        }, 500);
    }

    private restoreData(...target: HTMLElement[]) {
        target.forEach(t => {
            const value = localStorage.getItem(t.id) ?? "";
            const e = t as HTMLTextAreaElement | HTMLInputElement;
            e.value = value;
        });
    }

    private podeVisualizar(): boolean {
        if(this.tituloNovaHistoria.value.trim() !== "" && this.novaHistoria.value.trim() !== "") {
            return true;
        }

        const dialogModel: DialogModel = {
            titulo: "Visualizar História",
            mensagem: "Dê um título e conte sua história, não deixe nada vazio!",
            icone: "emergency_home",
            cancel: null,
            ok: "Ok",
            retorno: "podeVisualizar"
        };

        this.dialog.openDialog(dialogModel);
        return false;
    }

}

class NovaHistoriaService extends Service {

}

class NovaHistoriaComponent extends Component<NovaHistoriaViewModel, NovaHistoriaService> {

    constructor() {
        super("nova-historia");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(NovaHistoriaViewModel, NovaHistoriaService);
        this.viewModel.onVisualizar = () => this.dispatchEvent(new Event("visualizar"));

        this.viewModel.dialog = await DialogComponent.load(this);
    }



}

export default NovaHistoriaComponent;