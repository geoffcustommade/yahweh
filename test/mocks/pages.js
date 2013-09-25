define(['backbone'], function(Backbone) {
  var Pages = {};

  Pages.Home = Backbone.View.extend({
    path: 'home',

    name: 'Home',

    template: _.template('<h1>Home</h1><p>I am a homepage</p>'),

    initialize: function() {},

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  Pages.About = Backbone.View.extend({
    path: 'about',

    name: 'About',

    template: _.template('<h1>About</h1><p>I am an about page.</p>'),

    initialize: function() {},

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  Pages.Contact = Backbone.View.extend({
    path: 'contact',

    name: 'Contact',

    template: _.template('<h1>Contact</h1><p>I am a contage page.</p>'),

    initialize: function() {},

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  return Pages;
});