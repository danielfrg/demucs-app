class Algorithm {
    constructor() {
        this.host = process.env.NEXT_PUBLIC_API_HOST;

        if (this.host == "algorithmia") {
            const Algorithmia = window.Algorithmia;
            this.algo_client = Algorithmia.client(
                "simhcwLH5wkxwTnyMVJFazxsHqG1"
            );
        }
    }

    getHost() {
        return this.host;
    }

    live() {
        if (this.host == "algorithmia") {
            return this.algo_client
                .algo("danielfrg/demucs/0.1.0")
                .pipe({ ping: "" });
        }
        return fetch(this.host + "/health/live");
    }

    ready() {
        if (this.host == "algorithmia") {
            return this.algo_client
                .algo("danielfrg/demucs/0.1.0")
                .pipe({ health: "" });
        }
        return fetch(this.host + "/health/ready");
    }

    load() {
        if (this.host == "algorithmia") {
            return this.algo_client
                .algo("danielfrg/demucs/0.1.0?timeout=600")
                .pipe({ load: "" });
        }
        return fetch(this.host + "/load");
    }

    separate(file) {
        if (this.host == "algorithmia") {
            const base64_file = this.bufferToBase64(file);
            return this.algo_client
                .algo("danielfrg/demucs/0.1.0?timeout=600")
                .pipe({ predict: { base64: base64_file } });
        }

        var data = new FormData();
        data.append("file", file, file.name);

        return fetch(this.host + "/infer", {
            method: "POST",
            body: data,
        });
    }

    bufferToBase64(buffer) {
        var bytes = new Uint8Array(buffer);
        var len = buffer.byteLength;
        var binary = "";
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    getFile(id, track) {
        if (this.host == "algorithmia") {
            const algoFilePath = `data://danielfrg/demucs_output/${id}-${track}.mp3`;
            console.log("Getting file from algorithmia: " + algoFilePath);
            return this.algo_client
                .algo("ANaimi/Base64DataConverter/0.1.2?timeout=300")
                .pipe(algoFilePath);
        }
        return fetch(`${this.host}/file/${id}${track}`);
    }
}

export default Algorithm;
