import {
  scry,
} from './coreword/dist/word.js'

import Database from 'better-sqlite3'

// https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md
export function make(path = "", verbose = null) {
  return new Database(path, { verbose })
}

// https://www.sqlite.org/lang_createtable.html
export function create(db) {
  const makestmt = db.prepare(`CREATE TABLE
                               namepet 
                               (
                                 wen TEXT NOT NULL,
                                 ecr TEXT NOT NULL,
                                 sig TEXT NOT NULL,
                                 exp TEXT NOT NULL,
                                 nom TEXT NOT NULL,
                                 wat TEXT NOT NULL,
                                 dat TEXT NOT NULL,

                                 PRIMARY KEY (wen, ecr)
                                 ON CONFLICT ROLLBACK
                               )
                             `
  )
  return makestmt.run()
}

// read

// Note the `.all`.
// The table can accrete multiple rows of same `nom`, potentially for usecases like versioning, but more importantly now, to retain all records.
export function get(db, nom) {
  const getstmt = db.prepare(`SELECT 
                                * 
                              FROM 
                                namepet
                              WHERE
                                nom = ?
                                `
  )
  return getstmt.all(nom)
}

export function ask(db, txt) {
  const askstmt = db.prepare(`SELECT 
                                *
                              FROM
                                namepet
                              WHERE
                                wen = @txt OR
                                ecr = @txt OR
                                sig = @txt OR
                                exp = @txt OR
                                nom = @txt OR
                                wat = @txt OR
                                dat = @txt
                              `
  )
  return askstmt.all({ txt: txt })
}

// write

export function add(db, sig, exp, nom, wat, dat) {
  // https://www.sqlite.org/lang_datefunc.html
  const addstmt = db.prepare(`INSERT INTO 
                                namepet (wen, ecr, sig, exp, nom, wat, dat) 
                              VALUES
                                (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), ?, ?, ?, ?, ?, ?)
                              `
  )
  // IMPORTANT: assume provided strings are UTF-8 encoded.
  const msg = Buffer.concat([nom, wat, dat].map(s => Buffer.from(s)))
  const ecr = scry(msg, sig).toString()
  return addstmt.run(ecr, sig.toString(), exp, nom, wat, dat)
}
