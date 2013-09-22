define(['yahweh'], function(Yahweh) {
  describe('Yahweh Inject', function() {
    it('should exist on the Yahweh window object', function() {
      expect(Yahweh.Inject).toBeDefined();
    });

    it('should return an instance of Backbone.View.', function() {
      var view = Yahweh.Inject({
        name: Backbone.View
      });

      expect(view).toEqual(jasmine.any(Backbone.View));
    });

    it('should be receptive to accepting arguments', function() {
      var view = Yahweh.Inject({
        name: Backbone.View,
        args: {
          tagName: 'section',
          className: 'shutup'
        }
      });

      expect(view.tagName).toEqual('section');
      expect(view.className).toEqual('shutup');
    });

    it('should take in a model as an argument and pass it in as an argument on the view', function() {
      var view = Yahweh.Inject({
        name: Backbone.View,
        args: {
          model: {
            name: Backbone.Model
          }
        }
      });

      expect(view.model).toEqual(jasmine.any(Backbone.Model));
    });

    it('should take in a model as an argument, that takes in arguments, and will pass it in as an argument on the view', function() {
      var view = Yahweh.Inject({
        name: Backbone.View,
        args: {
          model: {
            name: Backbone.Model,
            args: {
              firstName: 'Leland',
              age: 7
            }
          }
        }
      });

      expect(view.model.get('firstName')).toEqual('Leland');
      expect(view.model.get('age')).toEqual(7);
    });

    it('should take in a collection as an argument and pass it in as an argument on the view', function() {
      var view = Yahweh.Inject({
        name: Backbone.View,
        args: {
          collection: {
            name: Backbone.Collection
          }
        }
      });

      expect(view.collection).toEqual(jasmine.any(Backbone.Collection));
    });

    it('should take in a collection as an argument, that takes in arguments, and will pass it in as an argument on the view', function() {
      var Records = Backbone.Collection.extend({
        url: '/pages',
        model: Backbone.Model
      });

      var view = Yahweh.Inject({
        name: Backbone.View,
        args: {
          collection: {
            name: Records,
            args: [
              {
                name: 'Stars of the Lid'
              },
              {
                name: 'Sigur Ros'
              },
              {
                name: 'The Life and Times'
              }
            ]
          }
        }
      });

      expect(view.collection.url).toBe('/pages');
      expect(view.collection.length).toBe(3);
      expect(view.collection.at(1).get('name')).toEqual('Sigur Ros');
    });
  });
});