import DateUtil from "./DateUtil";

export type ArticleJson = {
    id: number,
    title: string,
    author: string,
    date: string,
    isNew: boolean,
    haveFile: boolean
};

class Article {
    private id: number;
    private title: string;
    private author: string;
    private date: Date;
    private isNew: boolean;
    private haveFile: boolean;

    public constructor(id: number, title: string, author: string, date: Date, isNew: boolean, haveFile: boolean) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.date = date;
        this.isNew = isNew;
        this.haveFile = haveFile;
    }

    public getId(): number {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getAuthor(): string {
        return this.author;
    }

    public getDate(): Date {
        return this.date;
    }

    public getIsNew(): boolean {
        return this.isNew;
    }

    public setIsNew(value: boolean) {
        this.isNew = value;
    }

    public getHaveFile(): boolean {
        return this.haveFile;
    }

    public toJson(): ArticleJson {
        let json: ArticleJson = {
            id: this.getId(),
            title: this.getTitle(),
            author: this.getAuthor(),
            date: DateUtil.dateToDateString(this.date),
            isNew: this.getIsNew(),
            haveFile: this.getHaveFile()
        };

        return json;
    }

    static fromJson(json: ArticleJson): Article {
        return new Article(
            json.id,
            json.title,
            json.author,
            DateUtil.dateStringToDate(json.date),
            json.isNew,
            json.haveFile
        );
    }
}

export default Article;