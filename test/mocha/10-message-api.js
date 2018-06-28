/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const async = require('async');
const brLdnInbox = require('bedrock-ldn-inbox');
const brLdnReceiver = require('bedrock-ldn-receiver');
const config = require('bedrock').config;
const expect = global.chai.expect;
const helpers = require('./helpers');
const mockData = require('./mock.data');
let request = require('request');
request = request.defaults({json: true, strictSSL: false});
const uuid = require('uuid/v4');

const messagesEndpoint = config.server.baseUri +
  config['ldn-receiver'].routes.messages;

describe('bedrock-ldn-receiver message API', () => {
  before(done => helpers.prepareDatabase(mockData, done));

  let inboxId;
  let inboxIdBeta;
  let inboxIdGamma;
  beforeEach(done => {
    async.series([
      callback => helpers.removeCollection(
        config['ldn-inbox'].collections.inbox, callback),
      callback => {
        const inbox = helpers.createRawInbox(mockData);
        inboxId = inbox.id;
        const owner = mockData.identities.regularUser.identity.id;
        brLdnInbox.inboxes.add(null, inbox, {owner: owner}, callback);
      },
      callback => {
        const inbox = helpers.createRawInbox(mockData);
        inboxIdBeta = inbox.id;
        const owner = mockData.identities.regularUser.identity.id;
        brLdnInbox.inboxes.add(null, inbox, {owner: owner}, callback);
      },
      callback => {
        const inbox = helpers.createRawInbox(mockData);
        inboxIdGamma = inbox.id;
        const owner = helpers.IDENTITY_BASE_PATH + 'someUser';
        brLdnInbox.inboxes.add(null, inbox, {owner: owner}, callback);
      }
    ], done);
  });
  describe('add API', () => {
    describe('unauthenticated user', () => {
      it('should return `PermissionDenied` error', done => {
        const inbox = helpers.createInbox(mockData);
        request.post({
          url: inboxId,
          json: inbox
        }, (err, res) => {
          expect(err).to.not.be.ok;
          res.statusCode.should.equal(400);
          res.body.type.should.equal('PermissionDenied');
          done();
        });
      });
    }); // end unauthenticated user
    describe('authenticated regular user', () => {
      it('should add a message', done => {
        const mockIdentity = mockData.identities.regularUser;
        const message = helpers.createMessage(mockData, {addId: false});
        async.auto({
          add: callback => request.post(helpers.createHttpSignatureRequest({
            url: inboxId,
            body: message,
            identity: mockIdentity
          }), (err, res) => {
            expect(err).to.not.be.ok;
            res.statusCode.should.equal(201);
            const location = res.headers.location;
            location.should.be.a('string');
            callback(null, location);
          }),
          testInbox: ['add', (results, callback) => brLdnInbox.inboxes.get(
            null, inboxId, {messageList: true}, (err, result) => {
              result.contains.should.have.same.members([results.add]);
              callback();
            })
          ],
          testMessage: ['add', (results, callback) => brLdnInbox.messages.get(
            null, results.add, (err, result) => {
              expect(err).to.not.be.ok;
              result.id.should.equal(results.add);
              result.content.should.equal(mockData.message.content);
              callback();
            }
          )]
        }, done);
      });
      it('returns `NotAcceptable` if message is empty', done => {
        const mockIdentity = mockData.identities.regularUser;
        const message = {};
        request.post(helpers.createHttpSignatureRequest({
          url: inboxId,
          body: message,
          identity: mockIdentity
        }), (err, res, body) => {
          expect(err).to.not.be.ok;
          expect(body).to.be.ok;
          body.should.be.an('object');
          res.statusCode.should.equal(400);
          body.type.should.equal('NotAcceptable');
          done();
        });
      });
      it('returns `PermissionDenied` if user does not own inbox', done => {
        const mockIdentity = mockData.identities.regularUser;
        const message = helpers.createMessage(mockData, {addId: false});
        request.post(helpers.createHttpSignatureRequest({
          url: inboxIdGamma,
          body: message,
          identity: mockIdentity
        }), (err, res, body) => {
          expect(err).to.not.be.ok;
          expect(body).to.be.ok;
          body.should.be.an('object');
          res.statusCode.should.equal(403);
          body.type.should.equal('PermissionDenied');
          body.details.sysPermission.should.equal('LDN_MESSAGE_INSERT');
          done();
        });
      });
    }); // end authenticated user
  }); // end add message
  describe('get API', () => {
    describe('unauthenticated user', () => {
      it('should return `PermissionDenied` error', done => {
        request.get({
          url: messagesEndpoint + '/' + uuid()
        }, (err, res) => {
          expect(err).to.not.be.ok;
          res.statusCode.should.equal(400);
          res.body.type.should.equal('PermissionDenied');
          done();
        });
      });
    }); // end unauthenticated user
    describe('authenticated regular user', () => {
      it('should get a message', done => {
        const mockIdentity = mockData.identities.regularUser;
        const message = helpers.createMessage(mockData);
        async.auto({
          add: callback => brLdnInbox.messages.add(
            null, message, {inbox: inboxId}, callback),
          get: ['add', (results, callback) => {
            const newMessageId = results.add.message.id.substring(
              results.add.message.id.lastIndexOf('/') + 1);
            request.get(helpers.createHttpSignatureRequest({
              url: messagesEndpoint + '/' + newMessageId,
              identity: mockIdentity
            }), (err, res, body) => {
              expect(err).to.not.be.ok;
              res.statusCode.should.equal(200);
              expect(body).to.be.ok;
              body.should.be.an('object');
              body.id.should.equal(results.add.message.id);
              body.content.should.equal(mockData.message.content);
              callback();
            });
          }]
        }, done);
      });
      it('returns `NotFound` on unknown message', done => {
        const mockIdentity = mockData.identities.regularUser;
        const unknownMessageId = brLdnReceiver.createMessageId();
        const messageId = unknownMessageId.substring(
          unknownMessageId.lastIndexOf('/') + 1);
        request.get(helpers.createHttpSignatureRequest({
          url: messagesEndpoint + '/' + messageId,
          identity: mockIdentity
        }), (err, res, body) => {
          expect(err).to.not.be.ok;
          res.statusCode.should.equal(404);
          expect(body).to.be.ok;
          body.should.be.an('object');
          body.type.should.equal('NotFound');
          body.details.message.should.equal(unknownMessageId);
          done();
        });
      });
      it('returns `PermissionDenied` if user does not own the inbox', done => {
        const mockIdentity = mockData.identities.regularUser;
        const message = helpers.createMessage(mockData);
        async.auto({
          add: callback => brLdnInbox.messages.add(
            null, message, {inbox: inboxIdGamma}, callback),
          get: ['add', (results, callback) => {
            const newMessageId = results.add.message.id.substring(
              results.add.message.id.lastIndexOf('/') + 1);
            request.get(helpers.createHttpSignatureRequest({
              url: messagesEndpoint + '/' + newMessageId,
              identity: mockIdentity
            }), (err, res) => {
              expect(err).to.not.be.ok;
              res.statusCode.should.equal(403);
              expect(res.body).to.be.ok;
              res.body.should.be.an('object');
              res.body.type.should.equal('PermissionDenied');
              res.body.details.sysPermission.should.equal('LDN_MESSAGE_ACCESS');
              callback();
            });
          }]
        }, done);
      });
    }); // end authenticated user
  }); // end get api
}); // end messages api
