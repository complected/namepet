import { test } from 'tapzero';

import {
  ucat,
  ustr,
  eip191Sign,
  ubye,
  pkey,
  add,
  get,
  make,
  ask,
  create
} from './namepet.js';

const sk_txt = "0x309a49dcda67245af724a05ff081b0c5d24ec0b87a1393d940de6c1dd60f45a3";
const sk = ubye(sk_txt);
const pk = pkey(sk);

test('make and use', async t => {
  const db = make();
  t.ok(db, "make - should make");
  t.ok(create(db), "create - should create");
  const nom = `vitalik-${Math.floor(Math.random() * 10000)}`;
  const wat = "https://ethresear.ch";
  const dat = ":free:vitalik:dai";
  const exp = "exp"
  const msg = ucat([nom, wat, dat].map(s => ubye(s)));
  const sig = await eip191Sign(msg, sk);
  t.ok(add(db, pk, sig, exp, nom, wat, dat), "add - should add");
  t.equal(get(db, nom)[0].nom, nom, "get - should be equal");
  // verify `ask`, by column
  [
    ["nom", nom],
    ["wat", wat],
    ["dat", dat],
    ["exp", exp],
    ["sig", ustr(sig)],
    ["ecr", ustr(pk)]
  ].forEach(
    ([prop, expected]) => {
      test(`ask - prop: ${prop}`, t => {
        const answer = ask(db, nom);
        t.equal(answer.length, 1, "ask - should return 1 record only");
        t.equal(answer[0][prop], expected, "ask - should be equal");
      });
    }
  )
});

test('invalid sig', async t => {
  const db = make();
  t.ok(db, "make - should make");
  t.ok(create(db), "create - should create");
  const sig = ubye("forgery");
  t.throws(_ => add(db, pk, sig, "", "", "", ""), /(key do not match)|(signature missing v and recoveryParam)/);
});                                                                    	
