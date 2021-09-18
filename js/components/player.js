import React from "react";

import Algorithm from "../lib/algorithm";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function Player({ id, track }) {
    const client = new Algorithm();
    const host = client.getHost();
    const url = `${host}/file/${id}/${track}`

    return (
        <div className="player">
            <audio controls>
                <source
                    src={url}
                    type="audio/mp3"
                />
            </audio>
        </div>
    );
}
