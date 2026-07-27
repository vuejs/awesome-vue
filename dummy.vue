<!DOCTYPE html>
<html>
  <head>
    <title>Hello World in Vue</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  </head>
  <body>
    <div id="app">
      <p>{{ message }}</p>
    </div>
    <script>
      new Vue({
        el: '#app',
        data: {
          message: 'Hello World!'
        }
      });
    </script>
  </body>
</html>
