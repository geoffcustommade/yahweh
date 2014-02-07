define(['yahweh', 'underscore'], function(Yahweh, _) {
  describe('Foundation', function() {
    function createView(properties) {
      var View, baseProperties;

      baseProperties = {
        template: 'page'
      };

      View = Yahweh.Foundation.extend(_.extend(baseProperties, properties));

      return new View();
    }

    beforeEach(function() {
      window.JST = {
        'page': _.template('<h1><%= title %></h1><p><%= content %></p>')
      };
    });

    it('should exist as Foundation', function() {
      expect(Yahweh.Foundation).toBeDefined();
    });

    it('should set a variable by the name of foo with value bar', function() {
      var key = 'foo', value = 'bar',
          view = createView(),
          instance = view.add(key, value);

      expect(instance).toEqual(jasmine.any(Yahweh.Foundation));
      expect(view.get(key)).toEqual(value);
    });

    it('should have a context method which it can set the scope on the template and then render', function() {
      spyOn(Yahweh.Foundation.prototype, 'context').andCallThrough();

      var data = {
          title: 'Some title',
          content: 'some content'
        },
        view = createView({
          context: function() {
            return data;
          }
        });

      expect(view.render().el).toContainHtml('<h1>Some title</h1>');
      expect(view.render().el).toContainHtml('<p>some content</p>');
    });
  });
});
