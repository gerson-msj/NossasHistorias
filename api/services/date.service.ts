export default class DateService {
    
    public static DataHoraLocal(): Date {
        const now = new Date();
        const brTimezoneOffset = -3 * 60;
        return new Date(now.getTime() + (brTimezoneOffset - now.getTimezoneOffset()) * 60000);
    }

    public static DiaAtual(): number {
        const dt = new Date();
        const fatorDia = 1000 * 60 * 60 * 24;
        return Math.floor(dt.valueOf() / fatorDia);
    }
    
}