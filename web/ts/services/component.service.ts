import DialogComponent from "../components/dialog.component";

export default class ComponentService {
    
    /**
     * Adiciona um dialog-component no form existente.
     * @returns dialog-component
     */
    public static loadDialog(element: HTMLElement): Promise<DialogComponent> {
        return new Promise((resolve) => {
            customElements.define("dialog-component", DialogComponent);
            const dialogComponent = document.createElement("dialog-component") as DialogComponent;
            element.appendChild(dialogComponent);
            dialogComponent.addEventListener("initialized", () => {
                resolve(dialogComponent);
            });
        });
    }

}