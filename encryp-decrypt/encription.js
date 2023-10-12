const { Transform } = require("node:stream");
const fs = require("fs/promises");

class Encrypt extends Transform {
  _transform(chunk, encoding, callback) {
    for (let index = 0; index < chunk.length; index++) {
      if (chunk[index] !== 255) {
        chunk[index] += 1;
      }
    }
    this.push(chunk);
  }
}

(async () => {
  const readFileHandle = await fs.open("read.txt", "r");
  const writeFileHandle = await fs.open("write.txt", "w");

  const readStream = readFileHandle.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();

  const encrypt = new Encrypt();
  readStream.pipe(encrypt).pipe(writeStream);
})();
