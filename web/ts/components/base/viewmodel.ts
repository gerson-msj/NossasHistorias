import DialogComponent from "../dialog.component";

export default abstract class ViewModel {

    
    
    constructor() {
        
    }

    protected getElement<T>(name: string): T {
        return document.querySelector(`#${name}`) as T;
    }

    // protected loadDialogComponent(): DialogComponent {
    //     this.form = document.querySelector("form") as HTMLFormElement;
    //     customElements.define("dialog-component", DialogComponent);
    //     const dialogComponent = document.createElement("dialog-component") as DialogComponent;
    //     this.form.appendChild(dialogComponent);
    //     return dialogComponent;
    // }

    
}