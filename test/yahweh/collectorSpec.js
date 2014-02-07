define(['yahweh', 'test/mocks/collector'], function(Yahweh, MockCollector) {
  describe('Collector', function() {
    it('should exist as Collector', function() {
      expect(Yahweh.Collector).toBeDefined();
    });

    it('should exist as factory called collector', function() {
      expect(Yahweh.collector).toBeDefined();
    });

    it('should render a collector by default', function() {
      var collector = MockCollector();
      expect(collector).toEqual(jasmine.any(Yahweh.Collector));
    });

    it('should take in a subView', function() {
      var collector = MockCollector();
      expect(collector.subView).toBeDefined();
    });

    it('should delay the rendering of a collectorla', function() {
      var collector = MockCollector({
        render: false
      });

      expect(collector.$el.html()).toEqual('');
    });

    it('should append 7 sub views', function() {
      var collector = MockCollector();
      expect(collector.el.children.length).toEqual(7);
    });

    it('should be able to take in a parent view', function() {
      var collector = MockCollector({
        parent: new Backbone.View()
      });

      expect(collector.parent).toEqual(jasmine.any(Backbone.View));
    });

    it('should be able to take in args that are passed to the sub view', function() {
      spyOn(Yahweh.Collector.prototype, 'createSubView').andCallThrough();

      var collector = MockCollector({
        args: {
          name: 'Manning',
          status: 'cool dude'
        }
      });

      expect(Yahweh.Collector.prototype.createSubView).toHaveBeenCalled();
      console.log(Yahweh.Collector.prototype.createSubView.mostRecentCall.args[0].attributes);
    });
  });
});
