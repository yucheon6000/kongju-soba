import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
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
            <View>
                <ScrollView>
                    {
                        this.state.articleList.map(article => {
                            return (<Text key={this.key++}>{article.toString()}</Text>);
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}

export default MainScreen;