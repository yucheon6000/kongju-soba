import React from "react";
import Article from "../common/Article";
import Board from "../common/Board";
import DateUtil from "../util/DateUtil";

import "../../css/ArticleListElement.css"

export type Props = {
    board: Board
    article: Article,
    onClick: OnClickArticleListElemenet
};

interface State {
    isNew: boolean,
    haveFile: boolean
};

export type OnClickArticleListElemenet = (article: Article) => void;

class ArticleListElement extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            isNew: props.article.getIsNew(),
            haveFile: props.article.getHaveFile()
        }
    }

    private onClick() {
        this.props.article.setIsNew(false);
        this.setState({ isNew: this.props.article.getIsNew() });
        this.props.onClick(this.props.article);
    }

    public render() {
        let article = this.props.article;
        return (
            <div className="article_list_element_container" onClick={this.onClick.bind(this)}>
                <div className={`is_new ${this.state.isNew ? "show" : ""}`}>N</div>
                <div className={`title ${this.state.isNew ? "" : "checked"}`}>{article.getTitle()}</div>
                <div className="date_and_author">{article.getAuthor()} {DateUtil.dateToDateString(article.getDate())}</div>
            </div>
        );
    }
}

export default ArticleListElement;