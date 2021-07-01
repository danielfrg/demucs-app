import React from "react";

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
        const { client, algoFilePath } = this.props;

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
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
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
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio controls>
                <source
                    src={`data:audio/mp3;base64,${this.state.result}`}
                    type="audio/mp3"
                />
            </audio>
        );
    }
}

export default Player;
