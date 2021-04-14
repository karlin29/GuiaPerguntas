const { render } = require("ejs");
const express = require ("express");
const app = express();
const connection = require ("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

try {
    connection.authenticate();
        console.log('Conexão do banco de dados realizada com sucesso');
    } catch (error) {
        console.error('Erro ao conectar banco de dados', error);
}

//const bodyParser = require("body-parser");

//Estou dizando para o express usar o EJS como view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// body parser
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


//rotas
app.get("/",(req,res) => {
    Pergunta.findAll({ raw: true, order: [
        ['id','desc']
    ] }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        }); 
    });   
});

app.get("/perguntar",(req,res) => {
    res.render("perguntar"); 
});

app.post("/salvarpergunta",(req,res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=> {
        res.redirect("/");
    });
});

app.get("/pergunta/:id",(req,res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}       
    }).then(pergunta => {
        if (pergunta != undefined){ //pergunta encontrada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [ 
                    ['id','desc'] 
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta : pergunta,
                    respostas : respostas
                });
            });


        } else { //pergunta que não foi encontrada
            res.redirect("/");
        }
    })
});

app.post("/responder",(req,res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=> {
        res.redirect("/pergunta/"+perguntaId);
    });
});


app.listen(4040,()=> {console.log("App rodando!");});