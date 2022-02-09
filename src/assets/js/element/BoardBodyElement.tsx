import React from "react";
import Board from "../common/Board";
import Article from "../common/Article";
import ArticleListElement, { OnClickArticleListElemenet } from "./ArticleListElement";

import "../../css/BoardBodyElement.css"
import { FiInbox } from "react-icons/fi";

export type Props = {
    selected: boolean,
    board: Board,
    onClick: OnClickArticleListElemenet,
    lastUpdateDate: Date
};

interface State {
    articleList: Array<Article>,
    selected: boolean
}

class BoardBodyElement extends React.Component<Props, State> {
    key: number = 0;

    constructor(props: Props) {
        super(props);
        this.state = {
            articleList: props.board.getArticleList(),
            selected: props.selected
        }
    }

    componentDidUpdate() {
        this.setState({
            articleList: this.props.board.getArticleList(),
            selected: this.props.selected
        });
    }

    public render() {
        return (
            <div className={`board_body_element_container ${this.state.selected ? "selected" : ""}`}>
            {
                this.state.articleList.length > 0
                ? this.state.articleList.map(article => {
                    return <ArticleListElement key={this.key++} board={this.props.board} article={article} onClick={this.props.onClick}/>
                })
                : <div className="null">
                    <div className="null_image"><FiInbox /></div>
                    <div className="null_text">새로운 글이 없습니다</div>
                </div>
            }
            </div>
        );
    }
}

export default BoardBodyElement;