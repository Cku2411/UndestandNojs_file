const fs = require("fs/promises");

// (async () => {
//   console.time("start");
//   const desFile = await fs.open("text.txt", "w");
// const result = await fs.readFile("./dest.txt");

//   desFile.write(result);
//   console.log(result);
//   console.timeEnd("start");
// })();

// working with Stream

// (async () => {
//   console.time("start");
//   // --------------------
//   const srcFile = await fs.open("./dest.txt", "r");
//   const desFile = await fs.open("copy.txt", "w");

//   let byteRead = -1;
//   while (byteRead !== 0) {
//     const ReadResult = await srcFile.read();
//     byteRead = ReadResult.bytesRead;

//     if (byteRead !== 16384) {
//       // find index of 0 in buffer
//       const indexOfNOFiled = ReadResult.buffer.indexOf(0);
//       console.log(indexOfNOFiled);
//       // aloocate this size = this.index
//       const newBuffer = Buffer.alloc(indexOfNOFiled);
//       // copy to new BUffer from 0 => index, starting at index 0 of newBuffer
//       ReadResult.buffer.copy(newBuffer, 0, 0, indexOfNOFiled);
//       desFile.write(newBuffer);
//     } else {
//       desFile.write(ReadResult.buffer);
//     }
//   }

//   // -------------------------
//   console.timeEnd("start");
// })();

(async () => {
  console.time("start");
  // --------------------
  const srcFile = await fs.open("./dest.txt", "r");
  const desFile = await fs.open("copy.txt", "w");

  // ---READSTREAM AND WRITESTREAM-------
  const readStream = srcFile.createReadStream();
  const writeStream = desFile.createWriteStream();

  writeStream.on("drain", () => {
    console.log("Wonder if it drain or not");
  });
  readStream.on("end", () => {
    console.log("this is the end");
  });

  readStream.pipe(writeStream);

  // -------------------------
  console.timeEnd("start");
})();
