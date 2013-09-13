define(['backbone', 'underscore', 'yahweh'], function(Backbone, _, Yahweh) {
  var Views = {};

  window.JST = {};
  JST['navigation'] = _.template('<ul><% _.each(items, function(item) { %><li><a href="#<%= item.path %>"><%= item.name %></a></li><% }); %></ul>');

  var BaseView = Backbone.View.extend({
    implement: [
      'foo', 'bar'
    ],
  });

  Views.Foo = Backbone.Model.extend({
    defaults: {
    },

    initialize: function(attrs) {
    },

    isSomething: function() {
      return true;
    }
  });

  Views.FooView = Yahweh.View.extend({
    path: 'foo',

    name: 'Foo',

    initialize: function(options) {
    },

    render: function() {
      this.el.innerHTML = '<p>render foo</p>';
      return this;
    }
  });

  Views.BarView = Backbone.View.extend({
    path: 'bar',

    name: 'Bar',

    foo: 'got foo',

    render: function() {
      this.el.innerHTML = '<p>render bar</p>'
      return this;
    }
  });

  Views.BazView = Backbone.View.extend({
    path: 'baz',

    name: 'Baz',

    render: function() {
      this.el.innerHTML = '<p>render baz</p>'
      return this;
    }
  });

  Views.NavigationView = Yahweh.View.extend({
    initialize: function(options) {
      this.views = options.views;
    },

    render: function() {
      return this.renderTemplate('navigation', {
        items: this.getTemplateData()
      });
    },

    getTemplateData: function() {
      var i, len, view, list = [];

      for (i = 0, len = this.views.length; i < len; i++) {
        view = this.views[i];
        list.push({
          path: view.path,
          name: view.name
        });
      }

      return list;
    }
  });

  Views.SidebarView = Backbone.View.extend({
    render: function() {
      this.el.innerHTML = '<p>sidebar</p>'
      return this;
    }
  });

  Views.FooterView = Backbone.View.extend({
    render: function() {
      this.el.innerHTML = '<p>footer</p>'
      return this;
    }
  });

  return Views;
});
