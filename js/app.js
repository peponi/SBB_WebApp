v = new viewModel(),
d = document;

function search()
{
	var form 	= document.querySelector("form"),
		from 	= form.querySelector("[name=from]").value,
		to 		= form.querySelector("[name=to]").value;
		time 	= form.querySelector("[name=time]").value,
		isArrivalTime = form.querySelector("[name=isArrivalTime]").checked;

	if (!from && !to)
	{
		v.setStatus("please fill in the required data");
		return 0;
	}

	console.log(from,to,time,"isArrivalTime="+isArrivalTime);

	v.search(from,to,time,isArrivalTime)
	return 1;
};

// toggle form area and search while form is closing
document.querySelector('[data-show-form]').addEventListener("click",function(e)
{
	var Obj = e.target,
		form = document.querySelector("form");

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
		e = document.createEvent('HTMLEvents');
		e.initEvent('click', true, false);
		document.querySelector('[data-show-form]').dispatchEvent(e);
	}
}

document.querySelector("[name=to]").addEventListener('keydown', function(e)
{
	 trigger(e);
});

document.querySelector("[name=from]").addEventListener('keydown', function(e)
{
	 trigger(e);
});

// show connection detail
$("body").on("click",'[data-target=detail-view] a',function(e)
{
	var id = $(e.target).parents('a').data("id");
	v.showDetail(id);
});

$("#sections").on("click",'[data-show-passlist] h2',function(e)
{
	v.togglePasslist(e.target.parentNode.dataset.id);
});

// favorit current connection data
document.querySelector("nav a[data-fav-current-search]").addEventListener('click', function(e)
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
[].forEach.call(document.querySelectorAll('#favorits li aside a'), function(el) {
  el.addEventListener('click', function(e) {
    if(v.deleteFavorit(e.target.dataset.id))
	{
		v.setStatus("favorit has been deleted");
	}
  })
});

// load this connection
[].forEach.call(document.querySelectorAll('[data-load-connections]'), function(el) {
  el.addEventListener('click', function(e) {
    v.loadFavorit(e.target.id);
  })
})

document.querySelector("[name=isArrivalTime]").addEventListener("change", function(e)
{
	document.getElementById("time").innerHTML = (e.target.checked)? "arrival": "departure" ;	
});

document.querySelector('#btn-back').addEventListener ('click', function () {
  document.querySelector('#detailView').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
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