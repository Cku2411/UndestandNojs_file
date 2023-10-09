/** PROMISE API */
const fs = require("fs/promises");
const path = require("path");
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

const deleteFile = (path) => {
  console.log(`Deleting ${path} ... `);
};

const renameFile = (oldPath, newPath) => {
  console.log(`Rename ${oldPath} to ${newPath}`);
};

const addToFile = (path, content) => {
  console.log(`Adding to ${path}`);
  console.log(`content to ${content}`);
};

(async () => {
  // Commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename a file";
  const ADD_TO_FILE = "add the file";

  // Handle File
  const fileHandler = await fs.open("./command.txt", "r");

  // listen to the envet
  fileHandler.on("change", async () => {
    // we want to read the content of the file
    const file = await fileHandler.stat();
    // How many bytes we want to read
    const length = file.size;
    const buff = Buffer.alloc(length);
    // the location at which we want to start filling our buffer.
    const offset = 0;
    // The position we want to start reading the file from
    const position = 0;

    // Read the file and store it in buffer
    const content = await fileHandler.read(buff, offset, length, position);
    const command = buff.toString("utf-8");

    // create the file with the name start from command lenght + 1
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }

    // Delete the file
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }

    // reanme file
    // renamnm the file <path> to <path>
    if (command.includes(RENAME_FILE)) {
      const idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, idx);
      const newFilePath = command.substring(idx + 4);
      renameFile(oldFilePath, newFilePath);
    }
  });

  //   event of watcher
  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    // only care about Change event.
    if (event.eventType === "change") {
      fileHandler.emit("change");
    }
  }
})();
