const markdownpdf = require("markdown-pdf");
const fs = require("fs");
const path = require("path");

const inputFile = "NOVEMBER_5_UPDATE_REPORT.md";
const outputFile = "NOVEMBER_5_UPDATE_REPORT.pdf";

console.log(`Converting ${inputFile} to PDF...`);

markdownpdf()
  .from(inputFile)
  .to(outputFile, () => {
    console.log(`✅ PDF created successfully: ${outputFile}`);
    console.log(`📄 Location: ${path.resolve(outputFile)}`);
  });
