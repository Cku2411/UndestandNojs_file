const { Transform } = require("node:stream");
const fs = require("fs/promises");

class Decrypt extends Transform {
  _transform(chunk, encoding, callback) {
    for (let index = 0; index < chunk.length; index++) {
      if (chunk[index] !== 255) {
        chunk[index] -= 1;
      }
    }
    this.push(chunk);
  }
}

(async () => {
  const readFileHandle = await fs.open("write.txt", "r");
  const writeFileHandle = await fs.open("decrypt.txt", "w");

  const readStream = readFileHandle.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();

  const encrypt = new Decrypt();
  readStream.pipe(encrypt).pipe(writeStream);
})();
