define(['yahweh'], function(Yahweh) {
  describe('Yahweh Builder', function() {
    function createBuilder() {
      return new Yahweh.Builder({
        el: '#foo',
        sections: {
          navigation: {
            name: Backbone.View
          },
          content: {
            name: Backbone.View
          },
          sidebar: {
            name: Backbone.View
          },
          footer: {
            name: Backbone.View
          },
        }
      });
    }

    it('should have a Builder property on a Yahweh object', function() {
      expect(Yahweh.Builder).toBeDefined();
    });

    it('should be able to create a Yahweh.Builder object', function() {
      var builder = createBuilder();
      expect(builder).toEqual(jasmine.any(Yahweh.Builder));
    });

    it('should be able to render a builder object', function() {
      /*
      TODO: get jasmine jquery or jasmine fixutres going to test this
      var builder = createBuilder().render();
      */
    })
  });
});
