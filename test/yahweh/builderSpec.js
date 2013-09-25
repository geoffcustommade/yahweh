define(['yahweh', 'test/mocks/sections', 'test/helpers', 'jasmine-jquery'], function(Yahweh, Sections, Helpers) {
  describe('Yahweh Builder', function() {
    function createBuilder() {
      return new Yahweh.Builder({
        el: '#wrap',
        sections: {
          navigation: {
            name: Sections.NavigationView
          },
          content: {
            name: Sections.ContentView
          },
          sidebar: {
            name: Sections.SidebarView
          },
          footer: {
            name: Sections.FooterView
          }
        }
      });
    }

    beforeEach(function() {
      Helpers.setFixture('test/fixtures/layout.html');
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
