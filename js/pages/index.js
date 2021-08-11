import React, { useEffect } from "react";
import Link from "next/link";

import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import FileInput from "../components/fileinput";
import Algorithm from "../lib/algorithm";
import Layout from "../components/layout";

function bufferToBase64(buffer) {
    var bytes = new Uint8Array(buffer);
    var len = buffer.byteLength;
    var binary = "";
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

const useStyles = makeStyles((theme) => ({
    space: {},
}));

export default function Convert(props) {
    const classes = useStyles();

    // const testError = {
    //     error_type: "TestError",
    //     message: "Test message",
    //     stacktrace: "From ... \nmore code",
    // };

    const [error, setError] = React.useState("");
    const [client, setClient] = React.useState(null);
    const [apiStatus, setApiStatus] = React.useState("init");
    const [converting, setConverting] = React.useState(false);

    useEffect(() => {
        const client = new Algorithm();
        setClient(client);

        client.ping().then((response) => {
            if (response.error) {
                setApiStatus("error");
                setError(response.error);
            } else {
                setApiStatus("loading");

                client.load().then((response) => {
                    if (response.error) {
                        setApiStatus("error");
                        setError(response.error);
                    } else {
                        setApiStatus("ready");
                    }
                });
            }
        });
    }, []);

    let statusText = "";
    if (apiStatus == "init") {
        statusText = "Initializing API (~1-2 mins)";
    } else if (apiStatus == "loading") {
        statusText = "Loading model (~5 mins)";
    } else if (apiStatus == "ready") {
        statusText = "Model ready";
    } else if (apiStatus == "error") {
        statusText = "Error";
    } else {
        statusText = apiStatus;
    }

    const request = (file) => {
        var reader = new FileReader();
        reader.onload = (event) => {
            const base64_file = bufferToBase64(event.target.result);

            setConverting(true);
            client.separate(base64_file).then((response) => {
                if (response.error) {
                    setError(response.error);
                } else {
                    setConverting(true);
                    const id = response.result.id;
                    props.history.push(`/s/${id}`);
                }
            });
        };
        reader.readAsArrayBuffer(file);
    };

    let errorEl;
    if (error) {
        if (typeof error === "string" || error instanceof String) {
            errorEl = (
                <div className="error">
                    <p>Error: {error}</p>
                </div>
            );
        } else {
            errorEl = (
                <div className="error">
                    <p className="stacktrace">
                        {error.error_type ? error.error_type : "Error"}:{" "}
                        {error.message}
                    </p>
                    <p className="stacktrace">{error.stacktrace}</p>
                </div>
            );
        }
    }

    return (
        <Layout>
            <div className="content">
                <Grid container>
                    <Grid item xs={12}>
                        <div className="status-line">
                            <p className="api-status">
                                API Status: {statusText}
                            </p>
                            {apiStatus == "ready" || apiStatus == "error" ? (
                                ""
                            ) : (
                                <CircularProgress size={10} color="inherit" />
                            )}
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        {errorEl ? (
                            errorEl
                        ) : converting === true ? (
                            <div className="converting">
                                <CircularProgress color="inherit" />
                                <p>... converting ...</p>
                                <p>(you will be redirected once finished)</p>
                            </div>
                        ) : (
                            <FileInput
                                enabled={apiStatus == "ready" && !converting}
                                request={request}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <p className="examples">
                            Examples:{" "}
                            <Link href="/song#cc76a1fa5ed877224d4c3a0700e3fb7ff0251d4e574bde9a756ea068d17eb3a9">
                                Mix 1
                            </Link>
                            ,{" "}
                            <Link href="/song#2d8183e9aa2e73f92ae5af614dd539d26a42685bd6ba441643e5f9c37e3703e1">
                                Mix 2
                            </Link>
                            ,{" "}
                            <Link href="/song#cc198d03f772d6da6d274e97d1011df8509efc7a1ea834ee87754ea4058f6b2b">
                                Trap
                            </Link>
                        </p>
                    </Grid>
                </Grid>
            </div>
        </Layout>
    );
}
