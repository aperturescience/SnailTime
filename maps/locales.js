'use strict';

exports.locale = function(locale) {

  switch(locale) {
    case 'fr':
      return 0;
    case 'nl':
      return 1;
    case 'de':
      return 2;
    case 'en':
      return 3;
    default:
      return 3;
  }

};