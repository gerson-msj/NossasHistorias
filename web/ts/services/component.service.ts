import DialogComponent from "../components/dialog.component";

export default class ComponentService {
    
    /**
     * Adiciona um dialog-component no form existente.
     * @returns dialog-component
     */
    public static loadDialog(): DialogComponent {
        const form = document.querySelector("form") as HTMLFormElement;
        customElements.define("dialog-component", DialogComponent);
        const dialogComponent = document.createElement("dialog-component") as DialogComponent;
        form.appendChild(dialogComponent);
        return dialogComponent;
    }

}