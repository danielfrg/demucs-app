class Algorithm {
    constructor() {
        // This is being loaded on the HTML head
        const Algorithmia = window.Algorithmia;

        this.client = Algorithmia.client("simhcwLH5wkxwTnyMVJFazxsHqG1");
    }

    ping() {
        return this.client.algo("danielfrg/demucs/0.1.0").pipe({ ping: "" });
    }

    health() {
        return this.client.algo("danielfrg/demucs/0.1.0").pipe({ health: "" });
    }

    load() {
        return this.client
            .algo("danielfrg/demucs/0.1.0?timeout=600")
            .pipe({ load: "" });
    }

    separate(base64_file) {
        return this.client
            .algo("danielfrg/demucs/0.1.0?timeout=600")
            .pipe({ predict: { base64: base64_file } });
    }

    getFile(algoFilePath) {
        return this.client
            .algo("ANaimi/Base64DataConverter/0.1.2?timeout=300")
            .pipe(algoFilePath);
    }
}

export default Algorithm;
