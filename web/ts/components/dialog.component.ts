import { DialogModel } from "../models/model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class DialogViewModel extends ViewModel {

    private dialogContainer: HTMLDivElement;
    private dialogBackdrop: HTMLDialogElement;
    private dialogHeader: HTMLDivElement;
    private dialogIcon: HTMLSpanElement;
    private dialogMsg: HTMLSpanElement;
    private dialogCancel: HTMLButtonElement;
    private dialogOk: HTMLButtonElement;


    public onCancel = () => { };
    public onOk = () => { };

    constructor() {
        super();

        this.dialogContainer = this.getElement("dialogContainer");
        this.dialogBackdrop = this.getElement("dialogBackdrop")
        this.dialogHeader = this.getElement("dialogHeader");
        this.dialogIcon = this.getElement("dialogIcon");
        this.dialogMsg = this.getElement("dialogMsg");
        this.dialogCancel = this.getElement("dialogCancel");
        this.dialogOk = this.getElement("dialogOk");

        this.dialogCancel.addEventListener("click", () => this.onCancel());
        this.dialogBackdrop.addEventListener("click", () => this.onCancel());
        this.dialogOk.addEventListener("click", () => this.onOk());
    }

    public openDialog(data: DialogModel) {
        if (data.titulo === null)
            this.dialogHeader.classList.add("oculto");

        if (data.icone === null)
            this.dialogIcon.classList.add("oculto");

        if (data.cancel === null)
            this.dialogCancel.classList.add("oculto");

        this.dialogHeader.innerText = data.titulo ?? "";
        this.dialogIcon.innerText = data.icone ?? "";
        this.dialogMsg.innerHTML = data.mensagem;
        this.dialogCancel.innerText = data.cancel ?? "";
        this.dialogOk.innerText = data.ok;

        this.dialogContainer.classList.remove("oculto");
    }

    public closeDialog() {
        this.dialogContainer.classList.add("oculto");
    }

}

class DialogService extends Service {

}

class DialogComponent extends Component<DialogViewModel, DialogService> {

    private retorno: string = "";

    public okDialog = (retorno: string) => { }
    public cancelDialog = (retorno: string) => { }

    constructor() {
        super("dialog");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(DialogViewModel, DialogService);

        this.addEventListener("opendialog", (ev) => {
            const data = (ev as CustomEvent).detail as DialogModel;
            this.openDialog(data);
        });

        this.viewModel.onCancel = () => {
            this.viewModel.closeDialog();
            this.cancelDialog(this.retorno);
            this.dispatchEvent(new CustomEvent("canceldialog", { detail: this.retorno }));
        };

        this.viewModel.onOk = () => {
            this.viewModel.closeDialog();
            this.okDialog(this.retorno);
            this.dispatchEvent(new CustomEvent("okdialog", { detail: this.retorno }));
        };

    }

    public openDialog(data: DialogModel) {
        this.retorno = data.retorno;
        this.viewModel.openDialog(data);
    }
}

export default DialogComponent;