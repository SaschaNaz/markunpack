var FileReaderExtensions;
(function (FileReaderExtensions) {
    function read(blob, type) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () {
                return resolve(reader.result);
            };
            reader.onerror = function (ev) {
                return reject(ev);
            };
            switch (type) {
                case "text":
                    reader.readAsText(blob);
                    break;
                case "dataurl":
                    reader.readAsDataURL(blob);
                    break;
                case "arraybuffer":
                    reader.readAsArrayBuffer(blob);
                    break;
                default:
                    throw new Error("Unsupported target type.");
            }
        });
    }
    FileReaderExtensions.read = read;
})(FileReaderExtensions || (FileReaderExtensions = {}));

var XMLHttpRequestExtensions;
(function (XMLHttpRequestExtensions) {
    function request(method, url, responseType) {
        switch (responseType) {
            case "text":
            case "document":
            case "blob":
            case "arraybuffer":
                break;
            default:
                throw new Error("Unsupported response type.");
        }
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                return resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                return reject(e);
            };
            xhr.open(method, url);
            xhr.responseType = responseType;
            xhr.send();
        });
    }
    XMLHttpRequestExtensions.request = request;
})(XMLHttpRequestExtensions || (XMLHttpRequestExtensions = {}));
//# sourceMappingURL=extensions.js.map
