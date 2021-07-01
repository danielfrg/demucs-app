// This is being loaded on the HTML head
const Algorithmia = window.Algorithmia;

class Base64DataConverter {
    constructor() {
        this.client = Algorithmia.client("simhcwLH5wkxwTnyMVJFazxsHqG1");
    }

    getFile(algoFilePath) {
        return this.client
            .algo("ANaimi/Base64DataConverter/0.1.2?timeout=300")
            .pipe(algoFilePath);
    }
}

export default Base64DataConverter;
