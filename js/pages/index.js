import React, { useEffect } from "react";
import { useRouter } from "next/router";

import FileInput from "../components/fileinput";
import Algorithm from "../lib/algorithm";
import Layout from "../components/layout";

export default function Convert(props) {
    const router = useRouter();
    const testError = {
        error_type: "TestError",
        message: "Test message",
        stacktrace: "From ... \nmore code",
    };
    const [error, setError] = React.useState("");
    const [client, setClient] = React.useState(null);
    const [apiStatus, setApiStatus] = React.useState("init");
    const [converting, setConverting] = React.useState(false);

    useEffect(() => {
        // ping and load handshake
        const client = new Algorithm();
        setClient(client);

        if (client.host == "algorithmia") {
            // Algorithmia handshake
            client.live().then((response) => {
                console.log("Algo Live:");
                console.log(response);

                if (response.error) {
                    setApiStatus("error");
                    setError(response.error);
                } else {
                    setApiStatus("loading");

                    client.load().then((response) => {
                        console.log("Algo Load:");
                        console.log(response);

                        if (response.error) {
                            setApiStatus("error");
                            setError(response.error);
                        } else {
                            setApiStatus("ready");
                        }
                    });
                }
            });
        } else {
            // Our own API handshake
            client
                .live()
                .then((response) => response.json())
                .then((response) => {
                    console.log("Live:");
                    console.log(response);

                    if (response == "OK") {
                        setApiStatus("loading");

                        client
                            .load()
                            .then((response) => response.json())
                            .then((response) => {
                                console.log("Load:");
                                console.log(response);

                                if (response == "OK") {
                                    setApiStatus("ready");
                                } else {
                                    setApiStatus("error");
                                    setError(response.detail);
                                }
                            });
                    } else {
                        setApiStatus("error");
                        setError(response.detail);
                    }
                })
                .catch((error) => {
                    console.log("Live error:");
                    console.error(error);
                    setApiStatus("error");
                    setError(error);
                });
        }
    }, []);

    let statusText = "";
    if (apiStatus == "init") {
        statusText = "Initializing API";
    } else if (apiStatus == "loading") {
        statusText = "Loading model";
    } else if (apiStatus == "ready") {
        statusText = "Model ready";
    } else if (apiStatus == "error") {
        statusText = "Error";
    } else {
        statusText = apiStatus;
    }

    const request = (file) => {
        setConverting(true);

        if (client.host == "algorithmia") {
            // Algorithmia request
            var reader = new FileReader();
            reader.onload = (event) => {
                client.separate(event.target.result).then((response) => {
                    console.log("Algo API Response:");
                    console.log(response);

                    if (response.error) {
                        setError(response.error);
                    } else {
                        setConverting(false);
                        const id = response.result.id;
                        router.push(`/song.html#${id}`);
                    }
                });
            };
            reader.readAsArrayBuffer(file);
        } else {
            // Our API request request
            client
                .separate(file)
                .then((response) => response.json())
                .then((response) => {
                    console.log("Separate:");
                    console.log(response);

                    if (typeof response === "string") {
                        setConverting(false);
                        const id = response;
                        console.log(id);
                        // router.push(`/song#${id}`);
                        router.push(`/song.html#${id}`);
                    } else {
                        setApiStatus("error");
                        setError(response.detail);
                    }
                })
                .catch((error) => {
                    setApiStatus("error");
                    setError(error);
                });
        }
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
                <div className="my-5 font-mono text-md text-gray-300">
                    <p>
                        {error.error_type ? error.error_type : "Error"}:{" "}
                        {error.message}
                    </p>
                    <p>{error.detail}</p>
                    <p>{error.stacktrace}</p>
                </div>
            );
        }
    }

    return (
        <Layout>
            <div className="container mx-auto max-w-screen-md">
                <div className="flex flex-col justify-between">
                    <p className="text-center text-gray-300 text-xs font-light">
                        API Status: {statusText}
                    </p>
                </div>
                <div>
                    {errorEl ? (
                        errorEl
                    ) : converting === true ? (
                        <div className="my-10 text-center text-gray-300 font-light">
                            <p>... converting ...</p>
                            <p>
                                (don't close this tab you will be redirected
                                once finished)
                            </p>
                        </div>
                    ) : (
                        <FileInput
                            enabled={apiStatus == "ready" && !converting}
                            request={request}
                        />
                    )}
                </div>
                <div>
                    <p className="text-center text-gray-100 font-thin text-sm mt-0">
                        Examples:{" "}
                        <a
                            className="underline hover:text-gray-400"
                            href="/song.html#cc76a1fa5ed877224d4c3a0700e3fb7ff0251d4e574bde9a756ea068d17eb3a9"
                        >
                            Mix 1
                        </a>
                        ,{" "}
                        <a
                            className="underline hover:text-gray-400"
                            href="/song.html#2d8183e9aa2e73f92ae5af614dd539d26a42685bd6ba441643e5f9c37e3703e1"
                        >
                            Mix 2
                        </a>
                        ,{" "}
                        <a
                            className="underline hover:text-gray-400"
                            href="/song.html#cc198d03f772d6da6d274e97d1011df8509efc7a1ea834ee87754ea4058f6b2b"
                        >
                            Trap
                        </a>
                    </p>
                </div>
            </div>
        </Layout>
    );
}
