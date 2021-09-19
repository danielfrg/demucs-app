import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    space: {},
}));

export default function Layout({ children }) {
    const classes = useStyles();

    return (
        <Grid container className="container" direction="column">
            <Grid item container className="header">
                <Grid item xs={12}>
                    <h1>DEMUCS</h1>
                </Grid>
                <Grid item xs={12}>
                    <h2>Music Source Separation</h2>
                </Grid>
            </Grid>
            {children}
            <Grid item xs />
            <Grid item>
                <footer>
                    <p>
                        Built by{" "}
                        <a href="https://danielfrg.com">Daniel Rodriguez</a>
                        .{" "}
                        <a href="https://danielfrg.com/blog/2020/10/demucs">
                            Read the blogpost
                        </a>
                        .{" "}
                        <a href="https://hub.docker.com/repository/docker/danielfrg/demucs">
                            Docker container
                        </a>
                        .{" "}
                        <a href="https://github.com/danielfrg/demucs-app">
                            Code on Github
                        </a>
                        .{" "}
                        <a href="https://ai.honu.io/papers/demucs/index.html">
                            More info
                        </a>
                        ,{" "}
                        <a href="https://arxiv.org/abs/1911.13254">
                            original paper
                        </a>{" "}
                        and{" "}
                        <a href="https://github.com/facebookresearch/demucs">
                            code
                        </a>
                        .
                    </p>
                </footer>
            </Grid>
        </Grid>
    );
}
