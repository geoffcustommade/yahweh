(function(win) {
  'use strict';

  var initialize = Backbone.View.prototype.initialize;
  var render = Backbone.View.prototype.render;

  _.extend(Backbone.View.prototype, {
    initialize: function(options) {
      if (this.implement) {
        new Implementer(this, this.implement).validate();
      }
    }
  });

  function Implementer(instance, properties) {
    this.instance = instance;
    this.properties = properties;
  }

  Implementer.prototype.validate = function() {
    var i, len, property;

    for (i = 0, len = this.properties.length; i < len; i++) {
      property = this.properties[i];
      if (!this.instance[property]) {
        this.throwError('NotImplemented', 'You need to implement the ' + property + ' property. See object usage.');
      }
    }
  };

  Implementer.prototype.throwError = function(name, message) {
    throw {
      name: name,
      message: message,
      toString: function() {
        return this.name + ": " + this.message
      }
    };
  };

  var Yahweh = {}, localConfig = {}, defaultConfig;

  function throwError(name, message) {
    throw {
      name: name,
      message: message,
      toString: function(){ return this.name + ": " + this.message }
    };
  }

  defaultConfig = {
    compile: function(name, data) {
      if (name) {
        data = data || {};
        return JST[name](data);
      } else {
        throwError('NoTemplateNameSpecified', 'Ok, don\'t be a douche, provide a template name you dummy.');
      }
    }
  };

  Yahweh.config = function(obj) {
    localConfig = _.extend({}, defaultConfig, obj);
  };

  Yahweh.Inject = function(obj) {
    function createObj(obj) {
      var result = {};

      if (typeof obj === 'function') {
        result = new obj();
      } else if (obj.name && typeof (obj.name) === 'function') {
        result = new obj.name(obj.args || {});
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

  Yahweh.ViewsManager = Backbone.View.extend({
    initialize: function(options) {
      this.options = options;
      this.views = this.createViews(options.views || []);
    },

    createViews: function(views) {
      var i, len, view, instance, instances = [];

      for (i = 0, len = views.length; i < len; i++) {
        view = views[i];
        view.args = this.determineArgs(view);
        instance = Yahweh.Inject(view);
        instances.push(instance);
      }

      return instances;
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

  Yahweh.View = Backbone.View.extend({
    renderTemplate: function(name, data) {
      this.el.innerHTML = localConfig.compile(name, data);
      return this;
    }
  });

  win.Yahweh = Yahweh;
}(window));

