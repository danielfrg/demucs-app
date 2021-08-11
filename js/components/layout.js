import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    space: {},
}));

export default function Layout({ children }) {
    const classes = useStyles();

    return (
        <Grid container className="container" spacing={4}>
            <Grid item xs={12}>
                <header>
                    <h1>DEMUCS</h1>
                    <h2>Music Source Separation</h2>
                </header>
            </Grid>
            {children}
            <Grid item xs={12} className={classes.space} />
            <Grid item xs={12} className={classes.space} />
            <Grid item xs={12} className={classes.space} />
            <Grid item xs={12} className={classes.space} />
            <Grid item xs={12} className="inputs">
                <footer>
                    <p>
                        Built by{" "}
                        <a href="https://danielfrg.com">Daniel Rodriguez</a>.
                        Powered by{" "}
                        <a href="https://algorithmia.com/algorithms/danielfrg/demucs">
                            Algorithmia
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