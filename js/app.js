v = new viewModel();

function serach()
{
	var form 	= $("form"),
		from 	= form.find("[name=from]").val(),
		to 		= form.find("[name=to]").val();
		time 	= form.find("[name=time]").val(),
		isArrivalTime = form.find("[name=isArrivalTime]").is(":checked");

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
$("[data-show-form]").on("click",function()
{
	if( $(this).children().hasClass("active") )
	{
		console.log("ist active > suchen und slideUp");
		
		if( serach() )
		{
			$("form").slideUp();
			$(this).children().removeClass("active");
		}
	}
	else
	{
		console.log("ist nicht active > set active und slideDown");
		$("form").slideDown();
		$(this).children().addClass("active");
	}	
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
$("nav a[data-fav-current-search]").on("click",function(e)
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
$("#favorits").on("click","li aside a",function(e)
{
	if(v.deleteFavorit(e.target.dataset.id))
	{
		v.setStatus("favorit has been deleted");
	}
});

// load this connection
$("[data-load-connections]").on("click",function(e)
{
	v.loadFavorit(e.target.id);
});

$("[name=isArrivalTime]").on("change",function(e)
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