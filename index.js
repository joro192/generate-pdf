//requiring path and fs modules
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const pdf = require("pdf-parse");

async function convertToText() {
  try {
    //joining path of directory
    const directoryPath = path.join(__dirname, "/pdf");
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, async function(err, files) {
      //handling error
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }

      let previewPath = __dirname + "/preview";
      let docPath = __dirname + "/doc";
      // create folder preview and doc
      exec("mkdir " + previewPath, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);  
          return;
        }
        console.log(`stdout: ${stdout}`);
      });

      exec("mkdir " + docPath, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });

      //listing all files using forEach
      let command = ``;

      files.forEach(async function(file) {
        // Do whatever you want to do with the file
        let input = __dirname + `/pdf/${file}`;
        let outputPreview = __dirname + `/preview/${file}`;
        let outputDoc = __dirname + `/doc/${file.replace(".pdf", ".txt")}`;
        // await previewPdf(file);
        command += `pdftk "${input}" cat 1-10 output "${outputPreview}" \n`;
        // command += `pdftotext -f 1 -l 10 "${input}" "${outputDoc}" \n`;
        await doc(file);
      });

      exec(command, { encoding: "buffer" }, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}\n`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

doc = async file => {
  try {
    let dataBuffer = fs.readFileSync(__dirname + `/pdf/${file}`);

    let data = await pdf(dataBuffer, { max: 10 });
    await fs.writeFile(
      __dirname + `/doc/${file.replace(".pdf", "")}.txt`,
      data.text,
      "utf8",
      () => console.log("done")
    );
  } catch (error) {
    console.error(error);
  }
};

convertToText();

// `pdftk /Volumes/JORO/LIB/generate-pdf/pdf/LuatXayDungQuyChuanXayDungSuatVonDauTuXayDungCongTrinhVaGiaXayDungTongHopBoPhanKetCauCongTrinh.pdf cat 200-436 output out1.pdf`

// pdftk /Volumes/JORO/LIB/generate-pdf/LuatXayDungQuyChuanXayDungSuatVonDauTuXayDungCongTrinhVaGiaXayDungTongHopBoPhanKetCauCongTrinh.pdf dump_data output report.txt
