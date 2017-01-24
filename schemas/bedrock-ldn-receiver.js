/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const schemas = require('bedrock-validation').schemas;
const constants = require('bedrock').config.constants;
const ldnInbox = require('./ldn-inbox');
const ldnMessage = require('./ldn-message');

const postInbox = ldnInbox();
const postMessage = ldnMessage();

module.exports.postInbox = () => postInbox;
module.exports.postMessage = () => postMessage;
