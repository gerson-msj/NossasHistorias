import Context from "./context.ts";

export default interface IController {
    setNext(controller: IController): IController;
    handle(context: Context): Promise<Response>;
}