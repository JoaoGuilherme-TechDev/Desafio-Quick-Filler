import { lerPDF } from "../utils/pdfReader.js";
import { readFiles } from "../utils/readFiles.js";
import path from 'path'
import * as XLSX from 'xlsx';
import * as fs from 'fs';
XLSX.set_fs(fs);

//Ler todos os arquivos da pasta
const files = await readFiles('./src/input')

const pontos = [];

//Separar arquivos de cartão de ponto e holerite
for (const file of files) {
  if(file.includes("cartao")) {
    pontos.push(file);
  }
}

//Iterar sobre cada arquivo de ponto, gerando um json separado 
for (const ponto of pontos) {
  const pontoResult = await lerPDF(ponto)

  //Separar o arquivo por Mês/Ano
  const blocos = pontoResult.split(/Mês\/Ano:/).filter(b => b.trim())
  
  const meses = [];

  //Separar meses presentes no arquivo e suas informações
  for (const bloco of blocos) {
    const matchData = bloco.match(/(\d{2})\/(\d{4})/);
    
    if (!matchData) continue;

    const [, mes, ano] = matchData;

    const linhas = bloco.split("\n");
    
    const linhasValidas = linhas.filter(l =>
      /^\d{2}\s+\w{3}/.test(l.trim())
    );

    //Separar informações contidas em cada dia da semana
    const dias = linhasValidas.map(linha => {
      const partes = linha.trim().split(/\s+/);

      if (/\d{2}:\d{2}/.test(linha)) {
        return {
          dia: partes[0],
          semana: partes[1],
          entrada: partes[2],
          saida: partes[4],
          intervalo: partes[5] && partes[7] ? `${partes[5]} - ${partes[7]}` : null,
          heDiurno: parseFloat(partes[8]) < 5 ? partes[8] : " ",
          funcao: partes.at(-3),
          situacao: partes.at(-2),
          conc: partes.at(-1)
        };
      }else {
        return {
          dia: partes[0],
          semana: partes[1],
          tipo: partes.slice(4).join(" ")
        };
      }
    })
  meses.push({mes, ano, dias});

  const workbook = {
    SheetNames: [],
    Sheets:{}
  }

  // Cria uma aba para cada mês presente no cartão de ponto
  for(const mesObj of meses) {
    const nomeAba = `${mesObj.mes}-${mesObj.ano}`;
    const dados = mesObj.dias;

    const worksheet = XLSX.utils.json_to_sheet(dados);

    
  // Converte os dados (JSON) para formato de planilha  
    workbook.SheetNames.push(nomeAba);
    workbook.Sheets[nomeAba] = worksheet;
  }

  // Define o caminho de saída para salvar o arquivo Excel
  const outputFolder = './src/output';
  const outputPath = path.join(outputFolder, `${path.basename(ponto)}.xlsx`);

  XLSX.writeFile(workbook, outputPath  )
  
  }
}






