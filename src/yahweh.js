(function(win) {
  'use strict';

  var Yahweh = {}, OriginalView = Backbone.View,
      localConfig = {}, defaultConfig;

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

  function throwError(name, message) {
    throw {
      name: name,
      message: message,
      toString: function() { return this.name + ": " + this.message; }    };
  }

  function throwNotImplemented(name) {
    throwError('NotImplementedError', 'You must implement ' + name + ' in order to continue you idiot.');
  }

  Yahweh.Config = function(obj) {
    localConfig = _.extend({}, defaultConfig, obj);
  };

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
        if (model instanceof Backbone.Model) {
          return model;
        } else {
          return createObj(model);
        }
      },

      collection: function(collection) {
        if (collection instanceof Backbone.Collection) {
          return collection;
        } else {
          return createObj(collection);
        }
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
      this.views = [];
      this.length = 0;
      this.on('bundler:add', this.addToBundler,  this);
      this.appendViews(options.views);
    },

    appendViews: function(views) {
      for (var i = 0, len = views.length; i < len; i++) {
        this.createView(views[i]);
      }
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
      this.views.push(instance);
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
        instances[name] = this.createInstance(name, obj);
      }, this);

      return instances;
    },

    createInstance: function(name, obj) {
      obj.args = obj.args || {};
      this.setupDefaultArgs(name, obj.args);
      obj.args = this.addToInstantiation(obj.args);
      return new Yahweh.Inject(obj);
    },

    setupDefaultArgs: function(name, args) {
      args.parentEl = this.el;
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

  function Implementer(context, implement) {
    this.context = context;
    this.implement = implement;
  }

  Implementer.prototype.implementMethods= function() {
    this.checkImplementation('properties', this.checkProperty);
    return this;
  };

  Implementer.prototype.implementProperties = function() {
    this.checkImplementation('methods', this.checkMethod);
    return this;
  };

  Implementer.prototype.checkImplementation = function(name, fn) {
    var implementations = this.context.implement[name];

    if (implementations) {
      for (var i = 0, len = implementations.length; i < len; i++) {
        fn.call(this, implementations[i]);
      }
    }
  };

  Implementer.prototype.checkProperty = function(property) {
    if (!this.context[property]) {
      throwNotImplemented(property);
    }
  };

  Implementer.prototype.checkMethod = function(method) {
    if (!this.context[property]) {
      this.context[method] = function() {
        throwNotImplemented(method);
      };
    }
  };

  Yahweh.Implementer = Implementer;

  Yahweh.Foundation = Backbone.View.extend({
    initialize: function(options) {
      this.data = {};
    },

    add: function(name, value) {
      if (name) {
        this.data[name] = value;
      }

      return this;
    },

    template: function() {
      throwNotImplemented('template');
    },

    cached: {},

    requestData: {},

    context: function(response) {
      return response || {};
    },

    render: function() {
      var cache,
          obj = this.getRetrievableObj(),
          template = this.getTemplate();

      if ((cache = this.cached[template])) {
        this.dumpHTML(cache);
      } else {
        if (obj) {
          obj.fetch({
            data: this.requestData,
            success: _.bind(this.success, this)
          });
        } else {
          this.renderTemplate();
        }
      }

      return this;
    },

    getRetrievableObj: function() {
      var obj;

      if (this.collection) {
        obj = this.collection;
      } else if (this.model) {
        obj = this.model;
      }

      return obj;
    },

    getTemplate: function() {
      return this.resolveType('template');
    },

    success: function(collection, response, options) {
      this.renderTemplate(response);
    },

    renderTemplate: function(response) {
      var template = this.resolveType('template'),
          context = this.context(response),
          data = _.extend({}, context, this.data),
          output = localConfig.compile(template, data);

      this.cached[template] = output;
      this.dumpHTML(output);
    },

    dumpHTML: function(output) {
      this.$el.html(output);
    },

    resolveType: function(name) {
      var val, property = this[name], propertyType = typeof(property);

      if (property) {
        if (propertyType === 'function') {
          val = property.call(this);
        } else {
          val = property;
        }
      }

      return val;
    }
  });

  // Any basic setup or implementations happen here. Think of this area as the
  // bootstrap portion to anything Yahweh related.
  (function() {
    Backbone.View = OriginalView.extend({
      constructor: function() {
        OriginalView.apply(this, Array.prototype.slice.call(arguments));
        this.implementations();
      },

      implementations: function() {
        if (this.implement) {
          new Implementer(this, this.implement)
            .implementMethods()
            .implementProperties();
        }
      }
    });

    if (_.isEmpty(localConfig)) {
      localConfig = defaultConfig;
    }
  }());

  win.Yahweh = Yahweh;
}(window));
