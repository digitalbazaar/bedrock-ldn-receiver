/*
 * Bedrock Linked Data Notifications Receiver Module.
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const async = require('async');
const bedrock = require('bedrock');
const config = bedrock.config.main;
const constants = config.constants;
const jsonld = bedrock.jsonld;
const uuidV4 = require('uuid/v4');
const URL = require('url');
require('bedrock-express');
const brPassport = require('bedrock-passport');
const ensureAuthenticated = brPassport.ensureAuthenticated;
const brLdnInbox = require('bedrock-ldn-inbox');
const validate = require('bedrock-validation').validate;
const BedrockError = bedrock.util.BedrockError;

// load config defaults
require('./config');

// module API
const api = {};
module.exports = api;

const logger = bedrock.loggers.get('app');

bedrock.events.on('bedrock-express.configure.routes', app => {
  const routes = bedrock.config.main['ldn-receiver'].routes;

  // an inbox needs to be ldp:BasicContainer
  const inboxFrame = {
    '@context': [constants.LDP_URL, {
      owner: {'@id': 'https://w3id.org/security#owner', '@type': '@id'}
    }],
    type: 'BasicContainer'
  };

  const messageContext = {
    '@context': constants.ACTIVITY_STREAMS_URL
  };

  // create a new inbox
  app.post(
    routes.inboxes,
    ensureAuthenticated,
    validate('bedrock-ldn-receiver.postInbox'),
    (req, res, next) => async.auto({
      frame: callback => jsonld.frame(req.body, inboxFrame, callback),
      validate: ['frame', (results, callback) => {
        const inbox = results.frame['@graph'][0] || {};
        if(!jsonld.hasValue(inbox, 'type', 'BasicContainer')) {
          return callback(new BedrockError(
            'An inbox must be a Linked Data Platform `BasicContainer`.',
            'NotAcceptable', {httpStatusCode: 400, public: true}));
        }
        callback(null, inbox);
      }],
      store: ['validate', (results, callback) => {
        // generate new random ID for inbox
        const inbox = results.validate;
        inbox.id = URL.resolve(routes.inboxes, uuidV4());
        const { owner: owner=req.user.identity.id } = inbox;
        brLdnInbox.inboxes.add(
          req.user.identity, inbox, {owner: owner},
          err => callback(err, inbox.id));
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
      compact: callback => jsonld.compact(req.body, messageContext, callback),
      store: ['compact', (results, callback) => {
        // generate new random ID for message
        const message = results.compact;
        const previousId = message.id || null;
        message.id = URL.resolve(routes.messages, uuidV4());
        const inbox = URL.resolve(config.server.baseUri, req.originalUrl);
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
              req.user.identity, event.message, {
                inbox: event.inbox,
                meta: event.meta
              }, err => callback(err, event.message.id)));
      }]
    }, (err, results) => err ?
      next(err) : res.status(201).location(results.store).end()));

  // get inbox info, including list of messages
  app.get(
    routes.inboxes + '/:inbox',
    ensureAuthenticated,
    (req, res, next) => {
      const inbox = URL.resolve(config.server.baseUri, req.originalUrl);
      brLdnInbox.inboxes.get(
        req.user.identity, inbox, {messageList: true}, (err, inbox) => err ?
          next(err) :
          res.status(200).type('application/ld+json').send(inbox));
    });

  // get a message
  app.get(
    routes.messages + '/:message',
    ensureAuthenticated,
    (req, res, next) => {
      const id = URL.resolve(config.server.baseUri, req.originalUrl);
      brLdnInbox.messages.get(req.user.identity, id, (err, message) => err ?
        next(err) : res.status(200).type('application/ld+json').send(message));
    });
});
