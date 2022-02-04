import Article from "./Article";

class Board {
    private id: number;
    private name: string;
    private articleList: Array<Article> = [];
    private latestArticleId: number = 0;

    public constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    private setLatestArticleId(id: number) {
        this.latestArticleId = id;
    }

    public getLatestArticleId(): number {
        return this.latestArticleId;
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
        if (id > this.getLatestArticleId())
            this.setLatestArticleId(id);
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

    public toJson(): any {
        let articleList: any[] = [];
        this.articleList.map(
            article => articleList.push(article.toJson())
        );


        let json = {
            id: this.getId(),
            name: this.getName(),
            articleList,
            latestArticleId: this.getLatestArticleId(),
        };

        return json;
    }

    static fromJson(json: any): Board {
        let board = new Board(json.id, json.name);

        json.articleList.map((articleJson: any) => {
            let article = Article.fromJson(articleJson);
            board.addArticle(article);
        })

        return board;
    }
}

export default Board;