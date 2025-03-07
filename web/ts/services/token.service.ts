import { Perfil } from "../models/const.model";
import { TokenSubjectModel } from "../models/model";

export default class TokenService {

    static VerificarToken(perfil: Perfil): boolean {
        const tokenSub = this.obterTokenSubject();
        if (tokenSub == null || tokenSub.perfil != perfil) {
            document.dispatchEvent(new Event("unauthorized"));
            return false;
        }

        return true;
    }

    static obterTokenSubject(): TokenSubjectModel | null {
        try {
            const token = localStorage.getItem("token");
            const payload: { sub: TokenSubjectModel, exp: number } = JSON.parse(atob(token!.split(".")[1]));
            return payload.sub;
        } catch (error) {
            return null;
        }
    }

}