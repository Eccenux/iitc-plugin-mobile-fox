# IITC plugin: Mobile Fox UX

Plugin focused on making IITC better for mobile phones. This is for users of <a href="https://play.google.com/store/apps/details?id=org.mozilla.firefox" target="_blank">Firefox mobile</a> which is a browser I highly recommend anyway for Android.

Jump to: <a href="#Installation">Installation</a>.

*(pl)* Skocz do: <a href="#InstalacjaPL">InstalacjaPL</a>. 

Features overview
-----------------

* Easy closing info panel (easy to reach close button).
* Left side toolbar overflow handling (two or even 3 columns as shown on images below).
* Better layer chooser:
    * Better overflow handling (scrolls when needed).
    * More natural switch between two and single column layout (as shown on images below).
    * More spacing to easily choose tiles and layers on touch screens.
* Drawer with log (chat) links. This is similar to what ITTC had but easier to reach with one hand. 
* Bookmarks plugin support (opened from drawer if the plugin is detected).
* Missions plugin (partially rewritten).
	* Opened from drawer and loads missions immediately.
	* Missions pane is fixed to flow nicely.
	* Mission dialog should fit on your mobile screen.
	* Zoom to mission button automatically collapses the mission to show the map.

### Drawer ###

Opened drawer

<img src="https://raw.githubusercontent.com/Eccenux/iitc-plugin-mobile-fox/master/screen-drawer.png" width="500" alt=" ">

Bookmarks

<img src="https://raw.githubusercontent.com/Eccenux/iitc-plugin-mobile-fox/master/screen-bookmarks.png" width="500" alt=" ">

### Missions ###

Missions pane with opened drawer

<img src="https://raw.githubusercontent.com/Eccenux/iitc-plugin-mobile-fox/master/screen-missions.png" width="500" alt=" ">

Mission dialog

<img src="https://raw.githubusercontent.com/Eccenux/iitc-plugin-mobile-fox/master/screen-mission.png" width="500" alt=" ">

Zoom to mission
 
<img src="https://raw.githubusercontent.com/Eccenux/iitc-plugin-mobile-fox/master/screen-mission-zoom.png" width="500" alt=" ">

### Overflow handling ###

Vertical view

<img src="https://raw.githubusercontent.com/Eccenux/iitc-plugin-mobile-fox/master/screen.png" width="500" alt=" ">

Horizontal view

<img src="https://raw.githubusercontent.com/Eccenux/iitc-plugin-mobile-fox/master/screen-wide.png" alt=" ">

Installation
------------

This is a RC version (pre-release). Should work fine but YMMV.

Assuming you already have IITC just &rarr; **[install the script](https://github.com/Eccenux/iitc-plugin-mobile-fox/raw/master/mobile-fox.user.js)**.

The plugin can be installed as any other IITC plugin. But to make sure you have everything let's follow this steps:

1. Install [Firefox for Android](https://play.google.com/store/apps/details?id=org.mozilla.firefox) (if don't have it yet).
2. On your phone install [TamperMonkey for Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/) (if don't have it yet).
3. On your phone install [IITC](https://iitc.me/desktop/).
4. Once you have IITC just &rarr; **[install the script](https://github.com/Eccenux/iitc-plugin-mobile-fox/raw/master/mobile-fox.user.js)**.

BTW you might wan to install some other Firefox addons like [uBlock Origin](https://addons.mozilla.org/pl/firefox/addon/ublock-origin/) for example. It's an ad/script blocker which makes website more usable and load much faster :-).

### Other browsers ###

Most of this tweaks probably won't make sense for the old IITC Mobile app. But if you know another mobile browser that supports Tampermonkey or similar then all of those tweaks should work fine too. So in other words this plugin aims to fix some generic problems with Ingress Intel in mobile browsers and is not really specific to Firefox.


### Other plugins ###

Note I also have a different plugin which is focused on making FF mobile desktop view a bit more readable [enlarge-tools](https://github.com/Eccenux/iitc-plugin-enlarge-tools).

See also: [my other IITC plugins](https://github.com/search?q=user%3AEccenux+iitc-plugin&type=Repositories). You might want to install my draw-tools fork which is better suited for touch screens.

InstalacjaPL
------------

Plugin instaluje się jak każdy inny w Tampermonkey. Ale żeby mieć pewność, że masz wszystko...

1. Zainstaluj [Firefox dla Android](https://play.google.com/store/apps/details?id=org.mozilla.firefox&hl=pl) (jeśli jeszcze nie masz).
2. Zainstaluj na telefonie [TamperMonkey dla Firefox](https://addons.mozilla.org/pl/firefox/addon/tampermonkey/) (jeśli jeszcze nie masz).
3. Zainstaluj na telefonie [IITC](https://iitc.me/desktop/).
4. Jak już masz IITC &rarr; **[zainstaluj skrypt](https://github.com/Eccenux/iitc-plugin-mobile-fox/raw/master/mobile-fox.user.js)**.

Przy okazji polecam inne rozszerzenia do Firefoksa. Np. [uBlock Origin](https://addons.mozilla.org/pl/firefox/addon/ublock-origin/), który znacząco przyśpiesza strony :-).

A wracając do Ingressa polecam: [moje inne pluginy IITC](https://github.com/search?q=user%3AEccenux+iitc-plugin&type=Repositories). W szczególności draw-tools w wersji mobilnej mogą się przydać :-).
