export default class DateService {
    
    public static DataHoraLocal(): Date {
        const now = new Date();
        const brTimezoneOffset = -3 * 60;
        return new Date(now.getTime() + (brTimezoneOffset - now.getTimezoneOffset()) * 60000);
    }
    
}