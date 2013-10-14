define([
  'yahweh',
  'page-manager',
  'test/mocks/pages',
  'test/mocks/sections',
  'test/helpers',
  'jasmine-jquery'
], function(Yahweh, PageManager, Pages, Sections, Helpers) {
  describe('Page Builder', function() {
    function createBundler() {
      return new Yahweh.Bundler({
        el: '#content',

        views: [
          {
            name: Pages.Home
          },
          {
            name: Pages.About
          },
          {
            name: Pages.Contact
          }
        ]
      });
    }

    function createPageManager(args) {
      var defaults = {
        el: '#wrap',

        bundler: createBundler(),

        sections: {
          navigation: {
            name: Sections.DynamicNavigationView
          },
          sidebar: {
            name: Sections.SidebarView
          },
          footer: {
            name: Sections.FooterView
          }
        }
      };

      args = _.extend({}, defaults, args || {});
      return PageManager(args);
    }

    beforeEach(function() {
      Helpers.setFixture('test/fixtures/layout.html');

      this.pageManager = createPageManager({
        start: true
      });
    });

    afterEach(function() {
      Backbone.history.stop();
    });

    it('should exist as pageManager', function() {
      expect(this.pageManager).toBeDefined();
    });

    it('should return both a view and router properties', function() {
      expect(this.pageManager.view).toBeDefined();
      expect(this.pageManager.router).toBeDefined();
    });

    it('should have a views and bundler property on the root level view property', function() {
      var view = this.pageManager.view;
      expect(view.views).toBeDefined();
      expect(view.bundler).toBeDefined();
    });

    it('should default to the home view when the page initially loads', function() {
      expect($('#content')).toContainHtml('<h1>Home</h1><p>I am a homepage</p>');
    });

    it('should navigate to #about from default location', function() {
      expect(location.hash).toEqual('');

      this.pageManager.router.navigate('about', {trigger: true});
      expect($('#content')).toContainHtml('<h1>About</h1><p>I am an about page.</p>');
      expect(location.hash).toEqual('#about');
    });

    it('should call navigate to #about', function() {
      this.pageManager.router.navigate('about', {trigger: true});
      expect($('#content')).toContainHtml('<h1>About</h1><p>I am an about page.</p>');
    });

    it('should call navigate to #contact from #about', function() {
      this.pageManager.router.navigate('about', {trigger: true});
      expect($('#content')).toContainHtml('<h1>About</h1><p>I am an about page.</p>');
      expect(location.hash).toEqual('#about');

      this.pageManager.router.navigate('contact', {trigger: true});
      expect($('#content')).toContainHtml('<h1>Contact</h1><p>I am a contage page.</p>');
    });

    describe('Router', function() {
      afterEach(function() {
        Backbone.history.stop();
      });

      it('should start the Backbone router', function() {
        Backbone.history.stop();

        createPageManager({
          start: true
        });

        expect(Backbone.History.started).toBeTruthy();
      });

      it('should not start the Backbone router when no start is passed in', function() {
        Backbone.history.stop();
        createPageManager();
        expect(Backbone.History.started).toBeFalsy();
      });
    });
  });
});
