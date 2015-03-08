var viewModel = function()
{
	var l					= localStorage,
		d					= document;
	var self				= this,
		store_prefix_conn	= 'conn_',
		store_prefix_fav	= 'fav_',
		stor = {
			get : function(id)
			{
				return JSON.parse(l.getItem(id));
			},
			set : function(id,data)
			{
				return l.setItem(id, JSON.stringify(data) );
			},
			rm : function(id)
			{
				l.removeItem(id);
			},
			getKeysFor : function(prefix)
			{
				var ret = [];

				for (var k in l){
					ret.push(k);
				}

				return ret.filter(function(c){return c.substring(0,prefix.length) == prefix;});  
			}
		};

	self.api						= 'http://transport.opendata.ch/v1/';
	self.currConnections			= [];
	self.currObj					= {};

	self.setStatus = function(msg)
	{
		utils.status.show(msg);  
	};

	// Connections

	self.showDetail = function(id)
	{
		self.currObj = stor.get(store_prefix_conn+id);	
		
		var sections	= d.getElementById("sections"),
			section		= d.getElementById("section").content;

		while(sections.firstChild) sections.removeChild(sections.firstChild);
		
		for (var i = 0, j = self.currObj.sections.length; i < j; i++) 
		{
			var Obj			= self.currObj.sections[i];
			var name		= (Obj.journey)?Obj.journey.name:'',
				category	= (Obj.journey)?Obj.journey.category:'none',
				s			= section.cloneNode(true);		
					

			// fill the template object with current connection data
			s.querySelector(".grid").dataset.id = i;
			s.querySelector(".grid").className = "grid header show-passlist data-detail-id_"+i;//can't querySelectorAll("[data-id=1]")	
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
		}

		d.querySelector('#detailView').className = 'current';
		d.querySelector('[data-position="current"]').className = 'left';		
	};

	self.togglePasslist = function(id)
	{
		var passList = self.currObj.sections[id].journey.passList,
			html = '',
			sectionPassList = d.querySelector(".data-detail-id_"+id).nextElementSibling,
			parser = new DOMParser();
			
		if(sectionPassList.querySelector("div.passlist") !== null)
		{
			$(sectionPassList.querySelector("div.passlist")).slideToggle();
		}
		else
		{		
			for(i = 1; i < passList.length; i++)
			{
				var station		= passList[i].station.name,
					arrival		= moment(passList[i].arrival).format('H:mm'),
					departure	= moment(passList[i].departure).format('H:mm');

					departure	= (departure == 'Invalid date')? '' : departure; 

				html += '<div class="grid f-14 pass">' +
							'<h2 class="col-1-3">'+station+'</h2>' +
							'<h2 class="col-1-3"><span>Abf.</span> '+arrival+'</h2>' +
							'<h2 class="col-1-3"><span>Ank.</span> '+departure+'</h2>' +
						'</div>';
			}

			html=parser.parseFromString('<div class="passlist">'+html+'</div>', "text/html");

			sectionPassList.appendChild(d.importNode(html.getElementsByTagName("div")[0], true));
		}
	};

	self.search = function(from,to,time,isArrivalTime)
	{
		var time_s = (time)?'&time='+time : '';
			time_s += (isArrivalTime)? '&isArrivalTime=1' : '';

		xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET",self.api+"connections?from="+from+"&to="+to+time_s+"&limit=6",false);
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				var resp = JSON.parse(xmlhttp.responseText);

				console.log(resp);
				self.currConnections = resp.connections.sort(function(con1,con2)
				{
					return con1.from.departureTimestamp < con2.from.departureTimestamp;
				});
				self.saveLastConnections();
				self.loadLastConnections();
			}
			else
			{
				console.log(xmlhttp.status,xmlhttp.responseText);
			}
		};
		xmlhttp.send();
	};

	self.drawConnection = function()
	{
		console.log("drawConnection ...");

		var connections = d.getElementById("connections"),
			connection	= d.getElementById("connection").content;

		while(connections.firstChild) connections.removeChild(connections.firstChild);

		for (var j = self.currConnections.length, i = 0; i < j; i++) {
			
			var Obj = self.currConnections[i],
				c	= connection.cloneNode(true);		

			// prepare connection variables
			var departure = moment.unix(Obj.from.departureTimestamp).format('H:mm'),
				duration = moment(Obj.duration.substr(-8,5),"H:mm").format('H:mm'),
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
			c.querySelector("li a").dataset.id			= Obj.id;
			c.querySelector("li a").className			= "show-detail data-id_"+Obj.id;
			c.querySelector("aside small").innerHTML	= rail_nr;
			c.querySelector(".r1 var").innerHTML		= Obj.from.station.name;
			c.querySelector(".r1 small").innerHTML		= duration;
			c.querySelector(".r2 var").innerHTML		= departure+' - '+Obj.sections.length;

			// append to connections list
			connections.appendChild(c);
		}
	};

	self.saveLastConnections = function()
	{
		//get all localStorage connection keys
		var keys = stor.getKeysFor(store_prefix_conn); 

		// remove last connections
		for (var i = keys.length;i ;i--)
		{
			stor.rm(store_prefix_conn+i);   
		}

		// save new connections
		for (i = self.currConnections.length - 1;i ;i-- ) 
		{
			self.currConnections[i].id = i;
			stor.set(store_prefix_conn+i, self.currConnections[i]);
		}
	};

	self.loadLastConnections = function()
	{		
		//get all localStorage connection keys
		var keys = stor.getKeysFor(store_prefix_conn); 

		console.log("loadLastConnections ...");
		self.currConnections = [];

		for (var i = keys.length;i ;i--)
		{
			var Obj = stor.get(store_prefix_conn+i);
			self.currConnections.push(Obj);			
		}

		self.drawConnection();
	};

	// Favorits

	self.drawFavorit = function(id,from,to)
	{
		var parser = new DOMParser(),
			html = 
			'<li id="'+id+'">' +
				'<a href="#" data-load-connections id="'+id+'">'+ from +' &#10132; '+ to +'</a>' +
				'<aside>' +
					'<a href="#" data-id="'+id+'">×</a>' +
				'</aside>' +
			'</li>';

		html=parser.parseFromString(html, "text/html");

		d.getElementById("favorits").appendChild(html.getElementsByTagName("li")[0]);
	};

	self.loadFavorits = function()
	{
		var keys = stor.getKeysFor(store_prefix_fav); 

		console.log("loadFavorits ...");

		keys.forEach(function(key,id)
		{
			var Obj = stor.get(key);
			self.drawFavorit(Obj.id,Obj.from,Obj.to);
		});
	};

	self.loadFavorit = function(id)
	{
		var Obj = stor.get(store_prefix_fav +id);

		self.currConnections = Obj.connections;		
		self.saveLastConnections();
		self.drawConnection();
	};

	self.setFavorit = function(from,to)
	{
		var keys = stor.getKeysFor(store_prefix_fav);
		var	id	= (keys.length - 1) + 1;

		stor.set(store_prefix_fav +id, { id : id, from : from, to : to, connections : self.currConnections});
		self.drawFavorit(id,from,to);

		return 1;
	};

	self.deleteFavorit = function(id)
	{
		stor.rm(store_prefix_fav+id);
		var obj = d.getElementById(id);
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
};