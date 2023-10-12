const { Writable, Transform } = require("stream");
const fs = require("fs");
const fsPromise = require("fs/promises");

// CUSTOME CLASS
class FileWritableStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunkSize = 0;
    this.writesCount = 0;
  }

  //  call this function after constructor
  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        // so if we call the callback with argument, it means we have an error
        callback(err);
      } else {
        // no argument means it was successful
        this.fd = fd;
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    // push chunk to array
    this.chunks.push(chunk);
    this.chunkSize = this.chunks.length;

    // if size of chunk is greater than MAx, we empty
    if (this.chunkSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        }
        // empty chungk
        this.chunks = [];
        this.chunkSize = 0;
        ++this.writesCount;
        callback();
      });
    } else {
      callback();
    }
  }
  // run after our stream was done
  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) {
        return callback(err);
      }
      this.chunks = [];
      callback();
    });
  }

  _destroy(error, callback) {
    console.log("Number of writes", this.writesCount);
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err || error);
      });
    } else {
      callback(error);
    }
  }
}

(async () => {
  console.time("test");
  const stream = new FileWritableStream({
    // highWaterMark: 1800 - we use default
    fileName: "text.txt",
  });

  console.log("MAX chunklengt", stream.writableHighWaterMark);

  let index;
  let drain = 0;
  // stream will emit "drain event" when it full
  stream.on("drain", () => {
    // console.log(` We are now safe to write at ${index}`);
    ++drain;
    write(index);
  });

  stream.on("finish", () => {
    // file.close();
    console.log(`finish with  ${drain} drains`);
  });

  stream.on("close", () => {
    // catch the close event
    console.timeEnd("test");
    console.log("Stream was close");
  });

  const length = 100000;
  const write = async (idx) => {
    for (let i = idx; i < length; i++) {
      const buff = Buffer.from(` ${i} `, "utf-8");

      if (i === length - 1) {
        // end the stream and emit slose event
        return stream.end(buff);
      }

      // start the stream by this
      if (!stream.write(buff)) {
        index = i + 1;
        break;
      }
    }
  };

  // console.timeEnd("test");
  // file.close();

  write(0);
})();
x