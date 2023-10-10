const fs = require("fs/promises");

(async () => {
  console.time("test");
  const file = await fs.open("text.txt", "w");
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
    console.log("does this finish");
    console.timeEnd("test");
    file.close();
  });

  const write = async (idx) => {
    for (let i = idx; i < 100000; i++) {
      const buff = Buffer.from(` ${i} `, "utf-8");

      if (i === 99999) {
        return stream.end(buff);
      }

      stream.write(buff);
      if (stream.write(buff) === false) {
        index = i;
        break;
      }
    }
  };

  // console.timeEnd("test");
  // file.close();

  write(0);
})();
