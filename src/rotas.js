const express = require('express');
const consultas = require('./controladores/consultas');

const rotas = express();

//Listas as consulta da clinica
rotas.get('/consultas', consultas.listarConsultas);

//Cadastrar uma nova consulta
rotas.post('/consulta', consultas.criarConsultas);

//atualizar informaçoes da consulta medica
rotas.put('/consulta/:identificadorConsulta/paciente', consultas.atualizarConsulta);

//excluir uma consulta
rotas.delete('/consulta/:identificadorConsulta', consultas.cancelarConsulta);

//finalizar consulta
rotas.post('/consulta/finalizar', consultas.finalizarConsulta);

//Listar os laudos
rotas.get('/consulta/laudo', consultas.listarLaudos);

//Listar as consultas do medico solicitado
rotas.get('/consultas/medico', consultas.listarConsultasMedicos);

module.exports = rotas; 