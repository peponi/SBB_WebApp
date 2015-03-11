;(function(window, document, undefined) 
{
	'use strict';

	var v = new viewModel(),
		d = document;

	function on(elSelector, eventName, selector, fn) 
	{
	    var element = d.querySelector(elSelector);

	    element.addEventListener(eventName, function(event) {
	        var possibleTargets = element.querySelectorAll(selector);
	        var target = event.target;

	        for (var i = 0, l = possibleTargets.length; i < l; i++) {
	            var el = target;
	            var p = possibleTargets[i];

	            while(el && el !== element) {
	                if (el === p) {
	                    return fn.call(p, event);
	                }

	                el = el.parentNode;
	            }
	        }
	    });
	}

	function search()
	{
		var form	= d.querySelector("form"),
			from	= form.querySelector("[name=from]").value,
			to		= form.querySelector("[name=to]").value;
			time	= form.querySelector("[name=time]").value,
			isArrivalTime = form.querySelector("[name=isArrivalTime]").checked;

		if (!from && !to)
		{
			v.setStatus("please fill in the required data");
			return 0;
		}

		console.log(from,to,time,"isArrivalTime="+isArrivalTime);

		v.search(from,to,time,isArrivalTime);
		return 1;
	}

	// toggle form area and search while form is closing
	d.querySelector('[data-show-form]').addEventListener("click",function(e)
	{
		var Obj = e.target,
			form = d.querySelector("form");

		// some time the parent element fires the click event
		Obj = (Obj.tagName.toLowerCase('span'))? Obj : Obj.querySelector('span');

		if( Obj.className.indexOf('active') != -1 )
		{
			console.log("ist active > suchen und slideUp");
			
			if( search() )
			{
				form.style.display = 'none';
				Obj.classList.remove('active');
			}
		}
		else
		{
			console.log("ist nicht active > set active und slideDown");
			
			form.style.display = 'block';
			Obj.classList.add('active');
		}	
	});

	// trigger click on data-show-form
	function trigger(e)
	{
		if(e.keyCode==13)
		{
			e = d.createEvent('HTMLEvents');
			e.initEvent('click', true, false);
			d.querySelector('[data-show-form]').dispatchEvent(e);
		}
	}

	d.querySelector("[name=to]").addEventListener('keydown', function(e)
	{
		trigger(e);
	});

	d.querySelector("[name=from]").addEventListener('keydown', function(e)
	{
		trigger(e);
	});

	// show connection detail
	on("body","click",'[data-target=detail-view] a',function(e)
	{
		var id;

		if(e.target.tagName != "P")
		{
			id = e.target.parentNode.parentNode.dataset.id;
		}
		else
		{
			id = e.target.parentNode.dataset.id;
		}

		v.showDetail(id);
	});

	on("#sections","click",'[data-show-passlist] h2',function(e)
	{
		v.togglePasslist(e.target.parentNode.dataset.id);
	});

	// favorit current connection data
	d.querySelector("nav a[data-fav-current-search]").addEventListener('click', function(e)
	{
		if(v.currConnections)
		{
			var from	= v.currConnections[0].from.location.name,
				to		= v.currConnections[0].to.location.name;

			if(v.setFavorit(from,to))
			{
				v.setStatus("current connections has been added as favorit");
			}
		}
		else
		{
			v.setStatus("plz search connections first");
		}		
	});

	// delete favorit connection data
	[].forEach.call(d.querySelectorAll('#favorits li aside a'), function(el) {
	  el.addEventListener('click', function(e) {
	    if(v.deleteFavorit(e.target.dataset.id))
		{
			v.setStatus("favorit has been deleted");
		}
	  });
	});

	// load this connection
	[].forEach.call(d.querySelectorAll('[data-load-connections]'), function(el) {
	  el.addEventListener('click', function(e) {
	    v.loadFavorit(e.target.id);
	  });
	});

	d.querySelector("[name=isArrivalTime]").addEventListener("change", function(e)
	{
		d.getElementById("time").innerHTML = (e.target.checked)? "arrival": "departure" ;	
	});

	d.querySelector('#btn-back').addEventListener ('click', function () {
	  d.querySelector('#detailView').className = 'right';
	  d.querySelector('[data-position="current"]').className = 'current';
	});

	window.addEventListener('load', function(e) {

	  window.applicationCache.addEventListener('updateready', function(e) {
	    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
	      // Browser downloaded a new app cache.
	      if (confirm('A new version of this site is available. Load it?')) {
	        window.location.reload();
	      }
	    } else {
	      // Manifest didn't changed. Nothing new to server.
	    }
	  }, false);

	}, false);

})(window, document);
