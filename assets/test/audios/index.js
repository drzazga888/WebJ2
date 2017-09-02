import fs from 'fs'
import path from 'path'

export const getArrayBufferFromFile = (filename) => {
    var buf = fs.readFileSync(path.join(__dirname, filename + '.wav'))
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}