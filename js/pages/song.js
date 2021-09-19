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
    // console.log("Router:");
    // console.log(router);
    const path = router.asPath; // /song.html#asadfasdf
    const paths = path.split("#");

    const id = paths.length < 1 ? undefined : paths[1];

    let url = `http://localhost:8000/song.html#${id}`;
    if (typeof window !== 'undefined') {
        url = `${window.location.protocol}//${window.location.hostname}${window.location.port?':'+window.location.port:''}/song.html#${id}`;
     }

    if (!id) {
        return <Layout>
            <div className="content">
                <div className="results">
                    Error: undefined song ID. Go to the <Link href="/">Home page</Link>.
                </div>
            </div>
        </Layout>
    }

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
                                    <Player
                                        id={id}
                                        track="bass"
                                    ></Player>
                                </td>
                            </tr>
                            <tr>
                                <td>Drums</td>
                                <td className="track">
                                    <Player
                                        id={id}
                                        track="drums"
                                    ></Player>
                                </td>
                            </tr>
                            <tr>
                                <td>Other</td>
                                <td className="track">
                                    <Player
                                        id={id}
                                        track="other"
                                    ></Player>
                                </td>
                            </tr>
                            <tr>
                                <td>Vocals</td>
                                <td className="track">
                                    <Player
                                        id={id}
                                        track="vocals"
                                    ></Player>
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
