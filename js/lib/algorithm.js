class Algorithm {
    constructor() {
        this.host = process.env.NEXT_PUBLIC_API_HOST
        console.log("API host: " + this.host)
    }

    getHost() {
        return this.host
    }

    live() {
        return fetch(this.host + "/health/live");
    }

    ready() {
        return fetch(this.host + "/health/ready");
    }

    load() {
        return fetch(this.host + "/load");
    }

    separate(file) {
        var data = new FormData()
        data.append("file", file, file.name)

        return fetch(this.host + "/infer", {
            method: "POST",
            body: data
        });
    }

    getFile(id, track) {
        return fetch(`${this.host}/file/${id}${track}`);
    }
}

export default Algorithm;
