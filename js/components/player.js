import React, { useState, useEffect } from "react";

import Algorithm from "../lib/algorithm";

export default function Player({ id, track }) {
    const [loading, setLoading] = useState(true);
    const [mp3, setMP3] = useState("");
    const [error, setError] = useState(0);

    const host = process.env.NEXT_PUBLIC_API_HOST;
    const url = `${host}/file/${id}/${track}`;

    useEffect(() => {
        if (host == "algorithmia") {
            setLoading(true);

            const client = new Algorithm();

            client.getFile(id, track).then((response) => {
                if (response.error) {
                    console.log("Getting file from algo failed");
                    setLoading(false);
                    setError(response.error);
                } else {
                    console.log("Getting file from algo OK");
                    setLoading(false);
                    setMP3(response.result);
                }
            });
        } else {
            fetch(url, { method: "HEAD" }).then((response) => {
                if (response.status == 200) {
                    setLoading(false);
                } else {
                    setError("File not found");
                }
            });
        }
    }, []);

    if (error) {
        return (
            <div className="text-sm text-center">
                <p>{error}</p>
            </div>
        );
    }

    if (loading) {
        return <div className="text-sm text-center">getting file</div>;
    }

    const src = host == "algorithmia" ? `data:audio/mp3;base64,${mp3}` : url;

    return (
        <div>
            <audio className="w-full" controls>
                <source src={src} type="audio/mp3" />
            </audio>
        </div>
    );
}
