# SBB/CFF/FSS - Train Schedule WebApp

Based on [transport.opendata.ch](http://transport.opendata.ch), [Mozilla buildingfirefoxos.com](http://buildingfirefoxos.com/building-blocks) & [moment.js](http://momentjs.com) written in plain [Vanilla](http://gomakethings.com/ditching-jquery-for-vanilla-js/).

It's a WebApp optimzed for [Firefox OS](https://www.mozilla.org/de/firefox/os/) but [will also work on Android](https://hacks.mozilla.org/2014/06/firefox-os-apps-run-on-android/) some day (I hope so).

Goal was to build an app so fast and small that's possible.


### Status

* 05.10.2014 - v0.1/2 - ready to take off (^_^) 
* 06.10.2014 - added passlists in detailView
* 08.10.2014 - added icons
* 24.10.2014 - fixed some bux & refactored html (template areas) & replaced lot of jQuery shit
* 27.10.2014 - refactored detail view, added trasport vehicle colors
* 28.10.2014 - removed ionicons and font awesome, replaced with png icons
* 29.10.2014 - added key down search event, sort searched result
* 30.10.2014 - removed basil.js
* 07.11.2014 - removed basil.js
* 09.03.2015 - T-1 removed jQuery

### Install

```
npm install
bower install
grunt
```
click on http://127.0.0.1:9001

### Todo

* T-14 favorits miss search parameters
* T-2 replace moment.js with [fecha](https://github.com/taylorhakes/fecha)
* T-3 passing to [android](https://developer.mozilla.org/en-US/Marketplace/Options/Open_web_apps_for_android)
* T-4 show css [spiner/loader](http://projects.lukehaas.me/css-loaders/) icon while loading
* T-5 solve css_concate problem with gaia libraries
* T-6 autofill

### Bugs

* T-7 nach neuer suche kann zwar ein favorit erstellt werden, es speichert aber daten der vorherigen suche
* T-8 form toggle bug
* T-13 counting bug in viewModel:168

### Wishlist

* T-9 vibrations alarm/reminder für ausgewählte verbindung
* T-10 translation, fr/it
* T-11 color switcher
* T-12 OpenStreetMap

