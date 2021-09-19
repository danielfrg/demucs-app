import React, { useState, useEffect } from 'react';

import Algorithm from "../lib/algorithm";
import CircularProgress from "@material-ui/core/CircularProgress";


export default function Player({ id, track }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(0);

    const client = new Algorithm();
    const host = client.getHost();
    const url = `${host}/file/${id}/${track}`

    useEffect(() => {
        fetch(url, { method: "HEAD" }).then(response => {
            if (response.status == 200) {
                setLoading(false);
            }
            else {
                setError("File not found")
            }
        });
    });

    if (error) {
        return (
            <div className="player">
                <p>{error}</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="player">
                <CircularProgress color="primary" size={20} />
            </div>
        );
    }

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
