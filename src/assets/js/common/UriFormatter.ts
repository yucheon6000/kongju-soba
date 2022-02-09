import Board from "./Board";
import Article from "./Article";

export type UriFormat = {
    boardUri: string,
    articleUri: string
}

class UriFormatter {
    private uriFormat: UriFormat;

    public constructor(uriFormat: UriFormat) {
        this.uriFormat = uriFormat;
    }

    public setUriFormat(urlFormat: UriFormat) {
        this.uriFormat = urlFormat;
    }

    public getUriFormat(): UriFormat {
        return this.uriFormat;
    }

    public getBoardUri(board: Board, page: number = 1): string {
        let url = this.uriFormat.boardUri;
        url = url.replace(/\{Board.id}/gi, `${board.getId()}`);
        url = url.replace(/\{page}/gi, `${page}`);

        return url;
    }

    public getArticleUri(board: Board, article: Article): string {
        let url = this.uriFormat.articleUri;
        url = url.replace(/\{Board.id}/gi, `${board.getId()}`);
        url = url.replace(/\{Article.id}/gi, `${article.getId()}`);

        return url;
    }
}

export default UriFormatter;