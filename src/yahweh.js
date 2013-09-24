(function(win) {
  'use strict';

  var Yahweh = {};

  function throwError(name, message) {
    throw {
      name: name,
      message: message,
      toString: function() { return this.name + ": " + this.message; }
    };
  }

  Yahweh.Inject = function(obj) {
    obj = obj || {};

    function createObj(ob) {
      var result = {};

      if (typeof ob === 'function') {
        result = new ob();
      } else if (ob.name && typeof (ob.name) === 'function') {
        result = new ob.name(ob.args || {});
      }

      return result;
    }

    var reserved = {
      model: function(model) {
        return createObj(model);
      },

      collection: function(collection) {
        return createObj(collection);
      }
    };

    if (obj.name) {
      obj.args = obj.args || {};

      _.each(obj.args, function(item, key) {
        if (key && reserved[key]) {
          obj.args[key] = reserved[key](item);
        }
      });

      return new obj.name(obj.args || {});
    } else {
      throwError('ObjectNotFound', 'Come on you idiot, pass in a qualified object.');
    }
  };

  Yahweh.Bundler = Backbone.View.extend({
    initialize: function(options) {
      this.length = 0;
      this.on('bundler:add', this.addToBundler,  this);
      this.views = this.createViews(options.views || []);
    },

    createViews: function(views) {
      var i, len, view, instance, instances = [];

      for (i = 0, len = views.length; i < len; i++) {
        view = this.createView(views[i]);
        instances.push(instance);
      }

      return instances;
    },

    addView: function(view) {
      this.createView(view);
      return this;
    },

    addToBundler: function(view) {
      this.length++;
    },

    createView: function(view) {
      var instance;
      view.args = this.determineArgs(view);
      instance = Yahweh.Inject(view);
      this.trigger('bundler:add', instance);
      return instance;
    },

    determineArgs: function(view) {
      view.args = view.args || {};
      view.args.el = this.el || {};
      return view.args;
    }
  });

  Yahweh.Builder = Backbone.View.extend({
    initialize: function(options) {
      this.preInit(options);
      this.sections = this.createSections(options.sections || {});
      this.postInit(options);
    },

    createSections: function(sections) {
      var instances = {};

      _.each(sections, function(obj, name) {
        instances[name] = this.createInstance(obj);
      }, this);

      return instances;
    },

    createInstance: function(obj) {
      obj.args = obj.args || {};
      obj.args = this.addToInstantiation(obj.args);
      return new Yahweh.Inject(obj);
    },

    addToInstantiation: function(obj) {
      return obj;
    },

    render: function() {
      this.preRender();

      _.each(this.sections, function(section, id) {
        this.appendSection(id, section);
      }, this);

      this.postRender();
      return this;
    },

    appendSection: function(id, section) {
      var el;

      if ((el = document.getElementById(id))) {
        el.appendChild(section.render().el);
      } else {
        throwError('NodeNotFound', 'Hey dummy! If you\'re going to define an id, use it, ok?');
      }
    },

    preInit: function(options) {},

    postInit: function(options) {},

    preRender: function() {},

    postRender: function() {}
  });

  win.Yahweh = Yahweh;
}(window));

