const util = require("../src/utils");

const test = async () => {
  const list = await util.getTextNames();
  // for (filename of list) {
  const data = await util.readText(`./src/assets/talk/${list[0]}`);
  // const data = await util.readText(`./test/t.txt`);
  // console.log("# ", data.substr(0, 100));
  // console.log(data);
  let lineNo = 1;
  for (let line of util.readLineGen(data)) {
    // console.log(`#${lineNo++} `, line.length, line);
    console.log(util.seperateLine(line));
    if (lineNo++ > 5) break;
  }
};

test();
