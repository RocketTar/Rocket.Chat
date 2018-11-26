Meteor.methods({
	checkIfMessageExists(id) {
		check(id, String);

		message = RocketChat.models.Messages.findOneById(id);

		return {
            exists: message !== undefined
		};
	},
});
