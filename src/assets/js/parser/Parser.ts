import Article from "../common/Article";
import Board from "../common/Board";
import DateUtil from "../util/DateUtil";
import UrlUtil from "../util/UrlUtil";
import * as cheerio from 'cheerio';

export type ParseBoardCallback = () => void;

class Parser {
    private board: Board;

    public constructor(board: Board) {
        this.board = board;
    }

    private async parserBoard(body: string): Promise<Article[]> {
        const $ = cheerio.load(body);

        let result: Array<Article> = [];

        let $board = $(".board-table");
        let $trs = $("tbody tr", $board);

        $trs.each((_: number, tr: any) => {
            let $tr = $(tr);
            if ($tr.hasClass("notice")) return;

            // 제목
            let $title = $(".td-subject", $tr);
            let title = `${$(".cate", $title).text()} ${$("strong", $title).text()}`;
            $(".new", $title).remove();

            // 아이디
            let $a = $("a", $title);
            let href = $a.attr("href") as string;
            let splitedHref = href.split("/");
            let id = parseInt(splitedHref[splitedHref.length - 2]);

            // 작성자
            let $author = $(".td-write", $tr);
            let author = $author.text().trim();

            // 날짜
            let $date = $(".td-date", $tr);
            let date = $date.text().replace(/\./gi, "-");

            // 파일 여부
            let haveFile = $(".td-file .fileok", $tr).length > 0;

            // 결과 (Article)
            let article = new Article(id, title, author, DateUtil.dateStringToDate(date), true, haveFile);

            result.push(article);
        });

        return result;
    }

    public async getBoard(): Promise<Board> {
        let lastestArticleId = this.board.getLatestArticleId();
        let page = 0;

        while (true) {
            page++;
            let uri = UrlUtil.getBoardUrl(this.board, page);
            let response = await fetch(uri);
            let body = await response.text();
            let articleList = await this.parserBoard(body);

            let breakFlag = false;

            for (let article of articleList) {
                if (article.getId() > lastestArticleId)
                    this.board.addArticle(article)
                else
                    breakFlag = true;
            }

            if (breakFlag) break;
        }

        return this.board;
    }

    public async getLastestArticleId(): Promise<number> {
        let uri = UrlUtil.getBoardUrl(this.board);
        let response = await fetch(uri);
        let body = await response.text();
        let articleList = await this.parserBoard(body);

        articleList.sort((a, b) => b.getId() - a.getId());

        return articleList[0].getId();
    }
}

export default Parser;