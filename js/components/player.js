import React from "react";

import Algorithm from "../lib/algorithm";
import CircularProgress from "@material-ui/core/CircularProgress";

class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            result: "",
            error: "",
        };
    }

    componentDidMount() {
        const { algoFilePath } = this.props;

        const client = new Algorithm();

        client.getFile(algoFilePath).then((response) => {
            if (response.error) {
                this.setState({
                    loading: false,
                    error: response.error,
                });
            } else {
                this.setState({
                    loading: false,
                    result: response.result,
                });
            }
        });
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="player">
                    <CircularProgress color="primary" size={20} />
                </div>
            );
        }

        if (this.state.error) {
            return (
                <div className="error">
                    <p className="stacktrace">
                        {this.state.error.error_type
                            ? this.state.error.error_type
                            : "Error"}
                        : {this.state.error.message}
                    </p>
                    <p className="stacktrace">{this.state.error.stacktrace}</p>
                </div>
            );
        }

        return (
            <div className="player">
                <audio controls>
                    <source
                        src={`data:audio/mp3;base64,${this.state.result}`}
                        type="audio/mp3"
                    />
                </audio>
            </div>
        );
    }
}

export default Player;
