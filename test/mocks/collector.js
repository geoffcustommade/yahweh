define(['yahweh', 'test/mocks/sample-view', 'test/helpers'], function(Yahweh, SampleView, Helpers) {
  beforeEach(function() {
    Helpers.setFixture('test/fixtures/foo.html');
  });

  function view(args) {
    return new SampleView(args || {});
  }

  function mockCollector(args) {
    args = args || {};

    var defaultArgs = {
      el: '#foo',
      subView: view,
      collection: new Backbone.Collection([
        { content: 'Fugazi' },
        { content: 'Jawbox' },
        { content: 'Rites of Spring' },
        { content: 'Shiner' },
        { content: 'Embrace' },
        { content: 'Dag Nasty' },
        { content: 'Bad Brains' }
      ])
    };

    _.defaults(args, defaultArgs);
    return Yahweh.collector(args);
  }

  return mockCollector;
});