const { Duplex } = require("stream");
const fs = require("fs");

class DuplexStream extends Duplex {
  constructor({
    writableHighWaterMark,
    readableHighWaterMark,
    readbleFileName,
    writableFileName,
  }) {
    super({ readableHighWaterMark, writableHighWaterMark });
    this.readfileName = readbleFileName;
    this.wtiteFileName = writableFileName;
    this.readFd = null;
    this.writeFd = null;
    this.chunks = [];
    this.chunksSize = 0;
  }

  _construct(callback) {
    fs.open(this.readfileName, "r", (err, readFd) => {
      if (err) return callback(err);
      this.readFd = readFd;
      //   write file
      fs.open(this.wtiteFileName, "w", (err, writeFd) => {
        if (err) return callback(err);
        this.writeFd = writeFd;
        console.log("This writeFd", writeFd);
        callback();
      });
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize = this.chunks.length;

    if (this.chunkSize > this.writableHighWaterMark) {
      fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        }
        // empty chungk
        this.chunks = [];
        this.chunkSize = 0;
        callback();
      });
    } else {
      callback();
    }
  }

  _read(size) {
    const buff = Buffer.alloc(size);
    fs.read(this.readFd, buff, 0, size, null, (err, bytesRead) => {
      // null is indicate the end of the stream
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _final(callback) {
    fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
      if (err) {
        return callback(err);
      }
      this.chunks = [];
      callback();
    });
  }

  _destroy(error, callback) {
    callback(error);
  }
}

(async () => {
  const duplex = new DuplexStream({
    readbleFileName: "read.txt",
    writableFileName: "write.txt",
  });

  console.log(duplex.writableHighWaterMark);

  duplex.write(Buffer.from("This is just a test CKU", "utf-8"));
  duplex.end(Buffer.from("end of write"));

  //   duplex.on("data", (chunk) => {
  //     console.log("chunk", chunk);
  //   });

  duplex.on("drain", () => {
    console.log("If it's rain");
  });
})();
