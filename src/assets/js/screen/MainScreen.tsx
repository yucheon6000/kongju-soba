import React from "react";
import Board, {BoardJson} from "../common/Board";
import Article from "../common/Article";
import Parser from "../parser/Parser";
import UriFormatter, { UriFormat } from "../common/UriFormatter";
import BoardHeaderElement from "../element/BoardHeaderElement";

import "../../css/MainScreen.css";
import { FiMoreHorizontal, FiX, FiRefreshCw, FiSettings, FiLoader } from "react-icons/fi";

import defaultSettingJson from "../../json/setting.json";
import BoardBodyElement from "../element/BoardBodyElement";
import SettingElement from "../element/SettingElement";

export type Props = {};

export type State = {
    currentBoard: Board|null,
    boardList: Array<Board>,
    showMenuButton: boolean,
    boardInfo: any,
    lastUpdateDate: Date,
    refresh: boolean,
    setting: boolean
};

class MainScreen extends React.Component<Props, State> {
    private key: number = 0;

    private uriFormat: UriFormat = { boardUri: "", articleUri: "" };
    private uriFormatter: UriFormatter = new UriFormatter(this.uriFormat);

    public constructor(props: Props) {
        super(props);
        
        this.state = {
            currentBoard: null,
            boardList: [],
            showMenuButton: false,
            boardInfo: {},
            lastUpdateDate: new Date(),
            refresh: false,
            setting: false
        };
    }

    public componentDidMount() {
        this.loadSetting(() => { 
            this.refresh(true, () => {
                this.saveSetting();
            });
        });
    }

    private loadSetting(callback: Function|undefined = undefined) {
        let localSettingJsonString = localStorage.getItem("setting");
        let settingJson;

        // Board
        let boardList: Array<Board> = [];
        let boardInfo: any = {};

        if(localSettingJsonString)
            settingJson = JSON.parse(localSettingJsonString);
        else
            settingJson = defaultSettingJson;

        (settingJson.boardList as unknown as Array<BoardJson>).map(boardJson => {
            boardJson = boardJson as BoardJson;
            let board = Board.fromJson(boardJson);
            boardList.push(board);
            boardInfo[board.getId()] = {
                                            isNew: false,
                                            lastestArticleId: board.getLastestArticleId()
                                        };
        });

        // UriFormatter
        this.uriFormat = settingJson.uriFormat as UriFormat;
        this.uriFormatter = new UriFormatter(this.uriFormat);

        this.setState({ boardList, boardInfo }, () => { if(callback) callback(); });
    }

    private saveSetting() {
        let setting: any = { };
        setting.boardList = [ ];

        this.state.boardList.map(board => {
            setting.boardList.push(board.toJson());
        })

        setting.uriFormat = this.uriFormat;
        
        let settingJsonString = JSON.stringify(setting);

        localStorage.setItem("setting", settingJsonString);
    }

    private refresh(selectFirstBoard: boolean = false, callback: Function|undefined = undefined) {
        this.setState({ refresh: true });

        let boardMaxCount = this.state.boardList.length;
        let boardCount = 0;
        
        let boardInfo = { ...this.state.boardInfo };

        this.state.boardList.map((board, index) => {
            let parser = new Parser(board, this.uriFormatter);
            let lastestArticleId = board.getLastestArticleId();

            parser.getBoard().then(board => {
                // 새로운 글 체크
                let boardId = board.getId();
                let newLastestArticleId = board.getLastestArticleId();
                if(newLastestArticleId > lastestArticleId)
                    boardInfo[boardId].isNew = true;

                boardInfo[boardId].lastestArticleId = newLastestArticleId;

                // 첫번째 보드 선택
                if(selectFirstBoard && index == 0)
                    this.onClickBoardHeaderElement(board);

                // 마지막 업데이트 날짜 갱신
                boardCount++;
                if(boardCount == boardMaxCount)
                    this.setState({ lastUpdateDate: new Date(), refresh: false, boardInfo }, () => { if(callback) callback(); });
            });
        });
    }

    public onClickMenuButton() {
        let showMenuButton = !this.state.showMenuButton;
        this.setState({ showMenuButton });
    }

    public onClickRefreshButton() {
        this.refresh(false, () => {
            this.saveSetting();
        })
    }

    public onClickSettingButton() {
        this.setState({ setting: true });
    }

    public onClickBoardHeaderElement(board: Board) {
        this.state.boardInfo[board.getId()].isNew = false;

        this.setState({
            currentBoard: board,
            boardInfo: { ...this.state.boardInfo }
        });
    }

    public onClickArticle(article: Article) {
        if(!this.state.currentBoard) return;

        let api = (window as any).api;
        let uri: string = this.uriFormatter.getArticleUri(this.state.currentBoard, article);
        api.send("openArticle", uri);
    }

    public onCancelSetting() {
        this.setState({ setting: false });
    }

    public onConfirmSetting(boardList: Array<Board>) {
        let boardInfo: any = {};

        boardList.map(board => {
            boardInfo[board.getId()] = {
                isNew: false,
                lastestArticleId: board.getLastestArticleId()
            };
        })

        this.setState({ boardList, boardInfo, setting: false, lastUpdateDate: new Date(0) }, () => {
            this.refresh(true, () => {
                this.saveSetting();
            })
        });
    }

    public render() {
        return (
            <div className="main_screen_container">
                <div onClick={this.onClickMenuButton.bind(this)} className="menu_button button">
                    {
                        this.state.showMenuButton
                        ? <FiX />
                        : <FiMoreHorizontal />
                    }
                </div>

                <div className={`menu_button_group ${this.state.showMenuButton ? "show" : ""}`}>
                    <div onClick={this.onClickRefreshButton.bind(this)} className={`button ${this.state.refresh ? "rotate" : ""}`}><FiRefreshCw /></div>
                    <div onClick={this.onClickSettingButton.bind(this)} className="button"><FiSettings /></div>
                    <div className="hidden_button button"><FiMoreHorizontal /></div>
                </div>

                <div className="header_container">
                {
                    this.state.boardList.map(
                        board => <BoardHeaderElement
                                    key={this.key++}
                                    board={board}
                                    selected={this.state.currentBoard == board}
                                    isNew={this.state.boardInfo[board.getId()].isNew}
                                    onClick={this.onClickBoardHeaderElement.bind(this)} />
                    )
                }
                </div>
                
                <div className="body_container">
                {
                    this.state.currentBoard != null && !this.state.refresh
                    ? this.state.boardList.map(
                        board => <BoardBodyElement
                                    key={this.key++}
                                    board={board}
                                    selected={board == this.state.currentBoard}
                                    lastUpdateDate={this.state.lastUpdateDate}
                                    onClick={this.onClickArticle.bind(this)}/>
                    )
                    : <div className="loading">
                        <div className="loading_image"><FiLoader /></div>
                        <div className="loading_text">로딩 중..</div>
                    </div>
                }
                </div>

                {
                    this.state.setting &&
                    <SettingElement boardList={this.state.boardList} onConfirm={this.onConfirmSetting.bind(this)} onCancel={this.onCancelSetting.bind(this)} />
                }
            </div>
        );
    }
}

export default MainScreen;