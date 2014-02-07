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
      },

      subView: function(obj) {
        return createObj(obj);
      },

      subViews: function(dict) {
        var views = {};
        _.each(dict, function(obj, name) {
          views[name] = createObj(obj);
        });

        return views;
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
      this.currentView = {};
      this.parentEl = this.el;
      this.on('bundler:add', this.addToBundler,  this);
      this.appendViews(options.views);
    },

    render: function(view) {
      this.setCurrentView(view);
      this.parentEl.appendChild(this.renderCurrentView().el);
      this.currentView.trigger('yahweh:foundation:post-render');
      return this;
    },

    renderCurrentView: function() {
      this.currentView.el = this.currentView.render().el;
      return this.currentView;
    },

    tearDownCurrentView: function() {
      if (!_.isEmpty(this.currentView)) {
        this.currentView.trigger('teardown');

        if (this.currentView.teardown) {
          this.currentView.teardown();
        }
      }
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

    setCurrentView: function(view) {
      if (view) {
        this.currentView = view;
      }

      return this;
    },

    createView: function(view) {
      var instance = Yahweh.Inject(view);
      instance.parentEl = this.parentEl;

      this.trigger('bundler:add', instance);
      this.views.push(instance);
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
      var el, view;

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
    load: {},

    data: {},

    cache: false,

    loaded: false,

    add: function(name, value) {
      if (name) {
        this.data[name] = value;
      }

      return this;
    },

    get: function(name) {
      if (typeof(this.data[name])) {
        return this.data[name];
      }
    },

    template: function() {
      throwNotImplemented('template');
    },

    cached: {},

    context: function(response) {
      return response || {};
    },

    render: function() {
      this.setDefaultData();
      this.handleRendering();
      return this;
    },

    handleRendering: function() {
      if (!_.isEmpty(this.load) && this.load.obj) {
        this.renderLoad();
      } else {
        this.renderTemplate();
      }

      return this;
    },

    getLoadKey: function() {
      return this.load && this.load.key;
    },

    getResponseKey: function() {
      var cache, key,
          template = this.getTemplate(), loadKey = this.getLoadKey();

      if (this.cache) {
        if (loadKey) {
          key = loadKey;
        } else if (template) {
          key = template;
        }

      }

      return key;
    },

    getCachedResponse: function() {
      if (this.cache) {
        var key = this.getResponseKey(), cache = this.getFromCache(key);
        return cache;
      }
    },

    renderLoad: function() {
      var cache;

      if ((cache = this.getCachedResponse())) {
        this.renderTemplate(cache);
      } else {
        this.retrieve();
      }
    },

    retrieve: function() {
      var obj = _.bind(this.load.obj, this);
      obj().fetch({
        data: this.load.data || {},
        success: _.bind(this.success, this)
      });
    },

    getTemplate: function() {
      return this.resolveType('template');
    },

    success: function(collection, response, options) {
      this.renderTemplate(response);
    },

    renderTemplate: function(response) {
      var template, context, data, output = '';

      context = this.context(response);
      data = _.extend({}, context, this.data);

      template = this.getTemplate();
      if (template) {
        output = localConfig.compile(template, data);
      }

      if (this.cache) {
        this.sendToCache(this.getResponseKey(), response);
      }

      this.checkLoaded();
      this.dumpHTML(output);
      this.trigger('post-render');
    },

    dumpHTML: function(output) {
      this.$el.html(output);
    },

    getFromCache: function(name) {
      return this.cached[name];
    },

    sendToCache: function(name, value) {
      this.cached[name] = value;
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
    },

    nestCollectionWithSubView: function(id, subView, args) {
      this.on('post-render', function() {
        var collector = Yahweh.collector({
          el: '#' + id,
          subView: subView,
          collection: this.collection,
          parent: this,
          args: args
        });

        this.on('teardown', function() {
          collector.trigger('teardown');
        });
      });
    },

    setDefaultData: function() {
      this.add('loaded', this.loaded);
    },

    checkLoaded: function() {
      this.on('post-render', function() {
        if (!this.loaded) {
          this.loaded = true;
        }
      });
    }
  });

  Yahweh.Collector = Backbone.View.extend({
    initialize: function(options) {
      this.subView = options.subView;
      this.parent = options.parent;
      this.args = options.args;
    },

    render: function() {
      this.renderSubViews(function(fragment) {
        this.collection.each(function(model, i) {
          this.appendSubView(fragment, model, i);
        }, this);

        return fragment;
      });

      return this;
    },

    renderRange: function(to, from) {
      this.renderSubViews(function(fragment) {
        var model;

        while (to < from) {
          model = this.collection.at(to);

          if (model) {
            this.appendSubView(fragment, model, to);
          }

          to++;
        }

      });

      return this;
    },

    appendSubView: function(fragment, model, i) {
      var view = this.createSubView(model, i);

      this.on('teardown', function() {
        view.trigger('teardown');
        view.remove();
      });

      fragment.appendChild(view.render().el);
    },

    renderSubViews: function(fn) {
      var fragment = document.createDocumentFragment(),
          children = fn.call(this, fragment);

      this.appendToEl(fragment);
    },

    appendToEl: function(fragment) {
      this.el.appendChild(fragment);
    },

    appendViewFragment: function(fragment, view) {
      fragment.appendChild(view.render().el);
    },

    createSubView: function(model, index) {
      var options = {
        model: model,
        index: index,
        parent: this.parent
      };

      return this.callSubView(_.extend(options, this.args));
    },

    callSubView: function(args) {
      var instance;

      if (this.subView.prototype) {
        instance = new this.subView(args);
      } else {
        instance = this.subView(args);
      }

      return instance;
    }
  });

  Yahweh.collector = function(options) {
    var collector, defaultOptions = {
      render: true
    };

    _.defaults(options, defaultOptions);
    collector = new Yahweh.Collector(options);

    if (options.render) {
      collector = collector.render();
    }

    return collector;
  };


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
