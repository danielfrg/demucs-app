// This is being loaded on the HTML head
const Algorithmia = window.Algorithmia;

class DemucsAPI {
    constructor() {
        this.client = Algorithmia.client("simhcwLH5wkxwTnyMVJFazxsHqG1");
    }

    ping() {
        return this.client.algo("danielfrg/demucs/0.3.0").pipe({ ping: "" });
    }

    health() {
        return this.client.algo("danielfrg/demucs/0.3.0").pipe({ health: "" });
    }

    load() {
        return this.client
            .algo("danielfrg/demucs/0.3.0?timeout=600")
            .pipe({ load: "" });
    }

    separate(base64_file) {
        return this.client
            .algo("danielfrg/demucs/0.3.0?timeout=600")
            .pipe({ predict: { base64: base64_file } });
    }
}

export default DemucsAPI;
