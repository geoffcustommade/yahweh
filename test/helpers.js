define(function() {
  var Helpers = {
    setFixture: function(path) {
      var fixture, fixtures = window.__html__ || {};

      if ((fixture = fixtures[path])) {
        setFixtures(fixture);
      } else {
        throw {
          name: 'FixtureNotFound',
          message: 'No fixture was found for path ' + path,
          toString: function() {
            return this.name + ':' + this.message;
          }
        };
      }
    }
  };

  return Helpers;
});