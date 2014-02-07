define(['backbone', 'underscore'], function(Backbone, _) {
  var SampleView = Backbone.View.extend({
    template: _.template('<section class="whatever-dood"><%= content %></section>'),

    render: function() {
      var data = this.model.toJSON(),
          output = this.template(data);

      this.$el.html(output);
      return this;
    }
  });

  return SampleView;
});
