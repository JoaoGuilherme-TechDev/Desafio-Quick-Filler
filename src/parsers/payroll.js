import { lerPDF } from "../utils/pdfReader.js";
import { readFiles } from "../utils/readFiles.js";
import path from 'path'
import * as XLSX from 'xlsx'
import * as fs from 'fs';
XLSX.set_fs(fs);



const files = await readFiles('./src/input')

const holerites = [];

for (const file of files) {
  if(file.includes("holerite")) {
    holerites.push(file);
  }
}

for (const holerite of holerites) {
  const holeriteText = await lerPDF(holerite);

  

const padraoData = /\b\d{2}\/\d{4}\b/;

const linhas = holeriteText.trim().split(/\r?\n/);
const blocos = [];
let blocoAtual = [];
let mesAnoAtual = null;

for (const linha of linhas) {
  const match = linha.match(padraoData);

  if (match) {
    // Achou o fechamento de um bloco
    mesAnoAtual = match[0];
    blocos.push({
      mesAno: mesAnoAtual.replace("/", "-"),
      conteudo: blocoAtual.join("\n").trim(),
    });
    blocoAtual = [];
  } else {
    blocoAtual.push(linha);
  }
}   



  const workbook = {
    SheetNames: [],
    Sheets:{}
  }

  for (const bloco of blocos ) {   
    const nomeAba = bloco.mesAno;

    const linhas = bloco.conteudo.split(/\r?\n/).filter(Boolean);

    const ignorar = [
      'P R O V E N T O S D E S C O N T O S',
      'Código Descrição \tQtde. Valor Qtde. Valor',
      'BARRACRED COSAN',
      'Saldo Capital Limite Crédito Informações',
      'Mensagens',
      'Mês/Ano:',

    ];

    const itens = linhas
      .filter(l => !ignorar.includes(l.trim()))
      .map(linha => {
        // 🔹 Caso especial: TOTAL — sem código, mas com dois valores no fim
        const regexTotal = /^T\s+O\s+T\s+A\s+L.*?(\d{1,3}(?:\.\d{3})*,\d{2})\s+(\d{1,3}(?:\.\d{3})*,\d{2})$/i;
        const matchTotal = linha.match(regexTotal);
        if (matchTotal) {
          const [, val1, val2] = matchTotal;
          const descricao = linha
            .replace(/T\s+O\s+T\s+A\s+L/i, 'TOTAL')
            .replace(val1, '')
            .replace(val2, '')
            .trim();
          return { descricao, qtde: val1, valor: val2 };
        }

        // 🔹 Itens com código
        const regexItem = /^([A-Za-z\d\/]+)\s+(.+?)\s+(\d+,\d{2})(?:\s+(\d+,\d{2}))?$/;
        const matchItem = linha.match(regexItem);
        if (matchItem) {
          const [, codigo, descricao, val1, val2] = matchItem;
          return {
            codigo: codigo.trim(),
            descricao: descricao.trim(),
            qtde: val2 ? val1 : '',
            valor: val2 ? val2 : val1
          };
        }

        // 🔹 Linhas sem código genéricas
        const regexSemCodigo = /^(.+?)\s+(\d{1,3}(?:\.\d{3})*,\d{2})(?:\s+(\d{1,3}(?:\.\d{3})*,\d{2}))?$/;
        const matchSemCodigo = linha.match(regexSemCodigo);
        if (matchSemCodigo) {
          const [, descricao, val1, val2] = matchSemCodigo;
          return {
            codigo: '',
            descricao: descricao.trim(),
            qtde: val2 ? val1 : '',
            valor: val2 ? val2 : val1
          };
        }

        return { codigo: '', descricao: linha.trim(), qtde: '', valor: '' };
      });
          
    const worksheet = XLSX.utils.json_to_sheet(itens); 
    workbook.SheetNames.push(nomeAba);
    workbook.Sheets[nomeAba] = worksheet;
 
  }

  const outputFolder = './src/output';
  
  const outputPath = path.join(outputFolder, `${path.basename(holerite)}.xlsx`);

  XLSX.writeFile(workbook, outputPath)
}


 
