import React, { Fragment } from "react";
import { Redirect, Link } from "react-router-dom";

import FileInput from "../Convert/FileInput";
import DemucsAPI from "./algorithm";

class Convert extends React.Component {
    constructor(props) {
        super(props);

        this.client = new DemucsAPI();

        // const testError = {
        //         error_type: "TestError",
        //         message: "Test message",
        //         stacktrace: "From ... \nmore code",
        //     }

        this.state = {
            apiStatus: "init",
            error: "",
            // error: testError,
            converting: false,
        };
    }

    componentDidMount() {
        this.client.health().then((response) => {
            if (response.error) {
                this.setState({
                    apiStatus: "error",
                    error: response.error,
                });
            } else {
                if (response.result.status == "live") {
                    this.setState({ apiStatus: "loading" });

                    this.client.load().then((response) => {
                        if (response.error) {
                            this.setState({
                                apiStatus: "error",
                                error: response.error,
                            });
                        } else {
                            this.setState({ apiStatus: "ready" });
                        }
                    });
                } else if (response.result.status == "model_loaded") {
                    this.setState({ apiStatus: "ready" });
                }
            }
        });
    }

    bufferToBase64 = (buffer) => {
        var bytes = new Uint8Array(buffer);
        var len = buffer.byteLength;
        var binary = "";
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    request = (file) => {
        var reader = new FileReader();
        reader.onload = (event) => {
            const base64_file = this.bufferToBase64(event.target.result);

            this.setState({ converting: true });
            this.client.separate(base64_file).then((response) => {
                if (response.error) {
                    this.setState({
                        error: response.error,
                    });
                } else {
                    this.setState({
                        converting: false,
                    });
                    const id = response.result.id;
                    this.props.history.push(`/s/${id}`);
                    // <Redirect to={} />;
                }
            });
        };
        reader.readAsArrayBuffer(file);
    };

    render() {
        // <Redirect
        //     to={`/s/2d8183e9aa2e73f92ae5af614dd539d26a42685bd6ba441643e5f9c37e3703e1`}
        // />;

        let statusText = "";
        if (this.state.apiStatus == "init") {
            statusText = "Initializing API (~1-2 mins)";
        } else if (this.state.apiStatus == "loading") {
            statusText = "Loading model (~5 mins)";
        } else if (this.state.apiStatus == "ready") {
            statusText = "Model ready";
        } else if (this.state.apiStatus == "error") {
            statusText = "Error";
        } else {
            statusText = this.state.apiStatus;
        }

        const spinnerEl = (
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        );

        const statusEl = (
            <div className="status-line">
                <p className="api-status">API Status: {statusText}</p>
                {this.state.apiStatus == "ready" ||
                this.state.apiStatus == "error"
                    ? ""
                    : spinnerEl}
            </div>
        );

        if (this.state.error) {
            if (
                typeof this.state.error === "string" ||
                this.state.error instanceof String
            ) {
                return (
                    <Fragment>
                        {statusEl}
                        <div className="error">
                            <p>Error: {this.state.error}</p>
                        </div>
                    </Fragment>
                );
            } else {
                return (
                    <Fragment>
                        {statusEl}
                        <div className="error">
                            <p>
                                {this.state.error.error_type
                                    ? this.state.error.error_type
                                    : "Error"}
                                : {this.state.error.message}
                            </p>
                            <p className="stacktrace">
                                {this.state.error.stacktrace}
                            </p>
                        </div>
                    </Fragment>
                );
            }
        }

        return (
            <Fragment>
                {statusEl}
                <div className="content">
                    <FileInput
                        enabled={
                            this.state.apiStatus == "ready" &&
                            !this.state.converting
                        }
                        request={this.request}
                    />

                    <p className="examples">
                        Examples:{" "}
                        <Link to="/s/cc76a1fa5ed877224d4c3a0700e3fb7ff0251d4e574bde9a756ea068d17eb3a9">
                            Mix 1
                        </Link>
                        ,{" "}
                        <Link to="/s/2d8183e9aa2e73f92ae5af614dd539d26a42685bd6ba441643e5f9c37e3703e1">
                            Mix 2
                        </Link>
                        ,{" "}
                        <Link to="/s/c0a2c345ead4878850d33501d94c41336dd4b8887e9f1de5d14e6fb5810c7c7c">
                            Trap
                        </Link>
                    </p>

                    {this.state.converting === true ? (
                        <div className="loader">... converting ...</div>
                    ) : (
                        ""
                    )}
                </div>
            </Fragment>
        );
    }
}

export default Convert;
