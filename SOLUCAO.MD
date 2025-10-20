📝 Solução – Quick Filler
Por que este projeto foi criado

Este projeto foi feito para automatizar a transformação de PDFs em planilhas Excel.
O foco é facilitar o processo de extrair dados de holerites e cartões de ponto, sem precisar digitar caminhos complexos ou processar arquivos manualmente.

Como funciona

 - O usuário coloca os PDFs na pasta src/input/.

Cada tipo de documento tem seu parser específico:

 - Arquivos com "holerite" no nome → payroll.js

 - Arquivos com "cartao" no nome → time_card.js

Ao rodar o parser correto, o sistema lê todos os PDFs da pasta, extrai os dados e gera um arquivo .xlsx para cada PDF na pasta src/output/.

Abordagem tomada

 - Separação por tipo de documento: Cada parser trata apenas um tipo de PDF, para facilitar a leitura e evitar confusão.

 - Leitura do PDF: O conteúdo de cada arquivo é extraído e limpo para que os dados fiquem consistentes.
 
 - Extração de dados: Usamos regras simples para identificar e separar as informações importantes.
  
 - Geração de planilhas: Cada PDF processado vira uma planilha Excel, mantendo o mesmo nome do arquivo original.
 
 - Facilidade para o usuário: Com scripts npm (npm run holerite ou npm run cartao), não é preciso digitar caminhos, só rodar o comando.