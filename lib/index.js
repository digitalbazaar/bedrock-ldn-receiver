/*
 * Bedrock Linked Data Notifications Receiver Module.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const async = require('async');
const bedrock = require('bedrock');
const brLdnInbox = require('bedrock-ldn-inbox');
const brPassport = require('bedrock-passport');
const brRest = require('bedrock-rest');
const config = bedrock.config;
const database = require('bedrock-mongodb');
const constants = config.constants;
const ensureAuthenticated = brPassport.ensureAuthenticated;
const jsonld = bedrock.jsonld;
const uuidV4 = require('uuid/v4');
const util = require('util');
const validate = require('bedrock-validation').validate;
const BedrockError = bedrock.util.BedrockError;
require('bedrock-express');

// load config defaults
require('./config');

// module API
const api = {};
module.exports = api;

api.createInboxId = function(name = uuidV4()) {
  return util.format(
    '%s%s/%s', config.server.baseUri, config['ldn-receiver'].routes.inboxes,
    encodeURIComponent(name));
};

api.createMessageId = function(name = uuidV4()) {
  return util.format(
    '%s%s/%s', config.server.baseUri, config['ldn-receiver'].routes.messages,
    encodeURIComponent(name));
};

bedrock.events.on('bedrock-express.configure.routes', app => {
  const routes = config['ldn-receiver'].routes;

  // an inbox needs to be ldp:Container, ldp:BasicContainer, or
  // ldp:DirectContainer
  const inboxFrame = {
    '@context': [constants.LDP_URL, {
      owner: {'@id': 'https://w3id.org/security#owner', '@type': '@id'}
    }],
    type: ['Container', 'BasicContainer', 'DirectContainer']
  };

  const messageContext = {
    '@context': constants.ACTIVITY_STREAMS_URL
  };

  // TODO: determine CORS and implement `cors()` middleware

  // create a new inbox
  app.post(
    routes.inboxes,
    ensureAuthenticated,
    validate('bedrock-ldn-receiver.postInbox'),
    (req, res, next) => async.auto({
      frame: callback => jsonld.frame(req.body, inboxFrame, callback),
      validate: ['frame', (results, callback) => {
        const inbox = results.frame['@graph'][0] || {};
        inbox['@context'] = results.frame['@context'];
        if(!jsonld.hasValue(inbox, 'type', 'Container')) {
          return callback(new BedrockError(
            'An inbox must be a Linked Data Platform `Container`.',
            'NotAcceptable', {httpStatusCode: 400, public: true}));
        }
        callback(null, inbox);
      }],
      store: ['validate', (results, callback) => {
        // generate new random ID for inbox
        const inbox = results.validate;
        inbox.id = api.createInboxId();
        const {owner: owner = req.user.identity.id} = inbox;
        delete inbox.owner;
        brLdnInbox.inboxes.add(req.user.identity, inbox, {owner: owner}, err =>
          callback(err, inbox.id));
      }]
    }, (err, results) => err ?
      next(err) : res.status(201).location(results.store).end()));

  // get API options for an inbox
  app.options(routes.inboxes + '/:inbox', (req, res) => res
    .status(200)
    .set({
      'Allow': 'GET, OPTIONS, POST',
      'Accept-Post': 'application/ld+json'
    })
    .end());

  // add a message to an inbox
  app.post(
    routes.inboxes + '/:inbox',
    ensureAuthenticated,
    validate('bedrock-ldn-receiver.postInbox'),
    (req, res, next) => async.auto({
      compact: callback => jsonld.compact(
        req.body, messageContext, (err, compacted) => {
          if(err) {
            return callback(err);
          }
          if(Object.keys(compacted).length === 1) {
            return callback(new BedrockError(
              'A message must not be empty.',
              'NotAcceptable', {httpStatusCode: 400, public: true}));
          }
          callback(err, compacted);
        }),
      store: ['compact', (results, callback) => {
        // generate new random ID for message
        const message = results.compact;
        const previousId = message.id || null;
        message.id = api.createMessageId();
        const inbox = config.server.baseUri + req.originalUrl;
        const event = {
          actor: req.user.identity,
          previousId: previousId,
          message: message,
          meta: {},
          inbox: inbox,
          // store flag may be cleared by an event handler to prevent
          // default storage
          store: true
        };
        bedrock.events.emit(
          'bedrock-ldn-receiver.message.add', event,
          err => (err || !event.store) ?
            callback(err, event.message.id) :
            brLdnInbox.messages.add(
              event.actor, event.message, {
                inbox: event.inbox,
                meta: event.meta
              }, err => callback(err, event.message.id)));
      }]
    }, (err, results) => err ?
      next(err) : res.status(201).location(results.store).end()));

  // get inbox info, including list of messages
  app.get(routes.inboxes + '/:inbox', ensureAuthenticated, (req, res, next) => {
    const inbox = api.createInboxId(req.params.inbox);
    brLdnInbox.inboxes.get(
      req.user.identity, inbox, {messageList: true}, (err, inbox) => err ?
        next(err) :
        res.status(200).links({
          type: [
            // future proof for pagination support (but only support one
            // page for now -- i.e. there is no "next" relation)
            'http://www.w3.org/ns/ldp#Container',
            'http://www.w3.org/ns/ldp#Resource',
            'http://www.w3.org/ns/ldp#Page']
        }).type('application/ld+json').send(inbox));
  });

  // query all inboxes
  app.get(
    routes.inboxes, ensureAuthenticated, brRest.when.prefers.ld,
    brRest.makeResourceHandler({
      get: (req, res, callback) => {
        const identity = req.user.identity;
        const query = {};
        const fields = {};
        const options = {};
        if(req.query.owner) {
          query.owner = database.hash(req.query.owner);
        }
        brLdnInbox.inboxes.getAll(
          identity, query, fields, options, (err, records) =>
            callback(err, err ? null : records.map(record => record.inbox)));
      }
    })
  );

  // get a message
  app.get(
    routes.messages + '/:message', ensureAuthenticated, (req, res, next) => {
      const id = api.createMessageId(req.params.message);
      brLdnInbox.messages.get(req.user.identity, id, (err, message) => err ?
        next(err) : res.status(200).type('application/ld+json').send(message));
    });
}); // end routes

bedrock.events.on('bedrock-views.vars.get', (req, vars, callback) => {
  vars['ldn-receiver'] = {
    inboxes: {
      basePath: config['ldn-receiver'].routes.inboxes
    },
    messages: {
      basePath: config['ldn-receiver'].routes.messages
    }
  };
  callback();
});
