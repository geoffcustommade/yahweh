define(['yahweh'], function(Yahweh) {
  describe('Yahweh Bundler', function() {
    function createView() {
      return {
        name: Backbone.View,
        args: {
          tagName: 'section',
          model: {
            name: Backbone.Model
          }
        }
      };
    }

    function createBundler() {
      var bundler = new Yahweh.Bundler({
        el: '#foo',

        views: [
          createView(),
          createView(),
          createView()
        ]
      });

      return bundler;
    }

    it('should have a Bundler property on a Yahweh object', function() {
      expect(Yahweh.Bundler).toBeDefined();
    });

    it('should be able to take in an el property', function() {
      var bundler = new Yahweh.Bundler({
        el: '#foo'
      });

      // TODO: hook up jasmine fixtures to make this validate
      //expect(bundler.el).toBeDefined();
    });

    it('should be able to take in a views which in an array', function() {
      var bundler = createBundler();
      expect(bundler.views).toBeDefined();
    });

    it('should return back a length of 3 from a bundler instance', function() {
      var bundler = createBundler();
      expect(bundler.length).toEqual(3);
    });

    it('should be able to add a view from an existing bundler', function() {
      spyOn(Yahweh.Bundler.prototype, 'createView');
      var bundler = createBundler();
      bundler.addView(createView());
      expect(Yahweh.Bundler.prototype.createView).toHaveBeenCalled();
    });

    it('should increment the length when adding a new view', function() {
      var bundler = createBundler();
      bundler.addView(createView());
      expect(bundler.length).toEqual(4);
    })
  });
});
