const { Writable, Transform } = require("stream");

class FileWritableStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
  }

  _write(chunk, encoding, callback) {
    callback();
  }

  _construct(callback) {
    callback();
  }
  _final() {}

  _destroy() {}
}

const stream = new FileWritableStream({
  highWaterMark: 1800,
});

stream.write(Buffer.from("this is some string"));
stream.end(Buffer.from("Our last write"));

stream.on("drain", () => {});
