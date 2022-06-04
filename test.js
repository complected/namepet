import { test } from 'tapzero'
import { 
    make,
    create
} from './namepet.js'

test('make then create', t => {
    const db = make()
    t.ok(db)
    t.ok(create(db))
    t.throws(
        _ => create(db),
        /table namepet already exists/,
        "should throw on 2nd create"
    )
})
