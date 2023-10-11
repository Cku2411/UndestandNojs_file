const fs = require("node:fs/promises");

(async () => {
  // open file to read
  console.time("ReadBig");
  const fileHandleRead = await fs.open("./src.txt", "r");
  const fileHandleWrite = await fs.open("./dest.txt", "w");
  //   create a stram

  const streamRead = fileHandleRead.createReadStream();
  const stramWrite = fileHandleWrite.createWriteStream();
  //   addr event listener
  streamRead.on("data", (chunk) => {
    const numbers = chunk.toString("utf-8").split("  ");
    console.log(numbers);
    // we should chekc if the buffer is full, then we empty it and continue write
    // when it flase, it will emit drain event, and empty buffer. we use the callback to continue reading
    if (!stramWrite.write(chunk)) {
      streamRead.pause();
    }
  });

  stramWrite.on("drain", () => {
    // continue the stream
    streamRead.resume();
  });
  console.timeEnd("ReadBig");
})();
