# HTML Import

[![NPM](https://nodei.co/npm/html-import.png)](https://nodei.co/npm/html-import/)

Sometimes when working on a big HTML we need to split it in blocks.
For example I have a file structure where every folder represents a component keeping its HTML and assets. In the landing page of style guide I would like to include all the components. Well, in CSS we can import a module with `@import`, in JavaScript we can use `import`. In the past we applied Apache Server-Side Includes for importing HTML blocks. Now we can think of [HTML Imports](https://www.html5rocks.com/en/tutorials/webcomponents/imports/), but they are not yet really supported
even in ever-green browsers. Anyway, it inspired me on writing a little library that implements a similar approach.

As soon as you load it on the page
```
<script async src="./src/html-import.js"></script>
```

If you intend to use the library with legacy browsers examine `legacy.html` that contains all the required polifills.

The library subscribes for DOM-ready event and processes the DOM the directives like that:

#### index.html
```
<link rel="html-import" href="./some-path/block.html" >
```

When any encountered it loads the HTML file specified in `href` attribute and **replaces the directive with the loaded HTML**.
If it finds any imports in the loaded HTML it processes it recursively

#### ./some-path/block.html
```
<link rel="html-import" href="./some-other-path/other-block.html" >
```

If you want to import a block more than once, you can declare it with `repeat` attribute:

```
<link rel="html-import" href="./some-path/block.html" repeat="5">
```

## Running the demo

```
npm install
npm start
```

## API

The library bundled as UMD meaning you access it as AMD (RequireJS) modules, as CommonJS module or in global variable `HTMLImport.

### "html-imports-loaded" DOM event
It is fired when HTML Import finishes DOM processing (one started by its own on DOM ready event)
```
  <script>
    document.addEventListener( "html-imports-loaded", ( e ) => {
      e.detail.urls.forEach( url => console.log( `Loaded ${url}` ) );
    });
  </script>
```

### HTMLImport.import()
Can be used to start manually processing the DOM
```
@returns {Promise}
```


### HTMLImport.importForElements( arr )
Processes the elements of given array
```
@param {Node[]} imports
@returns {Promise}
```


### HTMLImport.loadJs( scriptPath )
Loads JavaScript
```
@param {string} scriptPath
@returns {Promise}
```
Example:
```
 <script>
    document.addEventListener( "html-imports-loaded", ( e ) => {
      e.detail.urls.forEach( url => console.log( `Loaded ${url}` ) );
      HTMLImport.loadJs( "/assets/js/backbone/backbone.min.js" )
        .then(() => console.log( "Loaded /assets/js/backbone/backbone.min.js" ) )
        .then(() => HTMLImport.loadJs( "/assets/js/app.js" ) )
        .then(() => console.log( "Loaded /assets/js/app.js" ) );
    });
  </script>
```
