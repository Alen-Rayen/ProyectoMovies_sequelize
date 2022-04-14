const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then((movie) => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then((movies) => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then((movies) => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        res.render('moviesAdd')
    },
    create: function (req,res) {
        const {title, rating, release_date, length, awards} = req.body

        db.Movie.create({
            title,
            rating,
            release_date,
            length,
            awards
        })
        .then((movie) => {
            res.redirect('/movies')
        })
        .catch((error) => {
            res.send(error)
        })
    },
    edit: function(req,res) {
        db.Movie.findByPk(req.params.id)
        .then((movie) => {
            res.render('moviesEdit', {
                movie
            })
        })
    },
    update: function (req,res) {
        const {title, rating, release_date, length, awards} = req.body

        db.Movie.update({
            title,
            rating,
            release_date,
            length,
            awards
        },{
            where: {
                id: req.params.id
            }
        })
        .then((result) => {
            if(result){
                res.redirect('/movies')
            }
        })
        .catch((error) => {
            res.send(error)
        })
    },
    delete: function (req,res) {
        db.Movie.findByPk(req.params.id)
        .then((movie) => {
            res.render('moviesDelete', {
                movie
            })
        })
    },
    destroy: function (req,res) {
        db.Movie.destroy({
            where: {
                id: req.params.id,
            }
        })
        .then((result) => {
            console.log(result)
            res.redirect('/movies')
        })
    }
}

module.exports = moviesController;