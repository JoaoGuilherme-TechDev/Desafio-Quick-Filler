import fs from 'fs-extra';
import path from 'path';


//Função parar ler todos os arquivos presentes em determinaa pasta e retornar o path
export async function readFiles(pasta) {
  const itens = await fs.readdir(pasta);
  const files = [];

  //Armazena o path desses arquivos em um array
  for (const item of itens) {
    const caminho = path.join(pasta, item);
    const stat = await fs.stat(caminho);
    if (stat.isFile()) {
      files.push(caminho);
    }
  }
 return files;
}
