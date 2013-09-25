define(['backbone'], function(Backbone) {
  var Sections = {};

  Sections.NavigationView = Backbone.View.extend({
    template: _.template('<a href="#home">Home</a><a href="#about">About</a><a href="#contact">Contact</a>'),

    tagName: 'nav',

    id: 'menu',

    initialize: function() {},

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  Sections.DynamicNavigationView = Backbone.View.extend({
    template: _.template('<% _.each(items, function(item) { %><a href="#<%= item.path %>"><%= item.path %></a><% }); %>'),

    tagName: 'nav',

    id: 'menu',

    initialize: function(options) {
      this.views = options.views;
    },

    render: function() {
      var items = this.getMenuItems(),
          output = this.template({
            items: items
          });

      this.$el.html(output);
      return this;
    },

    getMenuItems: function() {
      var i, len, view, item, items = [];

      for (i = 0, len = this.views.length; i < len; i++) {
        item = this.views[i];
        items.push({
          path: item.path,
          name: item.name
        });
      }

      return items;
    }
  });

  Sections.ContentView = Backbone.View.extend({
    template: _.template('<h1>Hello World!</h1>'),

    tagName: 'div',

    id: 'contents',

    initialize: function() {},

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  Sections.SidebarView = Backbone.View.extend({
    template: _.template('<a href="http://www.google.com">Google</a><a href="http://www.backcountry.com">Backcountry</a><a href="http://www.whittakermountaineering.com/">Whittaker Mountaineering</a>'),

    tagName: 'aside',

    id: 'links',

    initialize: function() {},

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  Sections.FooterView = Backbone.View.extend({
    template: _.template('Copyright crap'),

    tagName: 'footer',

    id: 'closing',

    initialize: function() {},

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  return Sections;
});
