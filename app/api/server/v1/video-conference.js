import { Meteor } from 'meteor/meteor';

import { Rooms } from '../../../models/server';
import { API } from '../api';

API.v1.addRoute('video-conference/jitsi.update-timeout', { authRequired: true }, {
	post() {
		// TODO: either room id or room name
		const { roomId, customTimeout } = this.bodyParams;
		if (!roomId) {
			return API.v1.failure('The "roomId" parameter is required!');
		}

		const room = Rooms.findOneById(roomId, { fields: { _id: 1 } });
		if (!room) {
			return API.v1.failure('Room does not exist!');
		}

		if (customTimeout && typeof customTimeout !== 'number') {
			return API.v1.failure('The "customTimeout" parameter needs to be an integer (seconds)!');
		}
		// TODO: set custom timeout <- k
		// TODO: set password
		// TODO: add tests
		// TODO: add docs
		const jitsiTimeout = Meteor.runAsUser(
			this.userId, () => Meteor.call('jitsi:updateTimeout', roomId, customTimeout),
		);

		return API.v1.success({ jitsiTimeout });
	},
});
