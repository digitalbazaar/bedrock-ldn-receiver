/*
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');

const schema = {
  type: 'object',
  title: 'LDN Inbox',
  errors: {
    invalid: 'The LDN inbox is invalid.',
    missing: 'Please provide an LDN inbox.'
  }
};

module.exports = function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
