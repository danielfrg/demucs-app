import React from "react";

export default function Layout({ children }) {
    return (
        <div className="flex flex-col h-screen justify-between">
            <header className="container mx-auto max-w-screen-sm p-10 m-10 mb-0 pb-3">
                <h1 className="text-white text-center text-8xl">
                    <a href="/">DEMUCS</a>
                </h1>
                <h2 className="font-light text-3xl">Music Source Separation</h2>
            </header>

            <main className="mb-auto">{children}</main>

            <footer className="container mx-auto max-w-screen-md p-5">
                <p className="text-gray-400 font-light text-xs text-center">
                    Built by{" "}
                    <a
                        className="underline hover:text-white"
                        href="https://danielfrg.com"
                    >
                        Daniel Rodriguez
                    </a>
                    .{" "}
                    <a
                        className="underline hover:text-white"
                        href="https://danielfrg.com/blog/2020/10/demucs-app"
                    >
                        Read the blogpost
                    </a>
                    .{" "}
                    <a
                        className="underline hover:text-white"
                        href="https://hub.docker.com/repository/docker/danielfrg/demucs"
                    >
                        Docker container
                    </a>
                    .{" "}
                    <a
                        className="underline hover:text-white"
                        href="https://github.com/danielfrg/demucs-app"
                    >
                        Code on Github
                    </a>
                    .{" "}
                    <a
                        className="underline hover:text-white"
                        href="https://ai.honu.io/papers/demucs/index.html"
                    >
                        More info
                    </a>
                    ,{" "}
                    <a
                        className="underline hover:text-white"
                        href="https://arxiv.org/abs/1911.13254"
                    >
                        original paper
                    </a>{" "}
                    and{" "}
                    <a
                        className="underline hover:text-white"
                        href="https://github.com/facebookresearch/demucs"
                    >
                        code
                    </a>
                    .
                </p>
            </footer>
        </div>
    );
}

{
    /* <Grid container className="container" direction="column">
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
            <a href="https://danielfrg.com">Daniel Rodriguez</a>.{" "}
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
</Grid> */
}
