import Database from 'better-sqlite3'
import {
  scry,
  hash,
  roll
} from './coreword/dist/word.js'

export function make(path = "", verbose = null) {
  const db = new Database(path, { verbose })
  db.pragma('encoding=UTF8')
  return db
}

export function create(db) {
  // Note types are optional. SQLite has "dynamic typing". [3][5]
  return db.prepare(`CREATE TABLE
                               namepet 
                               (
                                 wen INTEGER NOT NULL,
                                 ecr BLOB    NOT NULL,
                                 sig BLOB    NOT NULL,
                                 exp INTEGER NOT NULL,
                                 nom BLOB    NOT NULL,
                                 wat BLOB    NOT NULL,
                                 dat BLOB    NOT NULL
                               )
                             `
  ).run()
}

export function add(db, sig, exp, nom, wat, dat) {
  const stmt = db.prepare(
    `INSERT INTO namepet VALUES (unixepoch(), :ecr, :sig, :exp, :nom, :wat, :dat)`
  )
  const exphex = exp.toString(16) // [8]
  const expb   = Buffer.from(exphex.length % 2 === 0 ? exphex : '0' + exphex, 'hex')
  const mask   = hash(roll( ['namepet nametag', [expb, nom, wat, dat]] ))
  const ecr    = scry(mask, sig)
  return stmt.run({ ecr, sig, exp, nom, wat, dat })
}

export function ask(db, term) {
  return db.prepare(`
SELECT
  *
FROM
  namepet
WHERE
  wen = :term OR
  ecr = :term OR
  sig = :term OR
  exp = :term OR
  nom = :term OR
  wat = :term OR
  dat = :term`).all({ term })
}

/*

References:

1. better-sqlite3 docs https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md

2. CREATE TABLE docs https://www.sqlite.org/lang_createtable.html

3. Know that datatypes are dynamic in SQLite thus there are no type checks,
e.g. when inserting. https://www.sqlite.org/flextypegood.html

4. SQLite does not have dedicated storage class for Date and Time but programmers can
represent them in e.g. INTEGER or TEXT and use built-in functions to manipulate them.
https://www.sqlite.org/datatype3.html#date_and_time_datatype

5. BLOB is a column type that does not coerce data type, while e.g. inserting text
into a NUMERIC is coerced into INTEGER or REAL depending on the text.
https://www.sqlite.org/datatype3.html#type_affinity

6. https://en.wikipedia.org/wiki/Unix_time

7. RLP encodes natural numbers as Big Endian integers with no leading zeros.
  1. "Thus the RLP of some non-negative integer i is defined as" (Big Endian) -
https://ethereum.github.io/yellowpaper/paper.pdfn (197)
  2. https://eth.wiki/en/fundamentals/rlp
  3. https://ethereum.org/es/developers/docs/data-structures-and-encoding/rlp/

8. https://nodejs.org/api/buffer.html#buffers-and-character-encodings
*/
