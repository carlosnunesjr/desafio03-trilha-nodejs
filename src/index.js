const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksExistsRepositoryById(request, response, next) {
  const { id } = request.params;
  const repository = repositories.find( repo => repo.id === id);

  if(!repository){
    return response.status(404).json({"error": "Repository doesn't exists."});
  }

  request.repository = repository;

  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checksExistsRepositoryById, (request, response) => {
  const { repository } = request;
  const {title, url, techs} = request.body;

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.status(201).json(repository);
});

app.delete("/repositories/:id", checksExistsRepositoryById, (request, response) => {
  const { repository } = request;

  const repositoryIndex = repositories.indexOf(repository);

  if (repositoryIndex === -1) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksExistsRepositoryById, (request, response) => {
  const { repository } = request;

  const likes = ++repository.likes;

  return response.json({ "likes": likes});
});

module.exports = app;
