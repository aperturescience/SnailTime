'use strict';

exports.RailtimeException = function(msg, code) {
  return new exports.Exception(msg, 'RailtimeException', code);
};

exports.UnknownException = function(msg, code) {
  return new exports.Exception(msg, undefined, code);
};

exports.Exception = function(msg, type, code) {
  return {
    'error' : {
      'code'    : code,
      'message' : msg,
      'type'    : type || 'UnknownException',
    }
  };
};