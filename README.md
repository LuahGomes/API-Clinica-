# API de uma Clínica Médica

É uma API construida para uma clinica Médica, seguindo o padrão REST, onde se pode criar, lista, atualizar e ecluir uma consulta. Tendo também a finalização da consulta, listar o laudo da consulta e o laudo do médico que atendeu.


## :man_mechanic: Linguagens e Ferramentas

- Javascript
- Vscode
- Node.js
- Git

## :computer: Rodando o Projeto

- Faça o fork desse repositório para o seu GitHub
- Clone o seu repositório em sua máquina
- Desenvolva seu projeto, fazendo commits a cada alteração e push
- Realize a Pull Request (PR)

## :ladder: Fucionalidades do Projeto

- Listar as consultas que um médico atendeu
- [x] Criar consulta médica
- [x] Listar consultas médicas
- [x] Atualizar os dados de uma consulta
- [x] Excluir uma consulta médica
- [x] Finalizar uma consulta médica
- [x] Listar o laudo de uma consulta
- [x] Listar as consultas que um médico atendeu


## :sassy_man: Endpoints

- GET /consultas - Listagem de todas as consultas.
- POST /consulta - Criar consulta médica.
- PUT /consulta/:identificadorConsulta/paciente - Atualizar apenas os dados do paciente de uma consulta médica que não esteja finalizada
- DELETE /consulta/:identificadorConsulta` - Deve cancelar uma consulta médica existente, esta consulta não pode estar _finalizada_
- POST /consulta/finalizar` - Finalizar uma consulta com um texto de laudo válido do médico e registrar esse laudo e essa consulta finalizada.
- GET /consulta/laudo?identificador_consulta=1&senha=1234 - Retornar informações do laudo de uma consulta junto as informações adicionais das entidades relacionadas aquele laudo.
- GET /consultas/medico?identificador_medico=1 - Listagem das consultas vinculadas ao médico

#### Exemplo do registro de uma consulta médica finalizada

```javascript
{
  "identificador": 1,
  "tipoConsulta": "GERAL",
  "identificadorMedico": 1,
  "finalizada": true,
  "identificadorLaudo": 1,
  "valorConsulta": 3000,
  "paciente": {
    "nome": "John Doe",
    "cpf": "55132392051",
    "dataNascimento": "2022-02-02",
    "celular": "11999997777",
    "email": "john@doe.com",
    "senha": "1234"
   }
}
```

#### Exemplo do registro de um laudo

```javascript
{
  "identificador": 1,
  "identificadorConsulta": 3,
  "identificadorMedico": 2,
  "textoMedico": "XPTO",
  "paciente": {
     "nome": "John Doe",
     "cpf": "55132392051",
     "dataNascimento": "2022-02-02",
     "celular": "11999997777",
     "email": "john@doe.com",s
  }
}
```

## :technologist: Autor e Contribuidores

<a href="https://github.com/LuahGomes">


