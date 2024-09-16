export enum UserEvent {
	ERROR_ACCTION = 'error_action',

	// notification
	NEW_NOTIFICATION = 'new_notification',

	// friend request
	RESPOND_FRIEND_REQUEST = 'respond_friend_request',
	NEW_FRIENDSHIP = 'new_friendship',

	// configs
	UPDATE_APIKEYS = 'update_apikeys',
}

export enum ChatEvent {
	// conversations
	SEND_CONVERSATION_MESSAGE = 'send_conversation_message',
	NEW_CONVERSATION_MESSAGE = 'new_conversation_message',
	UPDATE_CONVERSATION_MESSAGE = 'update_conversation_message',
	// send to server
	DELETE_CONVERSATION_MESSAGE = 'delete_conversation_message',
	// emit to clients
	REMOVE_CONVERSATION_MESSAGE = 'remove_conversation_message',

	// channels
	SEND_CHANNEL_MESSAGE = 'send_channel_message',
	NEW_CHANNEL_MESSAGE = 'new_channel_message',
	UPDATE_CHANNEL_MESSAGE = 'update_channel_message',
	// send to server
	DELETE_CHANNEL_MESSAGE = 'delete_channel_message',
	// emit to clients
	REMOVE_CHANNEL_MESSAGE = 'remove_channel_message',
}

export enum AgentEvent {
	AVAILABLE_MODELS = 'available_models',
	AGENT_REPLY_CONVERSATION = 'agent_reply_conversation',
	AGENT_REPLY_CHANNEL = 'agent_reply_channel',
}
