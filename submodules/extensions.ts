module FileReaderExtensions {
    export function read(blob: Blob, type: "text"): Promise<string>
    export function read(blob: Blob, type: "dataurl"): Promise<string>
    export function read(blob: Blob, type: "arraybuffer"): Promise<ArrayBuffer>
    export function read(blob: Blob, type: string): Promise<any>
    export function read(blob: Blob, type: string) {
        return new Promise<any>((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (ev) => reject(ev);
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
}

module XMLHttpRequestExtensions {
    export function request(method: string, url: string, responseType: "text"): Promise<string>
    export function request(method: string, url: string, responseType: "document"): Promise<Document>
    export function request(method: string, url: string, responseType: "blob"): Promise<Blob>
    export function request(method: string, url: string, responseType: "arraybuffer"): Promise<ArrayBuffer>
    export function request(method: string, url: string, responseType: string): Promise<any>
    export function request(method: string, url: string, responseType: string) {
        switch (responseType) {
            case "text":
            case "document":
            case "blob":
            case "arraybuffer":
                break;
            default:
                throw new Error("Unsupported response type.");
        }
        return new Promise<string>((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onload = () => resolve(xhr.response);
            xhr.onerror = (e) => reject(e);
            xhr.open(method, url);
            xhr.responseType = responseType;
            xhr.send();
        });
    }
} 