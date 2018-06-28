/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const helpers = require('./helpers');

const mock = {};
module.exports = mock;

const identities = mock.identities = {};
let userName;

userName = 'regularUser';
identities[userName] = {};
identities[userName].identity = helpers.createIdentity({userName: userName});
identities[userName].identity.sysResourceRole.push({
  sysRole: 'bedrock-ldn-receiver.test',
  generateResource: 'id'
});
identities[userName].keys = helpers.createKeyPair({
  userName: userName,
  // userId: identities[userName].identity.id,
  publicKey: '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqv8gApfU3FhZx1gyKmBU\n' +
    'czZ1Ba3DQbqcGRJiwWz6wrr9E/K0PcpRws/+GPc1znG4cKLdxkdyA2zROUt/lbaM\n' +
    'TU+/kZzRh3ICZZOuo8kJpGqxPDIm7L1lIcBLOWu/UEV2VaWNOENwiQbh61VJlR+k\n' +
    'HK9LhQxYYZT554MYaXzcSRTC/RzHDTAocf+B1go8tawPEixgs93+HHXoLPGypmqn\n' +
    'lBKAjmGMwizbWFccDQqv0yZfAFpdVY2MNKlDSUNMnZyUgBZNpGOGPm9zi9aMFT2d\n' +
    'DrN9fpWMdu0QeZrJrDHzk6TKwtKrBB9xNMuHGYdPxy8Ix0uNmUt0mqt6H5Vhl4O0\n' +
    '0QIDAQAB\n' +
    '-----END PUBLIC KEY-----\n',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEpQIBAAKCAQEAqv8gApfU3FhZx1gyKmBUczZ1Ba3DQbqcGRJiwWz6wrr9E/K0\n' +
    'PcpRws/+GPc1znG4cKLdxkdyA2zROUt/lbaMTU+/kZzRh3ICZZOuo8kJpGqxPDIm\n' +
    '7L1lIcBLOWu/UEV2VaWNOENwiQbh61VJlR+kHK9LhQxYYZT554MYaXzcSRTC/RzH\n' +
    'DTAocf+B1go8tawPEixgs93+HHXoLPGypmqnlBKAjmGMwizbWFccDQqv0yZfAFpd\n' +
    'VY2MNKlDSUNMnZyUgBZNpGOGPm9zi9aMFT2dDrN9fpWMdu0QeZrJrDHzk6TKwtKr\n' +
    'BB9xNMuHGYdPxy8Ix0uNmUt0mqt6H5Vhl4O00QIDAQABAoIBAQCpA3yXM42AsY8j\n' +
    'mwgSnJ48NqJaF5L8P7+UhHi6KMZ+fSYydl0zCevge4bzFD3JrNuZ8VD1b57AxejT\n' +
    'Ec2so/9vVxjJi1AK6WR3FA608rumGJLQJd4Vd2ojfxabTeWOKOo642R/LSFpPzVE\n' +
    'T0toqxqiA53IhxhAc2jDLO+PLIvrao0Y8bWWq36tbxsAplrv8Gms6ZRwfKoX5P32\n' +
    'azBpJOqneNdSMRPHky6t2uiYyuPeG9pbuaClkD7Ss9lpH0V1DLQmAAlP9I0Aa06B\n' +
    'a9zPFPb3Ae8F0HO/tsf8gIvrlT38JvLe5VuCS7/LQNCZguyPZuZOXLDmdETfm1FD\n' +
    'q56rCV7VAoGBANmQ7EqDfxmUygTXlqaCQqNzY5pYKItM6RFHc9I+ADBWsLbuKtfP\n' +
    'XUMHQx6PvwCMBpjZkM7doGdzOHb0l3rW8zQONayqQxN9Pjd7K+dkSY6k0SScw46w\n' +
    '0AexDQSM/0ahVAHfXXi1GbKwlonM0nn/7JHz7n/fL9HwV8T3hAGClbPDAoGBAMk0\n' +
    'K5d+Ov55sKW0ZatZ0vTnfBCSrVEfG6FkcyK7uiSsMdWo2/De0VtJF7od2DM5UyP6\n' +
    'Y/DSVk4oPepbug5oGdu8t1Q3jbS61A7i/dssirQC4hEFAtoTGsVfaH8wu4AKyWd7\n' +
    '0rUmSrnyqNr4mfQBjdaXByvWO9rdEfZcZqaSQ4/bAoGAKy/CR7Q8eYZ4Z2eoBtta\n' +
    'gPl5rvyK58PXi8+EJRqbjPzYTSePp5EI8TIy15EvF9uzv4mIXhfOLFrJvYsluoOK\n' +
    'eS3M575QXEEDJZ40g9T7aO48eakIhH2CfdReQiX+0jVZ6Jk/A6PnOvokl6vpp7/u\n' +
    'ZLZoBEf4RRMRSQ7czDPwpWMCgYEAlNWZtWuz+hBMgpcqahF9AprF5ICL4qkvSDjF\n' +
    'Dpltfbk+9/z8DXbVyUANZCi1iFbMUJ3lFfyRySjtfBI0VHnfPvOfbZXWpi1ZtlVl\n' +
    'UZ7mT3ief9aEIIrnT79ezk9fM71G9NzcphHYTyrYi3pAcAZCRM3diSjlh+XmZqY9\n' +
    'bNRfU+cCgYEAoBYwp0PJ1QEp3lSmb+gJiTxfNwIrP+VLkWYzPREpSbghDYjE2DfC\n' +
    'M8pNbVWpnOfT7OlhN3jw8pxHWap6PxNyVT2W/1AHNGKTK/BfFVn3nVGhOgPgH1AO\n' +
    'sObYxm9gpkNkelXejA/trbLe4hg7RWNYzOztbfbZakdVjMNfXnyw+Q0=\n' +
    '-----END RSA PRIVATE KEY-----\n'
});

userName = 'altUser';
identities[userName] = {};
identities[userName].identity = helpers.createIdentity({userName: userName});
identities[userName].identity.sysResourceRole.push({
  sysRole: 'bedrock-ldn-receiver.test',
  generateResource: 'id'
});
identities[userName].keys = helpers.createKeyPair({
  userName: userName,
  // userId: identities[userName].identity.id,
  publicKey: '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwwDuZMlV6qg1fzqqLw3a\n' +
    '0XcdsGSVVmRzhyD05WU8moUPSohod5M21rm/bF9NShaEPfM0z99kwOiE+sOW2eM1\n' +
    'u0rDC2IrKRv1H1bKRY7/yt6LXJr2qeeTtprvaZ0t56YDn2X+2V7HckY0kr0e7b/h\n' +
    'pM+VGtobvcVa2XQcTznwYDbNz6gPndxharyb2cSNTJXcSDjHLlUdvL50e10f/KTy\n' +
    'V4kJNm8Ksyrk5Fs6QOaL4gpi5J0U7dyD5ZLkTLf+LE4bUah+DscnELVGpD3PMEB4\n' +
    'jqox+n/oX5TLbP6F1UBGk0wq4UZewoaD0BilJHHznciDF1mrsEWzYZ+O9vlfgQck\n' +
    'AQIDAQAB\n' +
    '-----END PUBLIC KEY-----\n',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEpAIBAAKCAQEAwwDuZMlV6qg1fzqqLw3a0XcdsGSVVmRzhyD05WU8moUPSoho\n' +
    'd5M21rm/bF9NShaEPfM0z99kwOiE+sOW2eM1u0rDC2IrKRv1H1bKRY7/yt6LXJr2\n' +
    'qeeTtprvaZ0t56YDn2X+2V7HckY0kr0e7b/hpM+VGtobvcVa2XQcTznwYDbNz6gP\n' +
    'ndxharyb2cSNTJXcSDjHLlUdvL50e10f/KTyV4kJNm8Ksyrk5Fs6QOaL4gpi5J0U\n' +
    '7dyD5ZLkTLf+LE4bUah+DscnELVGpD3PMEB4jqox+n/oX5TLbP6F1UBGk0wq4UZe\n' +
    'woaD0BilJHHznciDF1mrsEWzYZ+O9vlfgQckAQIDAQABAoIBAFPVf6fGwvAaFr22\n' +
    '69lE3JD248WkyGsWznAGpCJGzrIjiDpjwH2/xXC09G3T3vd+DKZRe5/ui3M/w4PH\n' +
    'OIA95Si68HVhY+rNgSlS96zF2IRP/pv2ZxsOWvvDSjAeidCwF5ickd7Dl30yX4HC\n' +
    'WpydxJVFRPYBVLHWOcOI3m7VGtlRlivzncDWFKJue14WICEYpH6402+PR43PQEYz\n' +
    '49It/kyh0kHEm08rNv5POFfMDhq1ZK8LLJvZVNYu1O1viXy86l/UYLQMFl2StBvh\n' +
    'P4GE+ESnPh0ATdAedcWJPe6nqg2jHvoNg88ba9tB0nR90tIc/8+Zdx8a3mS71C/Q\n' +
    'OjyTYD0CgYEA5DOln/r6Rp4QEobK2u2BcMSRp32kHow+dOoO6uw6+CKheQeBbudL\n' +
    '7hvnT+lWhK85WM+fvE1xGTg6TExaEDeMuE80d4aT39dcAKIdyI8QwCnLZuD/dhyk\n' +
    'x71OIBx9GiyFqfaS3yuPNF94MzuEV0sD7H2y+ZThZ7mVpm+vEqvW/r8CgYEA2sIE\n' +
    'unuyTsRlP7sbOO8fkC6tT1oq1wmMvsxIHD2HKqOJEbDXjlU2EhdKadQaC+FGDihc\n' +
    'x8Ro+bSSj9b3cHmXEBVWGanWve/E5EqZ925F2Me7LZcj3rx4aAhqFciOwjEQ6bRx\n' +
    'm4O/NpesKNY8T7N4+9mUBsG4sQYyFBvHtKJBTT8CgYEApPREW8Ei2pr1CT9QMTKP\n' +
    'Z4FfvA+Q69f6aa6q+9uowKbfy8nGIPGmrEaVTOlhdeXncTAbyhS8lTtUwMRMMf7F\n' +
    'hJEUXvXzvFFDGt4U412vAQj1E7e+UZVg81T+vS16rMnUEMjA3/rvuC7uhzIVdrgt\n' +
    '7OvrzId26/B1oWqHxdpbPacCgYEArhHW22EUeHL0siq7takpb3yE8fCoyCXUNfqt\n' +
    'orMe/EHXDxmt3JdXiDu6Pc3F0BA4w4lAksFqWtBiE00V5g0KtISV16P6uXayMIpg\n' +
    'S7AWqjH8coGizFkiYn3XlG/bkRCkCaNJB1tlaxZzqqcWpMEGEzmF/X5m7Y4liTS1\n' +
    'y7mUxtcCgYAvzACJn1aGAkaFAF9Y7Ieq5AVIR0WdHmbmtX2rnceTBpYqfwK/7z5O\n' +
    'tGi2i7UjQoHfVYSrSFykGNDvPcOU/rChIeONjXB7gm+tJyzfMRsF/0Tr6TRsynnw\n' +
    'uI5hIk90Slfae8Z54pgflvJoLGLeyq2vBVq84I6yX6ks4Z8Qhtxd9g==\n' +
    '-----END RSA PRIVATE KEY-----\n'
});

userName = 'organization';
identities[userName] = {};
identities[userName].identity = helpers.createIdentity({userName: userName});
identities[userName].identity.sysResourceRole.push({
  sysRole: 'bedrock-ldn-receiver.test',
  generateResource: 'id'
});

userName = 'organizationMember';
identities[userName] = {};
identities[userName].identity = helpers.createIdentity({userName: userName});
identities[userName].identity.sysResourceRole.push({
  sysRole: 'bedrock-ldn-receiver.test',
  resource: [
    identities[userName].identity.id,
    identities['organization'].identity.id
  ]
});
identities[userName].keys = helpers.createKeyPair({
  userName: userName,
  // userId: identities[userName].identity.id,
  publicKey: '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxIYYDRsk2YCoj0hvlvGV\n' +
    'ZD9Sh8DJL8FOdYTVWb4EUDXPNeYpCptni3BTnELtcodr9GO6Nk/pGyXQ4Dop258P\n' +
    '0F8HMYk27PzkssR0rCFWxN67TANHrMadWhqlash+pw25Gv4soolndNaUtsCOpRoa\n' +
    'Yi+BDr1i1zvCPBisarR6WrpxmZ3qxiBf9V05GpsL0tXB4pSy3+pnvFKNbOD7wPWN\n' +
    '7hJP8EsL30ykbv+eMa7d5pi0uuo00TYYYdstIsvoMX8xX31/dozOlUzrQyC+XOKY\n' +
    '6fNLZYGRJr5oZZixsI+b1aIA0/hgL5o6L8vkOyDSkZTmH+/3N5aQYNTommWJoqBy\n' +
    'aQIDAQAB\n' +
    '-----END PUBLIC KEY-----\n',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEogIBAAKCAQEAxIYYDRsk2YCoj0hvlvGVZD9Sh8DJL8FOdYTVWb4EUDXPNeYp\n' +
    'Cptni3BTnELtcodr9GO6Nk/pGyXQ4Dop258P0F8HMYk27PzkssR0rCFWxN67TANH\n' +
    'rMadWhqlash+pw25Gv4soolndNaUtsCOpRoaYi+BDr1i1zvCPBisarR6WrpxmZ3q\n' +
    'xiBf9V05GpsL0tXB4pSy3+pnvFKNbOD7wPWN7hJP8EsL30ykbv+eMa7d5pi0uuo0\n' +
    '0TYYYdstIsvoMX8xX31/dozOlUzrQyC+XOKY6fNLZYGRJr5oZZixsI+b1aIA0/hg\n' +
    'L5o6L8vkOyDSkZTmH+/3N5aQYNTommWJoqByaQIDAQABAoIBAES5/FlA/98MjmYl\n' +
    'V9j6vVrkhjExa2pG+PBCNvZ+bDW8y602w22RMWHjM2o3QaDG2SsLYUizI3s5+1Uf\n' +
    'IhpLAxXE1dgt+0Zfnn8iEwdLVXPdzLRlhUBX6Rlkriqs2RYEx5I4B1YEJWkHzdQn\n' +
    'fPsiKM3jfQexlYpdvKyVmF5spUlqwpP/cMswSvvpIGX9YRjv7aIwix5qUFOS1h42\n' +
    'IFyNAXnLIFij76ArQN33x/aHKbILNHSNXUwdZDdW8m9HgUxAxc38+3bcAnG6BXtw\n' +
    'AUD760Q7+X4Xw4NWyQy1S4OK3IWrYEvz0BiLpGYKXgR1s50UkZFG9hjEeIK3eNjS\n' +
    '3TKq3IECgYEA+i7NwiYy02EnvFg5D3WHWnrkpMwZdj0Nbbu0FP93npSzlRXS9hEB\n' +
    'gB8mE/T1PMDRVx3x19pi1szPFJmCtMnyC0Y96SayiTu3vDUay8fKEXQk/X8fo5mu\n' +
    'YHco5a9LxUOZEn0jZW4jUIzKFZh2UaHr5hTFTF4+RkMsBqyaBdwJkJkCgYEAyRfj\n' +
    'dl7XOAWAsKFjxaEKGwZaM1+tK2FScQ1bVsI8d/gEzO2+tWuzBTOd08DRQyEZiT64\n' +
    'vea4zW5GcCZBYv2MqB4Qn9dtD4aXe4G5t6O/pgH+t5ZqT0YywOLZjMCZV5BwUZzJ\n' +
    'eV9L2pKAMUcQ3NUS9ec3aGznA4VTmFP0+gkMglECgYAX1gW8ja8h/IuwoictleED\n' +
    'edn26YszfLWe0tdheMWI0loZxi6HSy99aXpTRG9pDmXjivLTwfbQyEqih82wM91f\n' +
    'vZ2AbTNtZ8clo1meOLbD2vD7RfVZvPakMjYvS/hIHxyialHJBClRL1jBnfkH5gl3\n' +
    'rlrt37zHLPcw25kBHem7YQKBgE8N2Robxrf7UdAeYj67RGHDaYpwvn8jT2mqOpIs\n' +
    '4eC33AtEG4juwf31gMJSNvIQ/Rz7T104asY35/EG2QW1b6pXx2lPI0zLOJoRMZWE\n' +
    'Bj+Y4S4DL9/iVOmHRMcUoDPQUJeE75+LWyKeHU9CBNsL2Nxa/WlMBrVXoLltqAzz\n' +
    'qbtBAoGABo8mN9Ic2X4wVihRRILDSyXGy3cQIl+BjPExDMOGj9sjAVPRO9deBSLM\n' +
    'G6pFlvCbr5wodJTxHe20waL+QOQOcleJhtmEH1DQ9izu8lrMGj02XiVP/3xMtnnx\n' +
    'FJ9rt3mtqwUFK3KhHUybaFvUaLU/sdsEoVeTgduQ0OZQ5kup2Bo=\n' +
    '-----END RSA PRIVATE KEY-----\n'
});

mock.inbox = {
  '@context': {ldp: 'http://www.w3.org/ns/ldp#'},
  '@type': 'ldp:Container'
};

mock.rawInbox = {
  "type": "Container",
  "@context": [
    "https://www.w3.org/ns/ldp",
    {
      "owner": {
        "@id": "https://w3id.org/security#owner",
        "@type": "@id"
      }
    }
  ]
};

mock.message = {
  '@context': 'https://www.w3.org/ns/activitystreams',
  content: 'mock message content'
};

const bedrock = require('bedrock');
const config = bedrock.config;
const jsonld = bedrock.jsonld;
const oldLoader = jsonld.documentLoader;
jsonld.documentLoader = function(url, callback) {
  const regex = new RegExp(
    config.passport.strategies.did.didio.baseUrl + '(.*?)$');
  const didMatch = url.match(regex);
  if(didMatch && didMatch.length === 2 && didMatch[1] in mock.didDocuments) {
    return callback(
      null, {
        contextUrl: null,
        document: mock.didDocuments[didMatch[1]],
        documentUrl: url
      });
  }
  oldLoader(url, callback);
};
