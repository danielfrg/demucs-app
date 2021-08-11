import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { makeStyles } from "@material-ui/core/styles";

import Player from "../components/player";
import Layout from "../components/layout";

const useStyles = makeStyles((theme) => ({
    space: {},
}));

export default function Convert() {
    const router = useRouter();
    console.log(router);
    const path = router.asPath; // : "/song#asadfasdf"
    const paths = path.split("#");

    const id = paths.length < 1 ? undefined : paths[1];

    const url = `http://localhost:3000/s/${id}`;

    return (
        <Layout>
            <div className="content">
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
                                    {id ? (
                                        <Player
                                            algoFilePath={`data://danielfrg/demucs_output/${id}-bass.mp3`}
                                        ></Player>
                                    ) : null}
                                </td>
                            </tr>
                            <tr>
                                <td>Drums</td>
                                <td className="track">
                                    {id ? (
                                        <Player
                                            algoFilePath={`data://danielfrg/demucs_output/${id}-drums.mp3`}
                                        ></Player>
                                    ) : null}
                                </td>
                            </tr>
                            <tr>
                                <td>Other</td>
                                <td className="track">
                                    {id ? (
                                        <Player
                                            algoFilePath={`data://danielfrg/demucs_output/${id}-other.mp3`}
                                        ></Player>
                                    ) : null}
                                </td>
                            </tr>
                            <tr>
                                <td>Vocals</td>
                                <td className="track">
                                    {id ? (
                                        <Player
                                            algoFilePath={`data://danielfrg/demucs_output/${id}-vocals.mp3`}
                                        ></Player>
                                    ) : null}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="share-url">
                    Share URL: <a href={url}>{url}</a>
                </p>
                <p className="share-url">
                    <Link href="/">Home</Link>
                </p>
            </div>
        </Layout>
    );
}
