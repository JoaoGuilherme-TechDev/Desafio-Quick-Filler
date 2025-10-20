# Desafio-Quick-Filler
Desafio para vaga de Desenvolvedor Jr/Estagiário

🧩 Desafio – Quick Filler

Este repositório foi criado como parte de um desafio técnico, com o objetivo de demonstrar habilidades em processamento de PDFs, extração de dados e geração de planilhas automatizadas.

O usuário só precisa colocar os PDFs na pasta de entrada (src/input/) e executar o parser correspondente — o arquivo resultante será salvo na pasta de saída (src/output/).
O projeto já possui parsers separados para holerites e cartões de ponto, garantindo que cada tipo de documento seja processado corretamente.

🧰 Tecnologias utilizadas

Node.js

JavaScript (ES6+)

pdf-parse → Leitura e extração de texto de PDFs

xlsx → Geração de planilhas Excel

Regex → Extração e formatação de dados

💻 Instalação

Clone o repositório:

git clone https://github.com/JoaoGuilherme-TechDev/Desafio-Quick-Filler.git


Entre na pasta do projeto:

cd Desafio-Quick-Filler


Instale as dependências:

npm install

🚀 Como usar

Coloque os arquivos PDF na pasta src/input/ com nomes contendo:

"holerite" → será processado pelo parser payroll.js

"cartao" → será processado pelo parser time_card.js

Execute o parser pelo script do npm, sem precisar digitar caminhos completos:

npm run holerite


ou

npm run cartao


Os arquivos .xlsx gerados serão salvos em src/output/.

📂 Estrutura do projeto
Desafio-Quick-Filler/
├── src/
│   ├── input/          # PDFs de entrada
│   ├── output/         # Planilhas .xlsx geradas
│   └── parsers/
│       ├── payroll.js  # Parser para holerites
│       └── time_card.js # Parser para cartões de ponto
├── package.json        # Dependências e scripts
├── package-lock.json
├── eng.traineddata     # OCR em inglês
├── por.traineddata     # OCR em português
└── README.md
