const fs = require("fs-extra");
const Minizip = require("minizip-asm.js");

async function zipDirectory(source,output,password) {
    const mz = new Minizip();
    const files = await fs.readdir(source);

    for(let file of files) {
        const filePath = `${source}/${file}`;
        const fileData = await fs.readFile(filePath);
        mz.append(file,fileData,{password: password});
    }

    const data = new Uint8Array(mz.zip());
    await fs.writeFile(output,data);
}
//
zipDirectory("./zipped","./output.zip","123456");



























