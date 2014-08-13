'use strict';

exports.RailtimeException = function(msg, type, code) {
  return new exports.Exception(msg, 'RailtimeException', code);
};

exports.Exception = function(msg, type, code) {
  return {
    'error' : {
      'code'    : code,
      'message' : msg,
      'type'    : type || 'GenericException',
    }
  };
};