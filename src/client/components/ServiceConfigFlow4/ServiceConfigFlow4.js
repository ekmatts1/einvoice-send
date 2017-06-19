import React from 'react';
import { Button, FormControl } from 'react-bootstrap';
import ajax from 'superagent-bluebird-promise';

export default class ServiceConfigFlow4 extends React.Component {

    static propTypes = {
        hasValidFile : React.PropTypes.bool,
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired
    };

    static defaultProps = {
        hasValidFile : false,
    };

    constructor(props)
    {
        super(props);

        this.state = {
            hasValidFile : this.props.hasValidFile
        };
    }

    onFileDrop = function(e)
    {
        e.preventDefault();

        // see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/files
        // see https://developer.mozilla.org/en-US/docs/Web/API/FileList
        // see https://developer.mozilla.org/en-US/docs/Web/API/File
        // see https://developer.mozilla.org/en-US/docs/Web/API/FileReader

        var files = e.dataTransfer.files;
        var ok2proceed = true;

        if (files.length != 1) {
            ok2proceed = false;
            alert("Please provide exactly one PDF example file.");
        }
        var file = files[0];

        var extension = file.name.substr(file.name.lastIndexOf('.') + 1);
        if (extension.toLowerCase() != 'pdf') {
            ok2proceed = false;
            alert("Please provide a PDF example file.");
        }
        // see https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications
        // var imageType = /^image\//;
        // if (!imageType.test(file.type)) {

        // var reader = new FileReader();
        // reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
        // reader.readAsDataURL(file);

        if (ok2proceed) {
            console.log("File for upload to server: ", file);

            var formData = new FormData();
            formData.append('file', file);
            formData.append('name', file.name);

            // console.log("formData ", formData);
            // for(var pair of formData.entries()) {
            //     console.log(">> entries: " + pair[0]+ ', '+ pair[1]);
            //}


            ajax.post('/einvoice-send/api/config/inchannel/' + 'ABC' + '/file')
                // https://medium.com/ecmastack/uploading-files-with-react-js-and-node-js-e7e6b707f4ef
                // .set('Content-Type', 'Content-Type: multipart/form-data;')   // 'Content-Type: multipart/mixed;')
                .send(formData)
                .end(function(err, res) {
                    if (err || !res.ok) {
                        alert("The upload did not succeed. Please try again.");
                    }
                    else {
                        ok2proceed = false;
                        // this.setState({ hasValidFile : true });  // ??? Error: "Cannot read property 'setState' of undefined" -> solved by usage of ok2proceed
                    }
                });
        }

        if (ok2proceed) {
            this.setState({ hasValidFile : true });
        }
    }

    render()
    {
        return (
            <div>
                <h3>Invoice PDF Example</h3>

                <div className="bs-callout bs-callout-info">
                    <h4 id="callout-progress-csp">Drop your invoice example PDF below</h4>

                    In order to provide a proper mapping of your invoices, we need an example PDF. All required data has to be provided in the example.
                    <br/>
                    Please upload a proper example PDF in the Drag &#39;n&#39; Drop section below.
                </div>

                <form className="form-horizontal">

                    <section className="oc-drag-and-drop">
                        <div className="drag-and-drop-canvas text-center" id="file-upload" onDragOver={ e => e.preventDefault() } onDrop={ e => this.onFileDrop(e) }>
                            <h2>Please Drop your example PDF here.</h2>
                            {/* TODO: <h4>or <a href="#">browse</a> for a file to upload.</h4> */}
                        </div>
                    </section>

                </form>

                <br/>

                <div className="form-submit text-right">
                    <Button bsStyle="link" onClick={ () => this.props.onPrevious() }>Previous</Button>
                    <Button bsStyle="primary" disabled={ !this.state.hasValidFile } onClick={ () => this.props.onNext() }>
                        Save &amp; Continue
                    </Button>
                </div>
            </div>
        )
    }
}
