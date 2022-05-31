import {
  scry,
  ubye,
  ucat,
  ustr,
  pkey,
  sign
} from './coreword/coreword.js';

import Database from 'better-sqlite3';

const make = function make(path = "", verbose = null) {
  // https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md
  return new Database(path, { verbose });
};

const create = function create(db) {
  // https://www.sqlite.org/lang_createtable.html
  const makestmt = db.prepare(`CREATE TABLE
                               namepet 
                               (
                                 now TEXT NOT NULL,
                                 ecr TEXT NOT NULL,
                                 sig TEXT NOT NULL,
                                 exp TEXT NOT NULL,
                                 nom TEXT NOT NULL,
                                 wat TEXT NOT NULL,
                                 dat TEXT NOT NULL,
                                 PRIMARY KEY (nom, now)
                                 ON CONFLICT ROLLBACK
                               )
                             `
  );
  return makestmt.run();
};

// read
const get = function get(db, nom) {
  const getstmt = db.prepare(`SELECT 
                                * 
                              FROM 
                                namepet
                              WHERE
                                nom = ?
                                `
  );
  return getstmt.all(nom);
};

const ask = function ask(db, txt) {
  const askstmt = db.prepare(`SELECT 
                                *
                              FROM
                                namepet
                              WHERE
                                now = @txt OR
                                ecr = @txt OR
                                sig = @txt OR
                                exp = @txt OR
                                nom = @txt OR
                                wat = @txt OR
                                dat = @txt
                              `
  );
  return askstmt.all({ txt: txt });
};

// write
const add = function add(db, key, sig, exp, nom, wat, dat) {
  // https://www.sqlite.org/lang_datefunc.html
  const addstmt = db.prepare(`INSERT INTO 
                                namepet (now, ecr, sig, exp, nom, wat, dat) 
                              VALUES
                                (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), ?, ?, ?, ?, ?, ?)
                              `
  );
  const msg = ucat([nom, wat, dat].map(s => ubye(s)));
  const ecr_str = ustr(scry(msg, key, sig));
  const sig_str = ustr(sig)
  return addstmt.run(ecr_str, sig_str, exp, nom, wat, dat);
};

export {
  scry,
  ubye,
  ucat,
  ustr,
  pkey,
  sign,
  make,
  create,
  get,
  ask,
  add,
};
