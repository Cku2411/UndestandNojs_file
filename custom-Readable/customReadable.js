const { Readable } = require("stream");
const fs = require("fs");

// Custome Readabe Class
class FileReadStream extends Readable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.fileName, "r", (err, fd) => {
      if (err) {
        return callback(err);
      }

      this.fd = fd;
      callback();
    });
  }

  _read(size) {
    // create a buffer with size parameters
    const buff = Buffer.alloc(size);
    fs.read(this.fd, buff, 0, size, null, (err, bytesRead, buffer) => {
      if (err) {
        this.destroy(err);
      }

      //   if it's not error, we use Pushmethod of this class
      //   if bytesRead > 0, we push from 0 to length of bytesRed to prevent null.
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _destroy(error, callback) {
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err || error);
      });
    } else {
      callback(error);
    }
  }
}

// MAIN FUNCTION
(async () => {
  const stream = new FileReadStream({
    fileName: "Text.txt",
  });

  stream.on("data", (chunck) => {
    console.log(chunck.toString());
  });

  stream.on("end", () => {
    console.log("Done, reading");
  });

  //   stream.read();
})();
