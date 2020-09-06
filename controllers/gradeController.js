import { db } from '../models/index.js';
import { logger } from '../config/logger.js';

const Grade = db.grandeModel;

const create = async (req, res) => {
  const { name, subject, type, value, lastModified } = req.body;
  const grade = new Grade({
    name,
    subject,
    type,
    value,
    lastModified,
  });
  try {
    const data = await grade.save();
    res.send({ message: 'Grade inserido com sucesso' });
    logger.info(`POST /grade - ${JSON.stringify(data)}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  try {
    logger.info(`GET /grade`);
    const data = await Grade.find(condition);

    if (!data) {
      res.status(404).send('Nenhuma grade encontrada');
    } else {
      res.send(data);
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    logger.info(`GET /grade - ${id}`);
    const data = await Grade.findById({ _id: id });

    if (!data) {
      res.status(404).send('Grade não encontrada');
    } else {
      res.send(data);
    }
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(404).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;

  const { name, subject, type, value, lastModified } = req.body;
  const grade = new Grade({
    name,
    subject,
    type,
    value,
    lastModified,
  });

  console.log(req.body);
  console.log(grade);

  try {
    const data = await Grade.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!data) {
      res.status(404).send({
        message: 'Grade para atualizar não encontrada',
      });
    } else {
      res.send(data);
      logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
    }
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Grade.findByIdAndRemove({ _id: id });
    if (!data) {
      console.log('Grade para remover não encontrada');
    } else {
      res.send('Grade excluida com sucesso');
    }
    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {
    const data = await Grade.deleteMany();

    if (!data) {
      res.status(404).send('Nao encontrado nenhuma grade para excluir');
    } else {
      res.send('Todas grades excluidas com sucesso');
    }
    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
