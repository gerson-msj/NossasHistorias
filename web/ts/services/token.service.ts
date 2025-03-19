
export default class TokenService {

    static possuiToken(): boolean {
        const tokenSub = this.obterTokenSubject();
        return tokenSub !== null;
    }
    
    static verificarToken(): boolean {
        const tokenSub = this.obterTokenSubject();
        if (tokenSub == null) {
            document.dispatchEvent(new Event("unauthorized"));
            return false;
        }

        return true;
    }

    static obterTokenSubject(): number | null {
        try {
            const token = localStorage.getItem("token");
            const payload: { sub: number } = JSON.parse(atob(token!.split(".")[1]));
            return payload.sub;
        } catch (error) {
            return null;
        }
    }

    
}