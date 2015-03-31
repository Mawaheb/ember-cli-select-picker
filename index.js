/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-select-picker',

  included: function(app, parentAddon) {
    var target = (parentAddon || app);

    target.import('vendor/select-picker.css');
    target.import(app.bowerDirectory + '/mousetrap/mousetrap.js');

    target.import(
      app.bowerDirectory +
      '/mousetrap/plugins/global-bind/mousetrap-global-bind.js'
    );
  }
};
