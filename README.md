<p align="center">
  <br>
  <img width="400" src="https://rawgit.com/vuejs/awesome-vue/master/logo.png" alt="awesome">
  <br>
  <br>
</p>

## Awesome Vue.js

> A curated list of awesome things related to Vue.js

- [Official Resources](#official-resources)
- [External Resources](#external-resources)
- [Community](#community)
- [Official Examples](#official-examples)
- [Tutorials](#tutorials)
- [Tools](#tools)
- [Libraries & Plugins](#libraries--plugins)
  - [Routing](#routing)
  - [Ajax/Data](#ajaxdata)
  - [Validation](#validation)
  - [UI Components](#ui-components)
  - [i18n](#i18n)
  - [Examples](#examples)
  - [Boilerplates](#boilerplates)
  - [Scaffolding](#scaffolding)
  - [Integrations](#integrations)
  - [General Plugins/Directives](#general-pluginsdirectives)
- [Projects Using Vue.js](#projects-using-vuejs)
  - [Open Source](#open-source)
  - [Apps/Websites](#appswebsites)
  - [Interactive Experiences](#interactive-experiences)
  - [Enterprise Usage](#enterprise-usage)

### Official Resources

- [Official Guide](http://vuejs.org/guide/)
- [API Reference](http://vuejs.org/api/)
- [GitHub Repo](https://github.com/vuejs/vue)
- [Release Notes](https://github.com/vuejs/vue/releases)

### External Resources

- [Vue.js資料まとめ(for japanese)](https://gist.github.com/hashrock/f575928d0e109ace9ad0) by @hashrock

### Community

- [Twitter](https://twitter.com/vuejs)
- [Gitter Chat Room](https://gitter.im/vuejs/vue)
- [Official Forum](http://forum.vuejs.org/)

### Official Examples

- [Basic Examples](http://vuejs.org/guide/)
- [Vue.js TodoMVC](https://github.com/vuejs/vue/tree/dev/examples/todomvc)
- [Vue.js HackerNews Clone](https://github.com/vuejs/vue-hackernews)

### Tutorials

> Most of the following tutorials are for the 0.12 version. For now the best resource for 1.0 is the official guide. It would be **awesome*- if you write a new tutorial for 1.0!

- [Vue.js screencasts](https://laracasts.com/series/learning-vuejs) on Laracasts <sup>0.12</sup>
- [Build an App with Vue.js](https://scotch.io/tutorials/build-an-app-with-vue-js-a-lightweight-alternative-to-angularjs) on Scotch.io <sup>0.12</sup> 
- [Getting Started with Vue.js](http://www.sitepoint.com/getting-started-with-vue-js/) on Sitepoint <sup>0.12</sup> 
- [Vue.js Tutorial](http://vegibit.com/vue-js-tutorial/) on Vegibit <sup>0.12</sup>
- [Vue.js video series in portuguese](http://forum.vuejs.org/topic/49/vue-js-video-series-in-portuguese) <sup>0.12</sup>
- [A Quick Introduction to Vue.js](http://mattsparks.com/a-quick-introduction-to-vue-js/) by Matt Sparks <sup>0.12</sup>
- [Getting Started with Vue.js + vue-router](https://www.youtube.com/watch?v=QN7l3ydXvx0) by Michael Calkins <sup>0.12</sup>
- [Getting Started with Vue.js - AngularJS perspective](http://fadeit.dk/blog/post/getting-started-with-vuejs-angularjs-perspective) by Dan Mindru <sup>0.11</sup>

### Tools

- [vue-loader](https://github.com/vuejs/vue-loader) - Vue component loader for Webpack.
  - [vue-loader-example](https://github.com/vuejs/vue-loader-example)
- [vueify](https://github.com/vuejs/vueify) - Vue component transform for Browserify.
  - [vueify-example](https://github.com/vuejs/vueify-example)
- [vue-devtools](https://github.com/vuejs/vue-devtools) - Chrome devtools extension for debugging Vue applications.
- [Vue Syntax Highlighting for Sublime Text](https://github.com/vuejs/vue-syntax-highlight)
- [Vue Syntax Highlighting for Atom](https://atom.io/packages/language-vue-component) by @CYBAI

### Libraries & Plugins

- #### Routing

  - [vue-router](https://github.com/vuejs/vue-router) - Official router for building SPAs. <sup>1.0 compatible</sup>
  - [Vue view](https://github.com/molforp/vue-view), ui-router inspired routes (with states), based on pagejs by @molforp
  - [Vue page](https://github.com/AlexToudic/vue-page), a routing system based on pagejs by @AlexToudic
  - [Vue Lanes](https://github.com/bpierre/vue-lanes), an event-based routing system for Vue by @bpierre
  - [Vue route](https://github.com/ayamflow/vue-route), ng-view inspired routes for Vue by @ayamflow

- #### Ajax/Data
  
  - [vue-resource](https://github.com/vuejs/vue-resource) - AJAX/Resource plugin maintained by the [PageKit](http://pagekit.com/) team. <sup>1.0 compatible</sup>
  - [vue-async-data](https://github.com/vuejs/vue-async-data) - Async data loading plugin <sup>1.0 compatible</sup>

- #### Validation

  - [vue-validator](https://github.com/vuejs/vue-validator) - Form validation plugin maintained by @kazupon <sup>0.12</sup>
  - [Vue validator](https://github.com/xrado/vue-validator) by @xrado

- #### UI Components

  - [VueStrap](http://yuche.github.io/vue-strap/), Bootstrap components built with pure Vue.js by @yuche
  - [vue-mdl](https://github.com/posva/vue-mdl): Reusable Vue.js components using Material Design Lite. By [@posva](https://github.com/posva)
  - [Vue Tag Editor Component](https://github.com/hnakamur/vue.tag-editor.js) by @hnakamur
  - [Vue Crop](http://pespantelis.github.io/vue-crop/)
  - [Vue Typeahead](http://pespantelis.github.io/vue-typeahead/)
  - [Typed select component](https://github.com/dgerber/vue-select-js) by @dgerber
  - [vue-select](https://github.com/Haixing-Hu/vue-select): A Vue.js component implementing the select control with the [jQuery select2 plugin](https://github.com/select2/select2).  By @Haixing-Hu
  - [vue-html-editor](https://github.com/Haixing-Hu/vue-html-editor): A Vue.js component implementing the HTML editor with the [jQuery summernote plugin](https://github.com/summernote/summernote). By @Haixing-Hu
  - [vue-datetime-picker](https://github.com/Haixing-Hu/vue-datetime-picker): A Vue.js component implementing the datetime picker control using the [Eonasdan's bootstrap datetime picker plugin](https://github.com/Eonasdan/bootstrap-datetimepicker). By @Haixing-Hu
  - [vue-country-select](https://github.com/Haixing-Hu/vue-country-select): A Vue.js component implementing the select control used to select countries. It depends on [vue-select](https://github.com/Haixing-Hu/vue-select) and [vue-i18n](https://github.com/Haixing-Hu/vue-i18n). By @Haixing-Hu
  - [Form generation from JSON Schema](https://github.com/dgerber/vue-select-js) by @dgerber

- #### i18n

  - [vue-i18n](https://github.com/kazupon/vue-i18n): Internationalization plugin.
  - [vue-i18n](https://github.com/Haixing-Hu/vue-i18n): A plugin providing a global interface used to localize internationalized messages used in the 

- #### Examples
  
  - [Starter Application with JWT Auth + sample backend API in Laravel](http://forum.vuejs.org/topic/39/starter-application-with-jwt-auth-sample-backend-api)
  - [Node Webkit + Vue example](https://github.com/brandonjpierce/node-webkit-boilerplate) by @brandonjpierce
  - [Vue Samples](https://github.com/superlloyd/VueSamples) by @superlloyd
  - [HackerNews clone with vue.js + vue-router](https://github.com/kazupon/vue-router-hackernews) by @kazupon

- #### Boilerplates
  - [Boilerplate for Vue.js plugin ](https://github.com/kazupon/vue-plugin-boilerplate) by @kazupon

- #### Scaffolding

  - [Vue generator](https://github.com/BirdEggegg/generator-vue), a simple yeoman generator for Vue by @BirdEggegg
  - [VENM stack yeoman generator](https://github.com/jfelsinger/generator-venm) by @jfelsinger

- #### Integrations

  - [Vue for Meteor](https://github.com/zhouzhuojie/meteor-vue) by @zhouzhuojie
  - [ScalaJS bindings for Vue.js](https://github.com/fancellu/scalajs-vue) by @fancellu

- #### General Plugins/Directives

  - [vue-element](https://github.com/vuejs/vue-element): Register real custom elements with Vue.
  - [vue-touch](https://github.com/vuejs/vue-touch): Hammer.js wrapper directives for touch gestures. <sup>outdated</sup>
  - [Vue placeholder directives](https://github.com/lithiumjake/vue-placeholders) by @lithiumjake
  - [Vue in viewport detection directive](https://github.com/holic/vue-viewport) by @holic
  - [Vue once directive](https://github.com/kewah/vue-once) by @kewah
  - [Vue Modified Directive](https://github.com/KyleRoss/vue-modified) by @KyleRoss
  - [Maintain scroll position on page changes](https://github.com/mark-hahn/vue-keep-scroll) by @mark-hahn
  - [vue-titlecase](https://github.com/Haixing-Hu/vue-titlecase): A plugin providing a global filter and an instance method used to titlecase (different from capitalize) strings. By @Haixing-Hu
  - [vue-format](https://github.com/Haixing-Hu/vue-format): A plugin providing a global filter and an instance method used to format messages with arguments.  By @Haixing-Hu
  application.  By @Haixing-Hu

### Projects Using Vue.js

- #### Open Source

  - [PageKit](http://pagekit.com/) <sup>[[Source]](https://github.com/pagekit/pagekit)</sup>
  - [Laravel Spark](https://github.com/laravel/spark)
  - [p5.js editor](http://p5js.org/download/) <sup>[[Source]](https://github.com/processing/p5.js-editor)</sup>
  - [Python China](https://python-china.org) <sup>[[Source]](https://github.com/zerqu/qingcheng)</sup>
  - [npmcharts.com](http://npmcharts.com) <sup>[[Source]](http://npmcharts.com/)</sup>
  - [Todolist](https://github.com/jiyinyiyong/todolist) by @jiyinyiyong
  - [Dashboard framework](https://github.com/thelinuxlich/vue-dashing-js) by @thelinuxlich

- #### Apps/Websites

  - [Laracasts](https://laracasts.com)
  - [CUUSOO](https://cuusoo.com)
  - [esa.io](https://esa.io/)
  - [N1.ru](http://n1.ru)
  - [稀土掘金](http://gold.xitu.io)
  - [Prague Airport](http://www.prague-airport.com/)
  - [Expressionery](https://www.expressionery.com)
  - [BUYIT](http://bt.workswell.com.au) by @[Workswell Australia](http://workswell.com.au)
  - [Portfolio Site](http://corentinbac.com/) by Corentin Bac
  - [Compare Prices by Currys & PCWorld](https://play.google.com/store/apps/details?id=uk.co.dixons.compareprices&hl=en)

- #### Interactive Experiences
  
  - [Blood, Sweat and Tools](http://bloodsweatandtools.discovery.ca/gamebench/) - by Jam3, led by @cheapsteak
  - [Omnisense Experience](http://omnisense.net) - *Awwwards & FWA SOTD, FWA Cutting Edge. Awwwards SOTM nominee.*
  - [Being the Bear](https://danslapeaudelours.canalplus.fr/en/) - *Awwwards & FWA SOTD, FWA Cutting Edge, Awwwards SOTM nominee.*
  - [Heineken Star Experience](http://www.starexperience.fr/) - *FWA SOTD.*
  - [Louis Ansa Website (portfolio)](http://louisansa.com) - *Awwwards SOTD, FWA nominee.*
  - [Digital For All](http://www.digitalforallnow.com/en/experience)
  - [Djeco.com](http://www.djeco.com/en)

- #### Enterprise Usage

  - Alibaba
  - Baidu
  - Ele.me
  - Optimizely
  - Expedia
  - UCWeb
  - Line
  - Nintendo
