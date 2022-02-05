import React from "react";
import Board from "../common/Board";
import Article from "../common/Article";
import Parser from "../parser/Parser";

export type Props = {};

export type State = {
    articleList: Array<Article>
};

const TestBoard = new Board("kongju/1521", "학생 소식");
TestBoard.setLatestArticleId(249000);

class MainScreen extends React.Component<Props, State> {
    key: number = 0;

    constructor(props: Props) {
        super(props);
        this.state = {
            articleList: []
        };
    }

    componentDidMount() {
        let a = new Parser(TestBoard);
        a.getBoard()
        .then(board => {
            this.setState({
                articleList: board.getArticleList()
            });
        });
    }

    render() {
        return (
            <div>
                {
                    <div>{this.state.articleList.map(article => {
                        return <div>{article.toString()}</div>
                    })}</div>
                }
            </div>
        );
    }
}

export default MainScreen;