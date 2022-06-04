import Database from 'better-sqlite3'

export function make(path = "", verbose = null) {
  const db = new Database(path, { verbose })
  db.pragma('encoding=UTF8')
  return db
}

export function create(db) {
  return db.prepare(`CREATE TABLE
                               namepet 
                               (
                                 wen INTEGER NOT NULL,
                                 ecr BLOB    NOT NULL,
                                 sig BLOB    NOT NULL,
                                 exp INTEGER NOT NULL,
                                 nom TEXT    NOT NULL,
                                 wat TEXT    NOT NULL,
                                 dat TEXT    NOT NULL
                               )
                             `
  ).run()
}


/*

References:

1. better-sqlite3 docs https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md

2. CREATE TABLE docs https://www.sqlite.org/lang_createtable.html

3.

a) Know that datatypes are dynamic in SQLite thus there are no type checks
e.g. when inserting. https://www.sqlite.org/flextypegood.html

b) SQLite does not have dedicated storage class for Date and Time but programmers can
represent them in e.g. INTEGER or TEXT and use built-in functions to manipulate them.
https://www.sqlite.org/datatype3.html#date_and_time_datatype
*/
