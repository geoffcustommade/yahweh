(function(w) {
  w.Foo = Backbone.Model.extend({
    defaults: {
    },

    initialize: function(attrs) {
    },

    isSomething: function() {
      return true;
    }
  });

  w.FooView = Yahweh.View.extend({
    path: 'foo',

    name: 'Foo',

    initialize: function(options) {
    },

    render: function() {
      this.el.innerHTML = '<p>render foo</p>';
      return this;
    }
  });

  w.BarView = Backbone.View.extend({
    path: 'bar',

    name: 'Bar',

    render: function() {
      this.el.innerHTML = '<p>render bar</p>'
      return this;
    }
  });

  w.BazView = Backbone.View.extend({
    path: 'baz',

    name: 'Baz',

    render: function() {
      this.el.innerHTML = '<p>render baz</p>'
      return this;
    }
  });

  w.NavigationView = Yahweh.View.extend({
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

  w.SidebarView = Backbone.View.extend({
    render: function() {
      this.el.innerHTML = '<p>sidebar</p>'
      return this;
    }
  });

  w.FooterView = Backbone.View.extend({
    render: function() {
      this.el.innerHTML = '<p>footer</p>'
      return this;
    }
  });
}(window));

