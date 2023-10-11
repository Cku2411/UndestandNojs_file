/** PROMISE API */
const fs = require("fs/promises");
const path = require("path");
const createFile = async (path) => {
  let existingFileHandle;
  try {
    existingFileHandle = await fs.open(path, "r");
    await existingFileHandle.close();
    return console.log(`The file ${path} already exist`);

    // await fs.copyFile("command.txt", path);
  } catch (error) {
    console.log("Okie start created file");
    const newFileHandle = await fs.open(path, "w");
    console.log("A new file was successfully created");
    await newFileHandle.close();
  }
};

const deleteFile = async (path) => {
  console.log(`Deleting ${path} ... `);
  try {
    await fs.unlink(path);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("this file has been deleted");
    }
  }
};

const renameFile = async (oldPath, newPath) => {
  console.log(`Rename ${oldPath} to ${newPath}`);

  try {
    await fs.rename(oldPath, newPath);
  } catch (error) {
    console.log("Some eror occured");
    console.log(error);
  }
};

const addToFile = async (path, content) => {
  try {
    // flags "w" is replace and a is appending
    const fileHandler = await fs.open(path, "a");
    fileHandler.write(content, "utf-8");

    fileHandler.close();
  } catch (error) {
    console.log("didn't find this file");
  }

  console.log(`Adding to ${path}`);
  console.log(`content: ${content}`);
};

(async () => {
  // Commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename a file";
  const ADD_TO_FILE = "add to the file";

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

    if (command.includes(ADD_TO_FILE)) {
      const idx = command.indexOf("with content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, idx);
      const content = command.substring(idx + 14);

      addToFile(filePath, content);
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
