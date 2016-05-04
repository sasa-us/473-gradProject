/**
* User.js
*
* @description :
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // The user's full name
    // e.g. Sha Lu
    name: {
      type: 'string',
      required: true
    },

    // The user's title at their job (or something)
    // e.g. student
    title: {
      type: 'string'
    },

    // The user's email address
    // e.g. sasa@test.com
    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },

    // The encrypted password for the user
    // e.g. asdgh8a249321e9dhgaslcbqn2913051#T(@GHASDGA
    encryptedPassword: {
      type: 'string',
      required: true
    },

    // The timestamp when the the user last logged in
    // (i.e. sent a username and password to the server)
    lastLoggedIn: {
      type: 'date',
      required: true,
      defaultsTo: new Date(0)
    },

    // url for gravatar
    gravatarUrl: {
      type: 'string'
    },

    balance: {
      type: 'int'
    }
    
  }
};
