export enum UserEvent {
	ERROR_ACCTION = 'error_action',

	// notification
	NEW_NOTIFICATION = 'new_notification',

	// friend request
	RESPOND_FRIEND_REQUEST = 'respond_friend_request',
	NEW_FRIENDSHIP = 'new_friendship',
}

export enum ChatEvent {
	SEND_CONVERSATION_MESSAGE = 'send_conversation_message',
	NEW_CONVERSATION_MESSAGE = 'new_conversation_message',
}
