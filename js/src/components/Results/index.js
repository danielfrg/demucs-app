import React from "react";

import Base64DataConverter from "./algorithm";
import Player from "./player";
import { Link } from "react-router-dom";

class ResultTable extends React.Component {
    constructor(props) {
        super(props);
        this.client = new Base64DataConverter();
    }

    render() {
        const { id } = this.props.match.params;
        const bassEl = (
            <Player
                client={this.client}
                algoFilePath={`data://danielfrg/demucs_output/${id}-bass.mp3`}
            ></Player>
        );
        const drumsEl = (
            <Player
                client={this.client}
                algoFilePath={`data://danielfrg/demucs_output/${id}-drums.mp3`}
            ></Player>
        );
        const otherEl = (
            <Player
                client={this.client}
                algoFilePath={`data://danielfrg/demucs_output/${id}-other.mp3`}
            ></Player>
        );
        const vocalsEl = (
            <Player
                client={this.client}
                algoFilePath={`data://danielfrg/demucs_output/${id}-vocals.mp3`}
            ></Player>
        );

        const url = window.location.href;

        return (
            <div className="content">
                <div className="results">
                    <table>
                        <tbody>
                            <tr>
                                <th>Instrument</th>
                                <th>Track</th>
                            </tr>
                            <tr>
                                <td>Bass</td>
                                <td className="track">{bassEl}</td>
                            </tr>
                            <tr>
                                <td>Drums</td>
                                <td className="track">{drumsEl}</td>
                            </tr>
                            <tr>
                                <td>Other</td>
                                <td className="track">{otherEl}</td>
                            </tr>
                            <tr>
                                <td>Vocals</td>
                                <td className="track">{vocalsEl}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="share-url">
                    Share URL: <a href={url}>{url}</a>
                </p>
                <p className="share-url">
                    <Link to="/">Home</Link>
                </p>
            </div>
        );
    }
}

export default ResultTable;
