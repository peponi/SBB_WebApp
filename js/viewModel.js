var viewModel = function()
{
	var self 						= this,
		store_prefix_connections 	= 'conn_',
		store_prefix_favorits 		= 'fav_',
		store 						= localStorage;

	self.api 						= 'http://transport.opendata.ch/v1/';
	self.currConnections 			= [];
	self.currObj 					= {};

	self.setStatus = function(msg)
	{
		utils.status.show(msg);  
	};

	// Connections

	self.showDetail = function(id)
	{
		self.currObj = JSON.parse(store.getItem(store_prefix_connections+id));		
		
		var d 			= document;
		var sections 	= d.getElementById("sections"),
			section 	= d.getElementById("section").content;

		while(sections.firstChild) sections.removeChild(sections.firstChild);
		
		for (var i = 0, j = self.currObj.sections.length; i < j; i++) 
		{
			var Obj 		= self.currObj.sections[i];
			var name 		= (Obj.journey)?Obj.journey.name:'',
				category 	= (Obj.journey)?Obj.journey.category:'none',
				s 			= section.cloneNode(true);			

			// fill the template object with current connection data
			s.querySelector(".grid").dataset.id = i;			
			s.querySelectorAll(".grid")[0].querySelectorAll("h2")[0].innerHTML = Obj.departure.location.name;
			s.querySelectorAll(".grid")[0].querySelectorAll("h2")[1].innerHTML = name;
			s.querySelectorAll(".grid")[0].querySelectorAll("h2")[1].className = "col-1-2 " + category;
			s.querySelectorAll(".grid")[1].querySelectorAll("h2")[1].innerHTML = moment(Obj.departure.departure).format('H:mm');
			if(Obj.departure.platform)
			{
				s.querySelectorAll(".grid")[1].querySelectorAll("h2")[2].querySelector("span").innerHTML = 'Steig';
				s.querySelectorAll(".grid")[1].querySelectorAll("h2")[2].querySelector("var").innerHTML = Obj.departure.platform;
			}
			else
			{
				s.querySelectorAll(".grid")[1].querySelectorAll("h2")[2].querySelector("i").className = "icon i-walk";
			}	
			
			s.querySelectorAll(".grid")[2].querySelectorAll("h2")[1].innerHTML = moment(Obj.arrival.arrival).format('H:mm');
			if(Obj.arrival.platform)
			{
				s.querySelectorAll(".grid")[2].querySelectorAll("h2")[2].querySelector("span").innerHTML = 'Steig';				
				s.querySelectorAll(".grid")[2].querySelectorAll("h2")[2].querySelector("var").innerHTML = Obj.arrival.platform;
			}
			else
			{
				s.querySelectorAll(".grid")[2].querySelectorAll("h2")[2].querySelector("i").className = "icon i-walk";
			}

			// append to connections list
			sections.appendChild(d.importNode(s, true));
		};

	  	d.querySelector('#detailView').className = 'current';
	  	d.querySelector('[data-position="current"]').className = 'left';		
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

	self.search = function(from,to,time,isArrivalTime)
	{
		var time_s = (time)?'&time='+time : '';
			time_s += (isArrivalTime)? '&isArrivalTime=1' : '';
		$.get(self.api+"connections?from="+from+"&to="+to+time_s+"&limit=6",null,null,'json')
		.done(function(data)
		{
			console.log(data);
			self.currConnections = data.connections.sort(function(con1,con2)
			{
				return con1.from.departureTimestamp < con2.from.departureTimestamp;
			});
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
		var d = document;

		var connections = d.getElementById("connections"),
			connection 	= d.getElementById("connection").content;

		while(connections.firstChild) connections.removeChild(connections.firstChild);

		for (var j = self.currConnections.length, i = 0; i < j; i++) {
			
			var Obj = self.currConnections[i];

			// prepare connection variables
			var departure = moment.unix(Obj.from.departureTimestamp).format('H:mm'),
				duration = moment(Obj.duration.substr(-8,5),"H:mm").format('H:mm')
				rail_nr = '';

			if(Obj.from.platform)
			{
				rail_nr ='Gleis '+Obj.from.platform;
			}
			else
			{				
				rail_nr = (Obj.products[0] == "NFT" || Obj.products[0] == "T")? '<i class="icon i-tram"></i>':'<i class="icon i-bus"></i>';
			}

			// fill the template object with current connection data
			connection.querySelector("li a").dataset.id 		= Obj.id;
			connection.querySelector("aside small").innerHTML 	= rail_nr;
			connection.querySelector(".r1 var").innerHTML 		= Obj.from.station.name;
			connection.querySelector(".r1 small").innerHTML 	= duration;
			connection.querySelector(".r2 var").innerHTML 		= departure+' - '+Obj.sections.length;

			// append to connections list
			connections.appendChild(d.importNode(connection, true));
		};
	};

	self.saveLastConnections = function()
	{
		//get all localStorage connection keys
		var keys = Object.keys(localStorage).filter(function(c){return c.substring(0,store_prefix_connections.length) == store_prefix_connections}); 

		// remove last connections
		for (var i = keys.length; i--;)
		{	    
		    store.removeItem(store_prefix_connections+i);   
		}

		// save new connections
		for (var i = self.currConnections.length - 1; i--; ) 
		{
			self.currConnections[i].id = i;
			store.setItem(store_prefix_connections+i, JSON.stringify(self.currConnections[i]));
		}
	};

	self.loadLastConnections = function()
	{		
		//get all localStorage connection keys
		var keys = Object.keys(localStorage).filter(function(c){return c.substring(0,store_prefix_connections.length) == store_prefix_connections}); 

		console.log("loadLastConnections ...");
		self.currConnections = [];

		for (var i = keys.length; i--;) 
		{
			var Obj = JSON.parse(store.getItem(store_prefix_connections+i));
			self.currConnections.push(Obj);			
		}

		self.drawConnection();
	};

	// Favorits

	self.drawFavorit = function(id,from,to)
	{
		$("#favorits").append('\
		<li id="'+id+'">\
			<a href="#" data-load-connections id="'+id+'">'+ from +' &#10132; '+ to +'</a>\
			<aside>\
				<a href="#" data-id="'+id+'">×</a>\
			</aside>\
		</li>');
	};

	self.loadFavorits = function()
	{
		var keys = Object.keys(localStorage).filter(function(c){return c.substring(0,store_prefix_favorits.length) == store_prefix_favorits}); 

		console.log("loadFavorits ...");

		for (var i = keys.length; i--;) 
		{
			var Obj = JSON.parse(store.getItem(store_prefix_favorits+i));
			self.drawFavorit(Obj.id,Obj.from,Obj.to);
		}
	};

	self.loadFavorit = function(id)
	{
		console.log(id);
		var Obj = JSON.parse(store.getItem(store_prefix_favorits +id));

		console.log(Obj);

		self.currConnections = Obj.connections;		
		self.saveLastConnections();
		self.drawConnection();
	};

	self.setFavorit = function(from,to)
	{
		var keys = Object.keys(localStorage).filter(function(c){return c.substring(0,store_prefix_favorits.length) == store_prefix_favorits}),
			id 	= (keys.length - 1) + 1;

		store.setItem(store_prefix_favorits +id, JSON.stringify({ id : id, from : from, to : to, connections : self.currConnections}));
		self.drawFavorit(id,from,to);

		return 1;
	};

	self.deleteFavorit = function(id)
	{
		store.removeItem(store_prefix_favorits+id)
		var obj = document.getElementById(id);
		obj.parentNode.removeChild(obj);
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