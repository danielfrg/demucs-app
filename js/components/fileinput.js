import React from "react";

class FileInput extends React.Component {
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        const file = this.fileInput.current.files[0];
        if (!file) {
            return;
        }

        // File limit
        const host = process.env.NEXT_PUBLIC_API_HOST;
        if (host == "algorithmia") {
            const sizeMB = file.size / 1024 / 1024;
            if (sizeMB > 5) {
                alert("File is to big. Max size: 5 MB");
                return;
            }
        }

        this.props.request(file);
    }

    render() {
        const host = process.env.NEXT_PUBLIC_API_HOST;

        return (
            <div className="mt-10 mb-3 flex flex-col text-gray-100 font-thin">
                <p className="text-center my-3">
                    {`Select a song to be processed ${
                        host == "algorithmia" ? "(max 5 MB)" : ""
                    }`}
                    :
                </p>
                <form
                    className="bg-gray-700 p-10 text-center"
                    onSubmit={this.handleSubmit}
                >
                    <label>
                        <input
                            type="file"
                            ref={this.fileInput}
                            className="file-picker"
                        />
                    </label>
                    <button
                        type="submit"
                        className="bg-gray-300 hover:bg-gray-100 text-gray-800 py-1 px-4 border border-gray-400 rounded"
                        disabled={!this.props.enabled}
                    >
                        {this.props.enabled ? "Submit" : "... loading..."}
                    </button>
                </form>
            </div>
        );
    }
}

export default FileInput;
