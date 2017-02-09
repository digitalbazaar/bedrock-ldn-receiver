/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
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

const testEndpoint = config.server.baseUri +
  config['ldn-receiver'].routes.inboxes;

describe('bedrock-ldn-receiver inbox API', () => {
  before(done => helpers.prepareDatabase(mockData, done));

  describe('add API', () => {
    describe('unauthenticated user', () => {
      it('should return `PermissionDenied` error', done => {
        const inbox = helpers.createInbox(mockData);
        request.post({
          url: testEndpoint,
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
      it('should add a new inbox', done => {
        let newInboxId;
        const mockIdentity = mockData.identities.regularUser;
        const inbox = helpers.createInbox(mockData);
        async.auto({
          add: callback => request.post(helpers.createHttpSignatureRequest({
            url: testEndpoint,
            body: inbox,
            identity: mockIdentity
          }), (err, res) => {
            expect(err).to.not.be.ok;
            res.statusCode.should.equal(201);
            const location = res.headers.location;
            location.should.be.a('string');
            newInboxId = location;
            callback();
          }),
          test: ['add', (results, callback) => {
            brLdnInbox.inboxes.get(
              null, newInboxId, {meta: true}, (err, result) => {
                const inbox = result.inbox;
                inbox.id.should.equal(newInboxId);
                const meta = result.meta;
                meta.owner.should.equal(mockIdentity.identity.id);
                callback();
              });
          }]
        }, done);
      });
    }); // end authenticated user
  }); // end create inbox
  describe('get API', () => {
    describe('unauthenticated user', () => {
      it('should return `PermissionDenied` error', done => {
        request.get({
          url: testEndpoint + '/' + uuid()
        }, (err, res) => {
          expect(err).to.not.be.ok;
          res.statusCode.should.equal(400);
          res.body.type.should.equal('PermissionDenied');
          done();
        });
      });
    }); // end unauthenticated user
    describe('authenticated regular user', () => {
      it('should get an inbox', done => {
        const mockIdentity = mockData.identities.regularUser;
        const inbox = helpers.createRawInbox(mockData);
        async.auto({
          add: callback => brLdnInbox.inboxes.add(
            null, inbox, {owner: mockIdentity.identity.id}, callback),
          get: ['add', (results, callback) => {
            const newInboxId = results.add.inbox.id.substring(
              results.add.inbox.id.lastIndexOf('/') + 1);
            request.get(helpers.createHttpSignatureRequest({
              url: testEndpoint + '/' + newInboxId,
              identity: mockIdentity
            }), (err, res) => {
              expect(err).to.not.be.ok;
              res.statusCode.should.equal(200);
              expect(res.body).to.be.ok;
              res.body.should.be.an('object');
              res.body.id.should.equal(results.add.inbox.id);
              res.body.contains.should.be.an.array;
              res.body.contains.should.have.length(0);
              callback();
            });
          }]
        }, done);
      });
      it('returns `NotFound` on unknown inbox', done => {
        const mockIdentity = mockData.identities.regularUser;
        const unknownInboxId = brLdnReceiver.createInboxId();
        const inboxId = unknownInboxId.substring(
          unknownInboxId.lastIndexOf('/') + 1);
        request.get(helpers.createHttpSignatureRequest({
          url: testEndpoint + '/' + inboxId,
          identity: mockIdentity
        }), (err, res, body) => {
          expect(err).to.not.be.ok;
          res.statusCode.should.equal(404);
          expect(body).to.be.ok;
          body.should.be.an('object');
          body.type.should.equal('NotFound');
          body.details.inbox.should.equal(unknownInboxId);
          done();
        });
      });
      it('returns `PermissionDenied` if user does not own the inbox', done => {
        const mockIdentity = mockData.identities.regularUser;
        const inbox = helpers.createRawInbox(mockData);
        async.auto({
          add: callback => brLdnInbox.inboxes.add(
            null, inbox, {owner: 'https://.../someUser'}, callback),
          get: ['add', (results, callback) => {
            const newInboxId = results.add.inbox.id.substring(
              results.add.inbox.id.lastIndexOf('/') + 1);
            request.get(helpers.createHttpSignatureRequest({
              url: testEndpoint + '/' + newInboxId,
              identity: mockIdentity
            }), (err, res) => {
              expect(err).to.not.be.ok;
              res.statusCode.should.equal(403);
              expect(res.body).to.be.ok;
              res.body.should.be.an('object');
              res.body.type.should.equal('PermissionDenied');
              res.body.details.sysPermission.should.equal('LDN_INBOX_ACCESS');
              callback();
            });
          }]
        }, done);
      });
    }); // end authenticated user
  }); // end get api
}); // end inbox api
