'use strict'

const path = require('path');
const donetv = require('dotenv').config({path: path.resolve(__dirname + '/.env')});

const {
    PORT,
    HOST,
    PathDB,
} = process.env;

module.exports = {
    port: PORT,
    host: HOST,
    pathDB: PathDB,
}