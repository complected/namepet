const Database = require('better-sqlite3');
const db = new Database('./.namepet/namepet.db', { verbose: console.log });

// var table = db.prepare('CREATE TABLE namepet (\
// 	                now TEXT  PRIMARY KEY,\
//    	                ecr TEXT  NOT NULL,\
//                     sig TEXT  NOT NULL,\
//                     exp TEXT  NOT NULL,\
//                     nom TEXT  NOT NULL,\
//                     wat TEXT  NOT NULL,\
// 	                dat TEXT  NOT NULL)');

const addstmt = db.prepare('INSERT INTO namepet (now, ecr, sig, exp, nom, wat, dat) VALUES (?, ?, ?, ?, ?, ?, ?)');
const getstmt = db.prepare('SELECT * FROM namepet WHERE nom = ?');
const askstmt = db.prepare('SELECT * FROM namepet WHERE wat = ? AND dat = ?');

console.log(add("sig","exp","nom","wat","dat"))
console.log(get("nom"))
console.log(ask("wat","dat"))

function add(sig, exp, nom, wat, dat) {
    //mask = hash(roll( ['namepet nametag' [exp, nom, wat, dat]] ))
    //ok ecr = scry(sig, mask)
    //need(ok)
    var now = "now";
    var ecr = "ecr";
    addstmt.run(now, ecr, sig, exp, nom, wat, dat)
  }

  function get(nom) {
    getstmt.run(nom)
  }

  function ask(wat, dat) {
    askstmt.run(wat,dat)
  }