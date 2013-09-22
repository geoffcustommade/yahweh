*Yahweh

This library acts as a way of extending Backbone in a few ways. In particular:

- Lazy instantiation of a backbone related object (View, Model, Collection,
Router)
- Create a view collector by the name of Bundler. - Create a simple Layout
Manager, by the name Builder, that can tie into Bundler.
- Currently (but won't always), provides a way to combine all of these through
an object by the name of PageManager. At a later point, it won't be included,
but for now it works.

*Installing

Install node and then globally install the following node modules:

    npm install -g karma bower

Once you have karma and bower, install the necessary node modules and bower
components by doing the following:

    npm install; bower install

*Development

To develop on top of Yaweh, run the following from the command line:

    karma start

This will run all the tests as you're developing on top of Yahweh. While
developing on top of Yahweh, tests should be created that support any new
features. Think of it writing tests as a way of developing features, verses
using existing code to develop against. If a new feature is needed, awesome.
Then write a test that supports the feature and use it for your benefit.

*Future Development

Currently, Yahweh comes bundled with the following:

- Yahweh.Inject
- Yahweh.Bundler
- Yahweh.Builder
- PageManager

The only thing that is really required is `Yahweh.Inject`, the other two are not
dependent on one another. PageManager has no business at all in this, but maybe
this will change when I stop being lazy. Technically, this should be outside of
the project but it is included for example purposes.

Ideally, there should be the ability to build each of these through a dependency
management system that doesn't lock anyone into a specific system, i.e. AMD. For
the purposes of development, Yahweh uses require, but it shouldn't forced upon
how people use this.