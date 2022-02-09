import Article, { ArticleJson } from "./Article";

export type BoardJson = {
    id: string,
    name: string,
    shortName: string,
    lastestArticleId: number,
};

class Board {
    private id: string;
    private name: string;
    private shortName: string;
    private articleList: Array<Article> = [];
    private lastestArticleId: number = 0;

    public constructor(id: string, name: string, shortName: string | null = null) {
        this.id = id;
        this.name = name;

        if (shortName)
            this.shortName = shortName;
        else
            this.shortName = name;
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getShortName(): string {
        return this.shortName;
    }

    private setLastestArticleId(id: number) {
        this.lastestArticleId = id;
    }

    public getLastestArticleId(): number {
        return this.lastestArticleId;
    }

    /**
     * 보드를 확인했을 때, 사용하는 함수   
     * 모든 Article의 isNew 상태를 false로 바꾼다.
     */
    public checkBoard() {
        this.articleList.map(article => {
            if (!article.getIsNew())
                article.setIsNew(true);
        })
    }

    /**
     * 게시글을 보드에 추가하는 함수
     * @param article 추가할 게시글
     */
    public addArticle(article: Article) {
        let index = this.articleList.indexOf(article);
        if (index >= 0) return;

        this.articleList.push(article);

        // 최신 아이디인지 확인
        let id = article.getId();
        if (id > this.getLastestArticleId())
            this.setLastestArticleId(id);

        // 정렬
        this.articleList.sort((a, b) => b.getId() - a.getId());
    }

    /**
     * 게시글을 보드에서 삭제하는 함수
     * @param article 삭제할 게시글
     */
    public removeArticle(article: Article) {
        let index = this.articleList.indexOf(article);
        if (index < 0) return;

        this.articleList.splice(index, 1);
    }

    public getArticleList(): Array<Article> {
        return this.articleList.slice();
    }

    public equal(board: Board): boolean {
        let flag = false;
        if (this.getId() == board.getId()
            && this.getName() == board.getName()
            && this.getShortName() == board.getShortName())
            flag = true;

        return flag;
    }

    public toJson(): BoardJson {
        let articleJsonList: Array<ArticleJson> = [];
        this.articleList.map(
            article => articleJsonList.push(article.toJson())
        );

        let json: BoardJson = {
            id: this.getId(),
            name: this.getName(),
            shortName: this.getShortName(),
            lastestArticleId: this.getLastestArticleId(),
        };

        return json;
    }

    public static fromJson(json: BoardJson): Board {
        let board = new Board(json.id, json.name, json.shortName);
        if (json.lastestArticleId)
            board.setLastestArticleId(json.lastestArticleId);
        else
            board.setLastestArticleId(0);
        return board;
    }
}

export default Board;