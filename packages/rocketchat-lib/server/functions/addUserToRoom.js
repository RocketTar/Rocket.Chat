RocketChat.addUserToRoom = function(rid, user, inviter, silenced) {
	const now = new Date();
	const room = RocketChat.models.Rooms.findOneById(rid);

	// Check if user is already in room
	const subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, user._id);
	if (subscription) {
		return;
	}

	if (room.t === 'c' || room.t === 'p') {
		RocketChat.callbacks.run('beforeJoinRoom', user, room);
	}

	const muted = room.ro && !RocketChat.authz.hasPermission(user._id, 'post-readonly');
	if (muted) {
		RocketChat.models.Rooms.muteUsernameByRoomId(rid, user.username);
	}
/*
	const colors = {
		aqua: "#00ffff",
		azure: "#f0ffff",
		beige: "#f5f5dc",
		black: "#000000",
		blue: "#0000ff",
		brown: "#a52a2a",
		cyan: "#00ffff",
		darkblue: "#00008b",
		darkcyan: "#008b8b",
		darkgrey: "#a9a9a9",
		darkgreen: "#006400",
		darkkhaki: "#bdb76b",
		darkmagenta: "#8b008b",
		darkolivegreen: "#556b2f",
		darkorange: "#ff8c00",
		darkorchid: "#9932cc",
		darkred: "#8b0000",
		darksalmon: "#e9967a",
		darkviolet: "#9400d3",
		fuchsia: "#ff00ff",
		gold: "#ffd700",
		green: "#008000",
		indigo: "#4b0082",
		khaki: "#f0e68c",
		lightblue: "#add8e6",
		lightcyan: "#e0ffff",
		lightgreen: "#90ee90",
		lightgrey: "#d3d3d3",
		lightpink: "#ffb6c1",
		lightyellow: "#ffffe0",
		lime: "#00ff00",
		magenta: "#ff00ff",
		maroon: "#800000",
		navy: "#000080",
		olive: "#808000",
		orange: "#ffa500",
		pink: "#ffc0cb",
		purple: "#800080",
		violet: "#800080",
		red: "#ff0000",
		silver: "#c0c0c0",
		white: "#ffffff",
		yellow: "#ffff00"
	};

	const colorHexValues = Object.values(colors);

	// Meteor.call('getUsersOfRoom', rid, true,
	// 	(error, users) => {
	// 		if (users) {
	// 			templateInstance.numberOfMembers.set(users.total);
	// 		}
	// 	}
	// );

	const subscriptions = RocketChat.models.Subscriptions.findByRoomIdWhenUsernameExists(rid).fetch();
		 subscriptions.forEach(s => console.log(s.u)); // TODO: CACHE: expensive
		
		// const options = { fields: { username: 1, name: 1 } };

		// const users = showAll === true
		// 	? RocketChat.models.Users.findUsersWithUsernameByIds(userIds, options).fetch()
		// 	: RocketChat.models.Users.findUsersWithUsernameByIdsNotOffline(userIds, options).fetch();

// const colorsAlreadyTaken = 
		// get list of colors
		// generate random color not in list (out of some list of possible colors?)
		// add color to userInRoom in db
*/

	RocketChat.models.Subscriptions.createWithRoomAndUser(room, user, {
		ts: now,
		open: true,
		alert: true,
		unread: 1,
		userMentions: 1,
		groupMentions: 0
	});

	if (!silenced) {
		if (inviter) {
			RocketChat.models.Messages.createUserAddedWithRoomIdAndUser(rid, user, {
				ts: now,
				u: {
					_id: inviter._id,
					username: inviter.username
				}
			});
		} else {
			RocketChat.models.Messages.createUserJoinWithRoomIdAndUser(rid, user, { ts: now });
		}
	}

	if (room.t === 'c' || room.t === 'p') {
		Meteor.defer(function() {
			RocketChat.callbacks.run('afterJoinRoom', user, room);
		});
	}

	return true;
};
