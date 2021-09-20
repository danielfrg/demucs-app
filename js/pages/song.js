import React from "react";
import { useRouter } from "next/router";

import Player from "../components/player";
import Layout from "../components/layout";

export default function Convert() {
    const router = useRouter();
    // console.log("Router:");
    // console.log(router);
    const path = router.asPath; // /song.html#asadfasdf
    const paths = path.split("#");

    const id = paths.length < 1 ? undefined : paths[1];

    let url = `http://localhost:8000/song.html#${id}`;
    if (typeof window !== "undefined") {
        url = `${window.location.protocol}//${window.location.hostname}${
            window.location.port ? ":" + window.location.port : ""
        }/song.html#${id}`;
    }

    if (!id) {
        return (
            <Layout>
                <div className="container mx-auto max-w-screen-md">
                    <div className="mt-10 bg-gray-700 p-10 text-center text-gray-300 font-thin">
                        <p className="results">Error: undefined song ID</p>
                        <p>
                            Go to the{" "}
                            <a className="underline hover:text-white" href="/">
                                Home page
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto max-w-screen-md">
                <div className="mt-10 bg-gray-700 p-10 text-white">
                    <div className="results">
                        <table>
                            <tbody>
                                <tr>
                                    <th>Instrument</th>
                                    <th>Track</th>
                                </tr>
                                <tr>
                                    <td>Bass</td>
                                    <td className="track">
                                        <Player id={id} track="bass"></Player>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Drums</td>
                                    <td className="track">
                                        <Player id={id} track="drums"></Player>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Other</td>
                                    <td className="track">
                                        <Player id={id} track="other"></Player>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Vocals</td>
                                    <td className="track">
                                        <Player id={id} track="vocals"></Player>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-xs text-center text-white font-thin">
                    <p className="my-1">
                        Share URL:{" "}
                        <a className="underline hover:text-gray-400" href={url}>
                            {url}
                        </a>
                    </p>
                    <p className="my-1">
                        <a className="underline hover:text-gray-400" href="/">
                            Home
                        </a>
                    </p>
                </div>
            </div>
        </Layout>
    );
}
