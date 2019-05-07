# IITC plugin: Mobile Fox UX

Plugin focused on making IITC better for mobile phones. This is for users of <a href="https://play.google.com/store/apps/details?id=org.mozilla.firefox" target="_blank">Firefox mobile</a> which is a browser I highly recommend anyway for Android.

Jump to: <a href="#Installation">Installation</a>.

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
	* Zoom to mission automatically collapses the mission to show the map.

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


### Other browsers ###

Most of this tweaks probably won't make sense for the old IITC Mobile app. But if you know another mobile browser that supports Tampermonkey or similar then all of those tweaks should work fine too. So in other words this plugin aims to fix some generic problems with Ingress Intel in mobile browsers and is not really specific to Firefox.


### Other plugins ###

Note I also have a different plugin which is focused on making FF mobile desktop view a bit more readable [enlarge-tools](https://github.com/Eccenux/iitc-plugin-enlarge-tools).

See also: [my other IITC plugins](https://github.com/search?q=user%3AEccenux+iitc-plugin&type=Repositories).
