import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class DialogViewModel extends ViewModel {

    // private _dialogTitulo: HTMLElement;
    // private _dialogMensagem: HTMLElement;

    // public get dialogTitulo() { return this._dialogTitulo.innerText; }
    // public set dialogTitulo(value: string) { this._dialogTitulo.innerText = value; }

    // public get dialogMensagem() { return this._dialogMensagem.innerText; }
    // public set dialogMensagem(value: string) { this._dialogMensagem.innerText = value; }

    constructor() {
        super();

        // this._dialogTitulo = this.getElement("dialogTitulo");
        // this._dialogMensagem = this.getElement("dialogMensagem");
    }

}

class DialogService extends Service {

}

class DialogComponent extends Component<DialogViewModel, DialogService> {

    // public set titulo(value: string) { this.viewModel.dialogTitulo = value }

    constructor() {
        super("dialog");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(DialogViewModel, DialogService);

    }



}

export default DialogComponent;