/** PROMISE API */
const fs = require("fs/promises");

(async () => {
  const watcher = fs.watch("./command.txt");

  //   event of watcher

  for await (const event of watcher) {
    // only care about Change event.
    if (event.eventType === "change") {
      console.log("This file was changed");
      // we want to read the content of the file
      
    }
  }
})();
