SBB/CFF/FSS - Train Schedule WebApp, 

based on [transport.opendata.ch](http://transport.opendata.ch), [Mozilla buildingfirefoxos.com](http://buildingfirefoxos.com/building-blocks) & [moment.js](http://momentjs.com) written in plain [Vanilla](http://gomakethings.com/ditching-jquery-for-vanilla-js/)

it's a WebApp optimzed for [Firefox OS](https://www.mozilla.org/de/firefox/os/) but [will also work on Android](https://hacks.mozilla.org/2014/06/firefox-os-apps-run-on-android/) some day (I hope so)


# Status

* 05.10.2014 - v0.1/2 - ready to take off (^_^) 
* 08.10.2014 - added icons
* 24.10.2014 - fixed some bux & refactored html (template areas) & replaced lot of jQuery shit

# install

```
npm install
bower install
grunt
node server.js
```
click on http://127.0.0.1:8080

# Todo

* passing to [android](https://developer.mozilla.org/en-US/Marketplace/Options/Open_web_apps_for_android
* product colors > SBB red, bus blue, etc
* replace Basil.js (what a crap)
* replace jQuery
* translation, fr/it

# Bugs

* nach neuer suche kann zwar ein favorit erstellt werden, es speichert aber daten der vorherigen suche

