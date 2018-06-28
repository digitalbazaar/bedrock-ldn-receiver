/*
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
const ldnInbox = require('./ldn-inbox');
const ldnMessage = require('./ldn-message');

const postInbox = ldnInbox();
const postMessage = ldnMessage();

module.exports.postInbox = () => postInbox;
module.exports.postMessage = () => postMessage;
