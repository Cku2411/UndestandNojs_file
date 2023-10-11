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
  let split = "";
  streamRead.on("data", (chunk) => {
    const numbers = chunk.toString("utf-8").split("  ");

    //  check first element of array
    if (Number(numbers[0]) !== Number(numbers[1]) - 1) {
      // this is the String
      if (split) numbers[0] = split.trim() + numbers[0].trim();
    }

    // we check if two last numbers are splited or not
    if (
      // We need to convert string=> number
      Number(numbers[numbers.length - 2]) + 1 !==
      Number(numbers[numbers.length - 1])
    ) {
      split = numbers.pop();
    }

    console.log(numbers);
    // loop into number
    numbers.forEach((number) => {
      // convert String to number
      let n = Number(number);
      if (n % 2 == 0) {
        // continue Write
        if (!stramWrite.write(" " + n + " ")) {
          // we should chekc if the buffer is full, then we empty it and continue write
          // when it flase, it will emit drain event, and empty buffer. we use the callback to continue reading
          streamRead.pause();
        }
      }
    });
  });

  stramWrite.on("drain", () => {
    // continue the stream
    streamRead.resume();
  });

  streamRead.on("end", () => {
    console.log("we endUp succesfully!");
  });
  console.timeEnd("ReadBig");
})();
