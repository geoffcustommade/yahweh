(function(Yahweh) {
  Yahweh.PageBuilder = Yahweh.Builder.extend({
    preInit: function(options) {
      this.views = options.views || {};
      this.viewsObj = this.createViewsObj();
    },

    postInit: function(options) {
      this.on('path-change', this.renderSection, this);
    },

    addToInstantiation: function(obj) {
      obj.views = this.views;
      return obj;
    },

    createViewsObj: function() {
      var i, len, instance, instanceObj = {};

      for (i = 0, len = this.views.length; i < len; i++) {
        instance = this.views[i];
        instanceObj[instance.path] = instance;
      }

      return instanceObj;
    },

    renderSection: function(path) {
      var view;

      if (!path) {
        view = this.views[0];
        path = this.views[0].path;
      } else {
        view = this.viewsObj[path];
      }

      view.el.innerHTML = view.render().el.innerHTML;
    }
  });

  Yahweh.PageRouter = Backbone.Router.extend({
    initialize: function(options) {
      this.view = options.view;
    },

    routes: {
      '': 'listenForPath',
      ':path': 'listenForPath'
    },

    listenForPath: function(path) {
      this.view.trigger('path-change', path);
    }
  });

  Yahweh.PageManager = function(args) {
    var view = new Yahweh.PageBuilder(args).render(),
        router = new Yahweh.PageRouter({ view: view });

    Backbone.history.start();

    return {
      view: view,
      router: router
    };
  };
}(window.Yahweh || {}));

