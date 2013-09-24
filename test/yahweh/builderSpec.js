define(['yahweh', 'jasmine-jquery'], function(Yahweh) {
  function setupFixture(path) {
    var fixture, fixtures = window.__html__ || {};

    if ((fixture = fixtures[path])) {
      setFixtures(fixture);
    } else {
      throw {
        name: 'FixtureNotFound',
        message: 'No fixture was found for path ' + path,
        toString: function() {
          return this.name + ':' + this.message;
        }
      };
    }
  }

  describe('Yahweh Builder', function() {
    var NavigatgionView = Backbone.View.extend({
      template: _.template('<a href="#home">Home</a><a href="#about">About</a><a href="#contact">Contact</a>'),

      tagName: 'nav',

      id: 'menu',

      render: function() {
        this.$el.html(this.template());
        return this;
      }
    });

    var ContentView = Backbone.View.extend({
      template: _.template('<h1>Hello World!</h1>'),

      tagName: 'div',

      id: 'contents',

      render: function() {
        this.$el.html(this.template());
        return this;
      }
    });

    var SidebarView = Backbone.View.extend({
      template: _.template('<a href="http://www.google.com">Google</a><a href="http://www.backcountry.com">Backcountry</a><a href="http://www.whittakermountaineering.com/">Whittaker Mountaineering</a>'),

      tagName: 'aside',

      id: 'links',

      render: function() {
        this.$el.html(this.template());
        return this;
      }
    });

    var FooterView = Backbone.View.extend({
      template: _.template('Copyright crap'),

      tagName: 'footer',

      id: 'closing',

      render: function() {
        this.$el.html(this.template());
        return this;
      }
    });


    function createBuilder() {
      return new Yahweh.Builder({
        el: '#wrap',
        sections: {
          navigation: {
            name: NavigatgionView
          },
          content: {
            name: ContentView
          },
          sidebar: {
            name: SidebarView
          },
          footer: {
            name: FooterView
          },
        }
      });
    }

    beforeEach(function() {
      setupFixture('test/fixtures/yahweh/builder.html');
      this.builder = createBuilder().render();
    });

    it('should have a Builder property on a Yahweh object', function() {
      expect(Yahweh.Builder).toBeDefined();
    });

    it('should be able to create a Yahweh.Builder object', function() {
      expect(this.builder).toEqual(jasmine.any(Yahweh.Builder));
    });

    it('should be able to render a builder object', function() {
      expect(this.builder.$('#navigation')).toContain('nav#menu');
      expect(this.builder.$('#content')).toContain('div#contents');
      expect(this.builder.$('#sidebar')).toContain('aside#links');
      expect(this.builder.$('#footer')).toContain('footer#closing');
    });

    it('should check for contents of rendered sections', function() {
      expect(this.builder.$('nav#menu a').length).toEqual(3);
      expect(this.builder.$('div#contents')).toContainHtml('<h1>Hello World!</h1>');
      expect(this.builder.$('aside#links a').length).toEqual(3);
      expect(this.builder.$('footer#closing')).toHaveText('Copyright crap');
    });
  });
});
