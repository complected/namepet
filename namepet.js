import Database from 'better-sqlite3'

// [2] documentation
export function make(path = "", verbose = null) {
  return new Database(path, { verbose })
}

// [1] documentation
export function create(db) {
  // [3] time values
  // [4] CONFLICT
  // [5] ROLLBACK
  // [6] PRIMARY KEY
  const makestmt = db.prepare(`CREATE TABLE
                               namepet 
                               (
                                 nom TEXT NOT NULL,
                                 ecr TEXT NOT NULL,
                                 sig TEXT NOT NULL,
                                 dat TEXT NOT NULL,
                                 wat TEXT NOT NULL,
                                 wen TEXT NOT NULL,
                                 exp TEXT NOT NULL,

                                 PRIMARY KEY (nom, wen)
                                 ON CONFLICT ROLLBACK
                               )
                             `
  )
  return makestmt.run()
}


/*
References:

1. https://www.sqlite.org/lang_createtable.html

2. https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md

3. On storing time values, SQLite does not hae dedicated storage class
for Date and Time. Instead, programmers can manipulate date and
time values using the built-in functions. 
https://www.sqlite.org/datatype3.html

4. The idea of primary key can be expressed as part of the column's definition
or as a table constraint. If there are multiple columns in the primary key
definition, it must be expressed as a table constraint.
https://www.sqlite.org/lang_createtable.html#primkeyconst

5. ROLLBACK conflict resolution reverts the transaction when
there is a e.g. Primary Key conflict, while the default ABORT reverts
the effects of current SQL statement. While I do not expect concurrent client
accesses at the moment, I prefer a stringent and hard-to-corrupt conflict resolution.

6. I choice (nom, wen), to enable versioning, for when the user updates the nom.
*/
