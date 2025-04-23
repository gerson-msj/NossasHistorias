import { DialogModel } from "../models/model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class DialogViewModel extends ViewModel {

    private dialogContainer = this.getElement<HTMLDivElement>("dialogContainer");
    private dialogBackdrop = this.getElement<HTMLDialogElement>("dialogBackdrop")
    private dialogHeader = this.getElement<HTMLDivElement>("dialogHeader");
    private dialogIcon = this.getElement<HTMLSpanElement>("dialogIcon");
    private dialogMsg = this.getElement<HTMLSpanElement>("dialogMsg");
    private dialogInput = this.getElement<HTMLSpanElement>("dialogInput");
    private dialogInputLabel = this.getElement<HTMLLabelElement>("dialogInputLabel");
    private dialogInputBox = this.getElement<HTMLInputElement>("dialogInputBox");
    private dialogCancel = this.getElement<HTMLButtonElement>("dialogCancel");
    private dialogOk = this.getElement<HTMLButtonElement>("dialogOk");

    public onCancel = () => { };
    public onOk = (inputText: string) => { };

    constructor() {
        super();
        
        this.dialogCancel.addEventListener("click", () => this.onCancel());
        this.dialogBackdrop.addEventListener("click", () => this.onCancel());
        this.dialogOk.addEventListener("click", () => this.onOk(this.dialogInputBox.value));

        this.dialogInputBox.addEventListener("keyup", () => {
            this.dialogOk.disabled = this.dialogInputBox.value.trim() === "";
        });
    }

    public openMsgBox(msgBox: DialogModel) {
        this.setBasicDialog(msgBox);

        this.dialogMsg.classList.remove("oculto");
        this.dialogInput.classList.add("oculto");
        this.dialogInputLabel.innerText = "";
        this.dialogInputBox.value = "";
        this.dialogOk.disabled = false;

        this.dialogContainer.classList.remove("oculto");
    }

    public openInputBox(inputBox: DialogModel) {
        this.setBasicDialog(inputBox);
        this.dialogMsg.classList.add("oculto");
        this.dialogInput.classList.remove("oculto");
        this.dialogMsg.innerText = ""
        this.dialogOk.disabled = true;

        this.dialogContainer.classList.remove("oculto");
    }

    private setBasicDialog(dialog: DialogModel) {
        if (dialog.titulo === undefined)
            this.dialogHeader.classList.add("oculto");

        if (dialog.icone === undefined)
            this.dialogIcon.classList.add("oculto");

        if (dialog.cancel === undefined)
            this.dialogCancel.classList.add("oculto");

        this.dialogHeader.innerText = dialog.titulo ?? "";
        this.dialogIcon.innerText = dialog.icone ?? "";
        this.dialogMsg.innerHTML = dialog.mensagem;
        this.dialogInputLabel.innerText = dialog.mensagem;
        this.dialogInputBox.value = "";
        this.dialogCancel.innerText = dialog.cancel ?? "";
        this.dialogOk.innerText = dialog.ok;
    }

    public closeDialog() {
        this.dialogContainer.classList.add("oculto");
    }

}

class DialogService extends Service {

}

class DialogComponent extends Component<DialogViewModel, DialogService> {

    private msgBoxOk?: () => void | Promise<void> = () => { };
    private inputBoxOk?: (inputText: string) => void | Promise<void> = () => { };
    private cancel?: () => void | Promise<void> = () => { };

    constructor() {
        super("dialog");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(DialogViewModel, DialogService);

        this.viewModel.onOk = async (inputText: string) => {
            this.viewModel.closeDialog();

            if (this.msgBoxOk)
                await this.msgBoxOk();

            if (this.inputBoxOk)
                await this.inputBoxOk(inputText);
        };

        this.viewModel.onCancel = async () => {
            this.viewModel.closeDialog();
            if (this.cancel)
                await this.cancel();
        };

    }

    public openMsgBox(msgBox: DialogModel, ok?: () => void | Promise<void>, cancel?: () => void | Promise<void>) {
        this.msgBoxOk = ok;
        this.inputBoxOk = undefined;
        this.cancel = cancel;
        this.viewModel.openMsgBox(msgBox);
    }

    public openInputBox(inputBox: DialogModel, ok: (inputText: string) => void | Promise<void>, cancel?: () => void | Promise<void>) {
        this.msgBoxOk = undefined;
        this.inputBoxOk = ok;
        this.cancel = cancel;
        this.viewModel.openInputBox(inputBox);
    }

    public static load(element: HTMLElement): Promise<DialogComponent> {
        return new Promise((resolve) => {

            if (!customElements.get("dialog-component"))
                customElements.define("dialog-component", DialogComponent);

            const dialogComponent = document.createElement("dialog-component") as DialogComponent;
            element.appendChild(dialogComponent);
            dialogComponent.addEventListener("initialized", () => {
                resolve(dialogComponent);
            });
        });
    }


}

export default DialogComponent;