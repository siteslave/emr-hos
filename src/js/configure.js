var mysql = require('mysql');
const Config = require('electron-config');
const config = new Config();

module.exports = {
  getConfig() {
    return {}
  },

  getHOSxPConnectionPool() {
    let HOS_HOST = config.get('HOS_HOST') || 'localhost';
    let HOS_DBNAME = config.get('HOS_DBNAME') || 'hos';
    let HOS_USER = config.get('HOS_USER') || 'sa';
    let HOS_PASSWORD = config.get('HOS_PASSWORD') || 'sa';
    let HOS_PORT = config.get('HOS_PORT') || '3306';
 
    let pool = mysql.createPool({
      host: HOS_HOST,
      user: HOS_USER,
      password: HOS_PASSWORD,
      database: HOS_DBNAME,
      port: HOS_PORT
    });

    pool.on('connection', function (connection) {
      connection.query('SET NAMES utf8')
    });

    return pool
  },

  getHDCConnectionPool() {
    let HDC_HOST = config.get('HDC_HOST') || 'localhost';
    let HDC_DBNAME = config.get('HDC_DBNAME') || 'hdc';
    let HDC_USER = config.get('HDC_USER') || 'hdc';
    let HDC_PASSWORD = config.get('HDC_PASSWORD') || 'hdc';
    let HDC_PORT = config.get('HDC_PORT') || '3306';
 
    let pool = mysql.createPool({
      host: HDC_HOST,
      user: HDC_USER,
      password: HDC_PASSWORD,
      database: HDC_DBNAME,
      port: HDC_PORT
    });

    pool.on('connection', function (connection) {
      connection.query('SET NAMES utf8')
    });

    return pool
  }
}