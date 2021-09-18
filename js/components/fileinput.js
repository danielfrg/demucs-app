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

        const sizeMB = file.size / 1024 / 1024;
        if (sizeMB > 10) {
            alert("File is to big. Max size: 5 MB");
            return;
        }

        this.props.request(file);
    }

    render() {
        return (
            <>
                <p className="text-center">
                    Select a song to be processed (max 5 MB):
                </p>
                <form className="file-input" onSubmit={this.handleSubmit}>
                    <label>
                        <input
                            type="file"
                            ref={this.fileInput}
                            className="file-picker"
                        />
                    </label>
                    <button
                        type="submit"
                        className="btn btn-light"
                        disabled={!this.props.enabled}
                    >
                        {this.props.enabled ? "Submit" : "... loading..."}
                    </button>
                </form>
            </>
        );
    }
}

export default FileInput;
