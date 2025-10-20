import { PDFParse } from "pdf-parse";
import { readFile, writeFile } from "node:fs/promises";



//Lê os dados do PDf e retorna  o texto daquele arquivo 
export async function lerPDF (caminho) {
  const buffer = await readFile(caminho);
  const parser = new PDFParse({data: buffer});
  try {
    const textResult  = await parser.getText();
    return textResult.text;

  }catch(err) {
    console.log("Erro ao ler o PDF:",err);
  }finally{
    await parser.destroy();
  }
}


