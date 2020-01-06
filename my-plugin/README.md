Mobile Fox UX development
========================= 

As this project grew I started using gulp to merge some files together.

Install and check
-----------------

So to build the project you will need [Node.js](https://nodejs.org/en/). Version 8.2 should be fine, but I recommend Node 8.9 or above. 

Check your version:
```
node --version
```

Now that you have node install dependencies:
```
cd my-plugin
npm install
```

You should also install [gulp](https://gulpjs.com/) and [less](http://lesscss.org/) globally like so:
```
npm install -g gulp
npm install -g less
```

To check if it all works, run gulp build:
```
cd my-plugin
gulp
```

Tips and directory structure
----------------------------

**Sources**. As you probably noticed I use `my-plugin` folder as a source folder. This is where most of the development happens.

**Editor**. You can open the folder with [Visual Studio Code](https://code.visualstudio.com/) and you should get ESLint integration and other goodies.

**Meta data**. In the folder you will find `package.json` which contains important meta data (including name, author, version and description of the plugin). This is mostly a standard npm file with an extra "monkeyscript" property specific for user-scripts.

**Dependencies**. Dependencies are defined in `package.json`. Note that although I have locked all versions in `devDependencies`, you should be able to safely update them to later versions (if you need to). 

**Gulp tasks** are defined in `gulpfile.js`. This is were paths for JS and CSS files are defined. You can run main build task separately if you didn't change LESS files (`gulp build`). Otherwise you should probably run default task (`gulp`) which is defined as a series of tasks that merges and builds everything.

Known problems
--------------

### Installation problems ###
You might get "EPERM: operation not permitted" on Windows. This seem to be a problem with `fsevents` module. If the problem occurs you can try installing dependencies like this:
```
cd my-plugin
npm install --no-optional
```
