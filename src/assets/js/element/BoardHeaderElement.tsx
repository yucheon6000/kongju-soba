import React from "react";
import Board from "../common/Board";

import "../../css/BoardHeaderElement.css";

export type Props = {
    board: Board,
    selected: boolean,
    isNew: boolean,
    onClick: onClickBoardHeaderElement;
};

interface State {
    isNew: boolean
};

export type onClickBoardHeaderElement = (board: Board) => void;

class BoardHeaderElement extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            isNew: props.isNew
        };
    }

    private onClick() {
        this.props.onClick(this.props.board);
    }

    public render() {
        return (
            <div className={`board_header_element_container ${this.props.selected ? "selected" : ""}`} onClick={this.onClick.bind(this)}>
                <div className={`is_new ${this.state.isNew ? "show" : ""}`}></div>
                <div className="name">{this.props.selected ? this.props.board.getName() : this.props.board.getShortName()}</div>
            </div>
        );
    }
}

export default BoardHeaderElement;