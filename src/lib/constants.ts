export enum PageUrl {
	HOME = '/',
	LOGIN = '/login',
	CHAT = '/chat',
	FRIENDS = '/chat/friends',
	CHANNELS = '/chat/channels',
}

export enum ImgUrl {
	BG_REPEAT = 'bg-repeat.svg',
	USER_AVATAR_ALT = 'user-avatar-alt.svg',
	CHANNEL_AVATAR_ALT = 'channel-avatar-alt.svg',
}

export enum ApiUrl {
	SOCKET = '/api/socket',
	USER_SEARCH = '/api/user/search',
	SEND_FRIEND_REQUEST = '/api/user/request',
	GET_CONVERSATION_MESSAGES = '/api/chat/friends/messages',
}

export enum Theme {
	LIGHT = 'light',
	DARK = 'dark',
}

export enum ModalType {
	NAV_MODAL = 'NavModal',
	NOTIFICATION_MODAL = 'NotificationModal',
}

export enum SidebarTab {
	FRIENDS = 'friends',
	CHANNELS = 'channels',
	AGENTS = 'agents',
}

export enum NavModalTab {
	FIND_FRIEND = 'find friend',
	JOIN_CHANNEL = 'join channel',
	CREATE_CHANNEL = 'create channel',
	ADD_AGENT = 'add agent',
}

export enum NotificationType {
	FRIEND_REQUEST = 'Friend Request',
}

export enum AvatarSize {
	LG = 'lg',
	MD = 'md',
	SM = 'sm',
}

export const DEFAULT_SELECT_LIMIT = 20;
export const GITHUB_LINK = 'https://github.com/FranciZhong/chatemo';
export const TAKE_MESSAGES_DEFAULT = 50;
export const TAKE_MESSAGES_LIMIT = 1000;
