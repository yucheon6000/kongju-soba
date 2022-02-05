import Board from "../common/Board";
import Article from "../common/Article";

export type UrlFormat = {
    boardUrl: string,
    articleUrl: string
}

class UrlUtil {
    private static urlFormat: UrlFormat = {
        boardUrl: "https://www.kongju.ac.kr/bbs/{Board.id}/artclList.do?page={page}",
        articleUrl: "https://www.kongju.ac.kr/bbs/{Board.id}/{Article.id}/artclView.do"
    };

    public static setUrlFormat(urlFormat: UrlFormat) {
        this.urlFormat = urlFormat;
    }

    public static getBoardUrl(board: Board, page: number = 1): string {
        let url = this.urlFormat.boardUrl;
        url = url.replace(/\{Board.id}/gi, `${board.getId()}`);
        url = url.replace(/\{page}/gi, `${page}`);

        return url;
    }

    public static getArticleUrl(board: Board, article: Article): string {
        let url = this.urlFormat.articleUrl;
        url = url.replace(/\{Board.id}/gi, `${board.getId()}`);
        url = url.replace(/\{Article.id}/gi, `${article.getId()}`);

        return url;
    }
}

export default UrlUtil;