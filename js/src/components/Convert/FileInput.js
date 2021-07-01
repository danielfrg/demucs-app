import React, { Fragment } from "react";

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
        if (sizeMB > 5) {
            alert("File is to big. Max size: 5 MB");
            return;
        }

        this.props.request(file);
    }

    render() {
        return (
            <Fragment>
                <p>Select a song to be processed (max 5 MB):</p>
                <form onSubmit={this.handleSubmit}>
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
                        Submit
                    </button>
                </form>
            </Fragment>
        );
    }
}

export default FileInput;
