/*
 * Bedrock Linked Data Notifications Receiver Module Configuration.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const config = require('bedrock').config;
const constants = config.constants;
const fs = require('fs');
const path = require('path');

config['ldn-receiver'] = {};

// load a local copy of the ldp context
constants.LDP_URL = 'https://www.w3.org/ns/ldp';
constants.CONTEXTS[constants.LDP_URL] = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../contexts/ldp.jsonld'),
    {encoding: 'utf8'}));

// load a local copy of the activity streams context
constants.ACTIVITY_STREAMS_URL = 'https://www.w3.org/ns/activitystreams';
constants.CONTEXTS[constants.ACTIVITY_STREAMS_URL] = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../contexts/activitystreams.jsonld'),
    {encoding: 'utf8'}));

// load validation schemas
config.validation.schema.paths.push(
  path.join(__dirname, '..', 'schemas')
);
