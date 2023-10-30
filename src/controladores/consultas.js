let { consultorio, consultas, consultasFinalizadas, laudos } = require('../bancodedados');
let { UltimoID } = require('../bancodedados');


// Listas todas as consultas
const listarConsultas = (req, res) => {
    const { cnes_consultorio, senha_consultorio } = req.query;

    if (!senha_consultorio) {
        return res.status(4000).json({ mensagem: 'Cnes ou senha inválidos!' })
    }

    if (!cnes_consultorio) {
        return res.status(400).json({ mensagem: 'Cnes ou senha inválidos!' })
    }

    if (senha_consultorio !== consultorio.senha) {
        return res.status(400).json({ mensagem: 'Cnes ou senha inválidos!' })
    }

    if (cnes_consultorio !== consultorio.cnes) {
        return res.status(400).json({ mensagem: 'Cnes ou senha inválidos!' })
    }

    return res.json(consultas);
}

//Cadastrar as consultas
const criarConsultas = (req, res) => {
    const { tipoConsulta, valorConsulta, paciente } = req.body;


    //Verificar se todos os campos foram informados (todos são obrigatórios)
    if (!tipoConsulta || !valorConsulta || !paciente.nome || !paciente.cpf || !paciente.dataNascimento || !paciente.celular || !paciente.email || !paciente.senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' })

    }

    // se o valor da consulta nao for numero
    if (isNaN(valorConsulta)) {
        return res.status(400).json({ mensagem: 'o valor informado não é válido' })
    }

    //verifica email e cpf se ja tem

    const consultaExistente = consultas.find(consulta => {
        return consulta.paciente.cpf === paciente.cpf || consulta.paciente.email === paciente.email
    });

    if (consultaExistente) {
        return res.status(404).json({ mensagem: 'Email ou já consta na base!' });
    }

    //Verificar se o CPF informado já não está vinculado a nenhuma consulta que não foi finalizada
    if (!consultaExistente) {
        if (consultas.finalizada === true) {
            return res.status(400).json({ mensagem: 'Já existe uma consulta em andamento com o cpf ou e-mail informado!' });
        }

    }

    //Validar se o tipo da consulta informado consta nas especialidade dos médicos na base
    const especialidadeMedica = consultorio.medicos.find(esp => esp.especialidade === tipoConsulta);


    if (!especialidadeMedica) {
        return res.status(404).json({ mensagem: 'Especialidade Médica inexistente' });
    }

    //Vincular o identificador do médico especializado que irá atender a consulta em questão no momento de criação da consulta
    const identificadorMedico = especialidadeMedica.identificador;


    const novaConsulta = {
        identificador: UltimoID++,
        tipoConsulta: tipoConsulta,
        identificadorMedico: identificadorMedico,
        finalizada: false,
        valorConsulta: valorConsulta,
        paciente: {
            nome: paciente.nome,
            cpf: paciente.cpf,
            dataNascimento: paciente.dataNascimento,
            celular: paciente.celular,
            email: paciente.email,
            senha: paciente.senha,
        }
    }

    consultas.push(novaConsulta);

    return res.status(204).send();
}

const atualizarConsulta = (req, res) => {
    const { nome, cpf, dataNascimento, celular, email, senha } = req.body;
    const { identificadorConsulta } = req.params;


    //Verificar se todos os campos foram informados (todos são obrigatórios)
    if (!nome || !cpf || !dataNascimento || !celular || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' })

    }


    const consultaEncontrada = consultas.find(consulta => Number(consulta.identificador) === Number(identificadorConsulta));


    if (!consultaEncontrada) {
        return res.status(404).json({ mensagem: 'Consulta inexistente' })
    }

    if (cpf !== consultaEncontrada.paciente.cpf) {

        const existeCpf = consultas.find(consulta => consulta.paciente.cpf === cpf);

        if (existeCpf) {
            return res.status(400).json({ mensagem: 'Cpf já consta na base!' })
        }

    }

    if (email !== consultaEncontrada.paciente.email) {

        const existeEmail = consultas.find(consulta => consulta.paciente.email === email);

        if (existeEmail) {
            return res.status(400).json({ mensagem: 'Email já consta na base!' })
        }

    }

    consultaEncontrada.paciente = {
        nome,
        cpf,
        dataNascimento,
        celular,
        email,
        senha

    }

    return res.status(204).send();

}

const cancelarConsulta = (req, res) => {
    const { identificadorConsulta } = req.params;

    //Verificar se o identificador da consulta médica passado como parametro na URL é válido
    const consultaEncontrada = consultas.find(consulta => Number(consulta.identificador) === Number(identificadorConsulta));


    if (!consultaEncontrada) {
        return res.status(404).json({ mensagem: 'Consulta inexistente' })
    }

    //Permitir excluir uma consulta apenas se finalizada for igual a false
    if (consultaEncontrada.finalizada == true) {
        return res.status(400).json({ mensagem: 'A consulta só pode ser removida se a mesma não estiver finalizada' })
    }

    //Remover a consulta do objeto de persistência de dados
    consultas = consultas.filter(consulta => Number(consulta.identificador) !== Number(identificadorConsulta));

    return res.status(204).send();
}

const finalizarConsulta = (req, res) => {

    const { identificadorConsulta, textoMedico } = req.body;

    //Verificar se foi passado todos os campos no body da requisição
    if (!identificadorConsulta || !textoMedico) {
        return res.status(400).json({ mensagem: 'Os campos são obrigatórios' });
    }

    //Verificar se o identificador da consulta existe
    const identificadorEncontrado = consultas.find(consulta => Number(consulta.identificador) === Number(identificadorConsulta));

    if (!identificadorEncontrado) {
        return res.status(404).json({ mensagem: 'Consulta não encontrada' });
    }

    //Verificar se a consulta já esta finalizada
    if (identificadorEncontrado) {
        if (identificadorConsulta.finalizada === false) {
            return res.status(400).json({ mensagem: 'Consulta não finalizada' })
        }

    }

    //Verificar se o texto do médico possui um tamanho > 0 e <= 200 carácteres
    if (textoMedico < 0 && textoMedico > 200) {
        return res.status(400).json({ mensagem: 'O tamanho do textoMedico não está dentro do esperado' })
    }

    //Armazenar as informações do laudo na persistência de dados

    const id = identificadorEncontrado.identificador;
    const idMedico = identificadorEncontrado.identificadorMedico;
    const pac = identificadorEncontrado.paciente;


    const registroLaudoMedico = {
        identificador: id,
        identificadorConsulta,
        identificadorMedico: idMedico,
        textoMedico,
        paciente: {
            nome: pac.nome,
            cpf: pac.cpf,
            dataNascimento: pac.dataNascimento,
            celular: pac.celular,
            email: pac.email,
            senha: pac.senha
        }
    }

    laudos.push(registroLaudoMedico);

    //console.log(laudos);

    const tipCons = identificadorEncontrado.tipoConsulta;
    const vConsulta = identificadorEncontrado.valorConsulta;

    //Armazenar a consulta médica finalizada na persistência de dados

    const RegistroConsultasFinalizadas = {
        identificador: id,
        tipoConsulta: tipCons,
        identificadorMedico: idMedico,
        finalizada: true,
        identificadorLaudo: identificadorConsulta,
        valorConsulta: vConsulta,
        paciente: {
            nome: pac.nome,
            cpf: pac.cpf,
            dataNascimento: pac.dataNascimento,
            celular: pac.celular,
            email: pac.email,
            senha: pac.senha
        }
    }

    consultasFinalizadas.push(RegistroConsultasFinalizadas);


    return res.status(204).send();
}

const listarLaudos = (req, res) => {

    const { identificador_consulta, senha } = req.query;

    //Verificar se o identificador da consulta e a senha foram informados (passado como query params na url)
    if (!identificador_consulta || !senha) {
        return res.status(404).json({ mensagem: 'Campos Obrigatórios!' })

    }

    //Verificar se a consulta médica informada existe
    const consultaEncontrada = laudos.find(consulta => Number(consulta.identificadorConsulta) === Number(identificador_consulta));

    if (!consultaEncontrada) {
        return res.status(400).json({ mensagem: 'Consulta médica não encontrada!' });
    }

    //Verificar se a senha informada é uma senha válida
    if (consultaEncontrada.paciente.senha !== senha) {
        return res.status(403).json({ mensagem: 'Senha Inválida!' })

    }

    //Verificar se existe um laudo para consulta informada

    if (!consultaEncontrada.identificadorConsulta === identificador_consulta) {
        return res.status(400).json({ mensagem: 'Laudo Médico não encontrado!' });
    }


    //Exibir o laudo da consulta médica em questão junto as informações adicionais

    const laudo = {

        identificador: consultaEncontrada.identificador,
        identificadorConsulta: consultaEncontrada.identificadorConsulta,
        identificadorMedico: consultaEncontrada.identificadorMedico,
        textoMedico: consultaEncontrada.textoMedico,
        paciente: {
            nome: consultaEncontrada.paciente.nome,
            cpf: consultaEncontrada.paciente.cpf,
            dataNascimento: consultaEncontrada.paciente.dataNascimento,
            celular: consultaEncontrada.paciente.celular,
            email: consultaEncontrada.paciente.email,
            senha: consultaEncontrada.paciente.senha
        }
    }

    return res.json(laudo);

}

const listarConsultasMedicos = (req, res) => {

    const { identificador_medico } = req.query;


    if (!identificador_medico) {
        return res.status(404).json({ mensagem: 'Campos Obrigatórios!' })

    }

    //Verificar se o médico existe
    const medicoExiste = consultas.find(medico => Number(medico.identificadorMedico) === Number(identificador_medico));

    if (!medicoExiste) {
        return res.status(400).json({ mensagem: 'O médico informado não existe na base!' });
    }

    //Exibir as consultas vinculadas ao médico
    const consultasVinculadas = consultasFinalizadas.filter(finalizadas => Number(finalizadas.identificadorMedico) === Number(identificador_medico));

    console.log(consultasVinculadas);
    return res.json(consultasVinculadas);
}



module.exports = {
    listarConsultas,
    criarConsultas,
    atualizarConsulta,
    cancelarConsulta,
    finalizarConsulta,
    listarLaudos,
    listarConsultasMedicos
}