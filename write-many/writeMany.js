const fs = require("fs/promises");

(async () => {
  console.time("test");
  const file = await fs.open("src.txt", "w");
  const stream = file.createWriteStream();
  console.log(stream.writableHighWaterMark);

  let index;
  // stream will emit "drain event" when it full
  stream.on("drain", () => {
    // console.log(` We are now safe to write at ${index}`);
    write(index);
  });

  stream.on("finish", () => {
    // file.close();
    console.log("finish");
    file.close();
  });

  stream.on("close", () => {
    // catch the close event
    console.timeEnd("test");
    console.log("Stream was close");
  });

  const length = 1000000;
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
