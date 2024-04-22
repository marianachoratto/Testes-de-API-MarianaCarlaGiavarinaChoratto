const { fakerPT_BR } = require("@faker-js/faker");

describe("Teste sobre os filmes", () => {
  let userToken;
  let arrayNumber;
  let userId;
  let fixtureDoFilme;
  let movieId;

  before(() => {});

  after(() => {
    cy.promoverParaAdmin(userToken).then(() => {
      cy.request({
        method: "DELETE",
        url: `/api/movies/${movieId}`,
        headers: {
          Authorization: "Bearer " + userToken,
        },
      });
    });
  });

  it("Faz a listagem dos filmes", () => {
    cy.request({
      method: "GET",
      url: "/api/movies",
    }).then((resposta) => {
      arrayNumber = resposta.body.length;
      expect(resposta.status).to.equal(200);
      expect(resposta.body).to.be.an("array");
      expect(resposta.body.length).to.deep.equal(arrayNumber);
      // includes o ultimo array da lista
    });
  });

  it("Deve adicionar um novo filme  e verificar se ele está na lista ", () => {
    cy.cadastroLogin().then((resposta) => {
      userId = resposta.id;
      userToken = resposta.token;
      cy.request({
        method: "PATCH",
        url: "/api/users/admin",
        headers: {
          Authorization: "Bearer " + userToken,
        },
      }).then((resposta) => {
        cy.fixture("criandoUmFilme.json").then((arquivo) => {
          fixtureDoFilme = arquivo;
          fixtureDoFilme.title = fakerPT_BR.internet.userName();
          cy.log(fixtureDoFilme.title);
          cy.request({
            method: "POST",
            url: "/api/movies",
            body: arquivo,
            headers: {
              Authorization: "Bearer " + userToken,
            },
          }).then((resposta) => {
            expect(resposta.status).to.equal(201);
            cy.request({
              method: "GET",
              url: "/api/movies",
            }).then((resposta) => {
              resposta.body.forEach(function (item) {
                if (item.title == fixtureDoFilme.title) {
                  expect(item.title).to.equal(fixtureDoFilme.title);
                  movieId = item.id;
                }
              });

              expect(resposta.body.length).to.equal(arrayNumber + 1);
            });
          });
        });
      });
    });
  });

  it('Criar um novo filme sem um atributo ("releaseYear")', () => {
    cy.cadastroLogin().then((resposta) => {
      userToken = resposta.token;
      cy.promoverParaAdmin(userToken).then((resposta) => {
        cy.request({
          method: "POST",
          url: "/api/movies",
          body: {
            title: "O caminho para El Dourado",
            genre: "Animação",
            description: "qualquer coisa",
            durationInMinutes: 127,
          },
          failOnStatusCode: false,
        }).then((resposta) => {
          expect(resposta.status).to.equal(401);
        });
      });
    });
  });

  it("Consulta de filmes pelo título", () => {
    cy.request({
      // GET não aceita body, ao invés disso usar o qs (atributo nativo do site)
      method: "GET",
      url: "/api/movies/search",
      qs: {
        title: "O caminho para El Dourado",
      },
    }).then((resposta) => {
      expect(resposta.status).to.equal(200);
      expect(resposta.body).to.be.an("array");
    });
  });

  it("Deve conseguir alterar dados do filme", () => {});

  it("Deve receber bad request ao criar filme sem ser administrador", () => {});

  it("Consultar filme pelo id", () => {});

  it("Deletar filmes", () => {
    cy.cadastroLogin().then((resposta) => {
      userToken = resposta.token;
      userId = resposta.id;

      cy.promoverParaAdmin(userToken).then((resposta) => {
        cy.request({
          method: "DELETE",
          url: `/api/movies/${arrayNumber + 1}`,
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }).then((resposta) => {
          expect(resposta.status).to.equal(204);
        });
      });
    });
  });

  it("Não deve conseguir deletar filme sem ser administrador", () => {});
});

describe("Teste de filmes na lista de usuários", () => {
  it("usuario simples deve conseguir fazer review de filme", () => {});

  it("Recebe bad request ao fazer uma review sem...", () => {});

  it("Recebe movie not found ao procurar um filme não listado", () => {});

  it("Lista todas as reviews de filmes", () => {});

  it("Ver se o filme X está na review", () => {});
});