const fs = require("fs/promises");

const createFile = async (path) => {
  let existingFileHandle;
  try {
    existingFileHandle = await fs.open(path, "r");
    existingFileHandle.close();
    return console.log(`The file ${path} already exist`);

    // await fs.copyFile("command.txt", path);
  } catch (error) {
    console.log("Okie start created file");
    const newFileHandle = await fs.open(path, "w");
    console.log("A new file was successfully created");
    newFileHandle.close();
  }
};

(async () => {
  const string = "create a file D:/IT projects/Solidity/SafeSKD/a-new-file.txt";
  //   const executePath = "D:/IT projects/Solidity/SafeSKD/a-new-file.txt";
  const executePath = string.substring("create a file".length + 1);
  createFile(executePath);
})();
