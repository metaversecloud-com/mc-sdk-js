import glob from "glob";
import fs from "fs";
import readline from "readline";
const rl = readline.createInterface(process.stdin, process.stdout);

const getDirectories = function (src, callback) {
  glob(src + "/**/*", callback);
};

await new Promise((resolve) => {
  rl.question("Which boilerplate file would you like to copy?  ", async (fileName) => {
    fs.readFile(`clients/boilerplate/${fileName}`, "utf8", (error, content) => {
      if (error) {
        console.error(error);
        return;
      }

      getDirectories("clients", async (error, files) => {
        if (error) {
          console.log("Error", error);
          return;
        }
        for (var i = 0; i < files.length; i++) {
          if (files[i].includes(fileName)) {
            await new Promise((resolve) => {
              rl.question(`Do you want to overwrite ${files[i]}? Y/n:  `, async (answer) => {
                if (answer === "Y") {
                  fs.writeFile(files[i], content, (error) => {
                    if (error) {
                      console.error(error);
                    }
                    console.log("File updated successfully!");
                  });
                } else {
                  console.log("File update cancelled");
                }
                resolve();
              });
            });
          }
        }
        rl.close();
      });
    });
  });
  resolve();
});
