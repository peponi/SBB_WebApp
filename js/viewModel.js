var viewModel = function()
{
	var self = this,
		basil = new window.Basil({namespace: 'conn_'});

	self.api = 'http://transport.opendata.ch/v1/';
	self.currConnections = [];
	self.currObj = {};

	self.generateUID = function()
	{
		return 'xxxxxxxx'.replace(/[x]/g, function(c) {
			    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			    return v.toString(16);
			});
	};

	self.setStatus = function(msg)
	{
		utils.status.show(msg);  
	};

	// Connections

	self.showDetail = function(id)
	{
		$.each(self.currConnections,function(i,Obj)
		{
			if(id == Obj.id)
			{
				self.currObj = Obj;
			}
		});

		console.log(self.currObj);	

		$("#sections").children().remove();
		
		$.each(self.currObj.sections,function(i,Obj)
		{
			var name = (Obj.journey)?Obj.journey.name:'';

			$("#sections").append('\
				<div class="grid header" data-show-passlist data-id="'+i+'">\
					<h2 class="col-1-3">'+Obj.departure.location.name+'</h2>\
					<h2 class="col-1-3 ">'+name+'</h2>\
					<h2 class="col-1-3"> '+Obj.arrival.location.name+'</h2>\
				</div>\
				<div class="grid f-14 arrival">\
					<h2 class="col-1-3">Abfahrt</h2>\
					<h2 class="col-1-3">'+moment(Obj.departure.departure).format('H:mm')+'</h2>\
					<h2 class="col-1-3"><span>Steig</span> '+Obj.departure.platform+'</h2>\
				</div>\
				<div class="grid f-14 departure">\
					<h2 class="col-1-3">Ankunft</h2>\
					<h2 class="col-1-3">'+moment(Obj.arrival.arrival).format('H:mm')+'</h2>\
					<h2 class="col-1-3"><span>Steig</span> '+Obj.arrival.platform+'</h2>\
				</div>')
		});

	  	document.querySelector('#detailView').className = 'current';
	  	document.querySelector('[data-position="current"]').className = 'left';		
	};

	self.togglePasslist = function(id)
	{
		var passList = self.currObj.sections[id].journey.passList,
			html = '',
			$sectionPassList = $("#sections div[data-id="+id+"]").next(".arrival");

		if($sectionPassList.find("div.passlist").length)
		{
			$sectionPassList.find("div.passlist").slideToggle();
		}
		else
		{		
			for(i = 1; i < passList.length; i++)
			{
				var station		= passList[i].station.name,
					arrival		= moment(passList[i].arrival).format('H:mm'),
					departure	= moment(passList[i].departure).format('H:mm');

					departure 	= (departure == 'Invalid date')? '' : departure; 

				html += '<div class="grid f-14 pass">\
							<h2 class="col-1-3">'+station+'</h2>\
							<h2 class="col-1-3"><span>Abf.</span> '+arrival+'</h2>\
							<h2 class="col-1-3"><span>Ank.</span> '+departure+'</h2>\
						</div>';
			}

			$sectionPassList.append('<div class="passlist">'+html+'</div>');
		}
	};

	self.search = function(from,to)
	{
		$.get(self.api+"connections?from="+from+"&to="+to,null,null,'json')
		.done(function(data)
		{
			console.log(data);
			self.currConnections = data.connections;
			self.saveLastConnections();
			self.loadLastConnections();
		})
		.fail(function(err)
		{
			console.log(err);
		})
	};

	self.drawConnection = function()
	{
		console.log("drawConnection ...");
		var $connections = $("#connections");

		$connections.children().remove();

		for (var i = self.currConnections.length - 1; i >= 0; i--) {
			
			var Obj = self.currConnections[i];

			var departure = moment.unix(Obj.from.departureTimestamp).format('H:mm'),
				duration = moment(Obj.duration.substr(-8,5),"H:mm").format('H:mm'),
				rail_nr = (Obj.from.platform)?'Gleis '+Obj.from.platform:'<i class="fa fa-bus"></i>';

			//Obj.products.toString()

			$connections.append('\
			<li data-target="detail-view">\
			    <aside class="pack-end">\
			        <small>'+rail_nr+'</small>\
			    </aside>\
				<a href="#" data-id="'+Obj.id+'">\
					<p>'+Obj.from.station.name+' <small>('+duration+' h)</small></p>\
					<p><i class="ion-clock"></i> '+departure+' - '+Obj.sections.length+' <small>Umsteigen</small></p>\
				</a>\
			</li>');
		};
	};

	self.saveLastConnections = function()
	{
		var uid = 0;

		basil.reset();

		for (var i = self.currConnections.length - 1; i >= 0; i--) 
		{
			uid = self.generateUID();
			basil.set(uid, self.currConnections[i]);
		}
	};

	self.loadLastConnections = function()
	{
		console.log("loadLastConnections ...");
		self.currConnections = [];

		if(basil.check('local') && localStorage.length > 0)
		{
			$.each(localStorage,function(i,Obj)
			{
				if(i.split(":")[0].indexOf("conn") == 0) 
				{
					var id = i.split(":")[1];
					Obj = basil.get(id);
					Obj.id = id;
					self.currConnections.push(Obj);
				}
			});
		}

		console.log(self.currConnections);
		self.drawConnection();
	};

	// Favorits

	self.drawFavorit = function(id,from,to)
	{
		$("#favorits").append('\
		<li id="'+id+'">\
			<a href="#" data-load-connections id="'+id+'">'+ from +' &#10132; '+ to +'</a>\
			<aside>\
				<a href="#" data-id="'+id+'">X</a>\
			</aside>\
		</li>');
	};

	self.loadFavorits = function()
	{
		console.log("loadFavorits ...");

		if(localStorage.length > 0)
		{
			$.each(localStorage,function(i,Obj)
			{
				if(i.split(":")[0].indexOf("fav") == 0) 
				{
					var id 	= i.split(":")[1];
					Obj 	= JSON.parse(Obj);

					self.drawFavorit(id,Obj.from,Obj.to);
				}
			});
		}
	};

	self.loadFavorit = function(id)
	{
		var Obj = JSON.parse(localStorage.getItem("fav_:"+id));

		self.currConnections = Obj.connections;		
		self.saveLastConnections();
		self.drawConnection();
	};

	self.setFavorit = function(from,to)
	{
		var id 		= v.generateUID();

		localStorage.setItem('fav_:'+id, JSON.stringify({ from : from, to : to, connections : self.currConnections}));
		self.drawFavorit(id,from,to);

		return 1;
	};

	self.deleteFavorit = function(id)
	{
		basil = new window.Basil({namespace: 'fav_'});
		basil.remove(id);
		$("#"+id).remove();
		return 1;
	};

	self.init = function()
	{
		self.loadLastConnections();
		self.loadFavorits();
	};

	self.init();

	return self;
}