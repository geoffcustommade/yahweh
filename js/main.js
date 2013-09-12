(function(w) {
  w.FooView = Backbone.View.extend({
    path: 'foo',

    name: 'Foo',

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

  w.NavigationView = Backbone.View.extend({
    template: JST['navigation'],

    initialize: function(options) {
      this.views = options.views;
    },

    render: function() {
      this.el.innerHTML = this.template({
        items: this.getTemplateData()
      });

      return this;
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

