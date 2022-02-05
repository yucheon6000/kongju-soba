class DateUtil {
    static dateToDateString(date: Date): string {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let monthString = month < 10 ? "0" + month.toString() : month.toString();
        let dayString = day < 10 ? "0" + day.toString() : day.toString();

        return `${year}-${monthString}-${dayString}`;
    }

    static dateStringToDate(dateString: string): Date {
        let year = dateString.substring(0, 4);
        let month = dateString.substring(5, 7);
        let day = dateString.substring(8, 10);

        return new Date(Number(year), Number(month) - 1, Number(day));
    }
}

export default DateUtil;