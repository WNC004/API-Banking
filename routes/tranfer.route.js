const express = require('express');
const openpgp = require('openpgp');
const textEncoding = require('text-encoding-utf-8');
const config = require('../config/default.json');

const router = express.Router();

router.post('/encrypted', async (req, res) => {
  const { message } = await openpgp.encrypt({
      message: openpgp.message.fromBinary(new Uint8Array([0x01, 0x01, 0x01])), // input as Message object
      passwords: ['secret stuff'],                                             // multiple passwords possible
      armor: false                                                             // don't ASCII armor (for Uint8Array output)
  });
  const encrypted = message.packets.write(); // get raw encrypted packets as Uint8Array

  const { data: decrypted } = await openpgp.decrypt({
      message: await openpgp.message.read(encrypted), // parse encrypted bytes
      passwords: ['secret stuff'],                    // decrypt with password
      format: 'binary'                                // output as Uint8Array
  });
  console.log(decrypted); // Uint8Array([0x01, 0x01, 0x01])
  res.json({"encrypted":encrypted,"decrypted":decrypted});
})


module.exports = router;