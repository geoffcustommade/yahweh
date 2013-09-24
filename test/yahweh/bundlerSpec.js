define(['yahweh', 'jasmine-jquery'], function(Yahweh) {
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

    beforeEach(function() {
      setFixtures('<div id="foo"></div>');
      this.bundler = createBundler();
    });

    it('should have a Bundler property on a Yahweh object', function() {
      expect(Yahweh.Bundler).toBeDefined();
    });

    it('should be able to take in an el property', function() {
      expect(this.bundler.el).toBeDefined();
    });

    it('should be able to take in a views which in an array', function() {
      expect(this.bundler.views).toBeDefined();
    });

    it('should return back a length of 3 from a bundler instance', function() {
      expect(this.bundler.length).toEqual(3);
    });

    it('should be able to add a view from an existing bundler', function() {
      spyOn(Yahweh.Bundler.prototype, 'createView');
      this.bundler.addView(createView());
      expect(Yahweh.Bundler.prototype.createView).toHaveBeenCalled();
    });

    it('should increment the length when adding a new view', function() {
      this.bundler.addView(createView());
      expect(this.bundler.length).toEqual(4);
    });
  });
});
