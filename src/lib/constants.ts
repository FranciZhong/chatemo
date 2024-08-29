export enum PageUrl {
	HOME = '/',
	LOGIN = '/login',
	CHAT = '/chat',
	FRIEND = '/chat/friend',
	CHANNEL = '/chat/channel',
}

export enum ImgUrl {
	BG_REPEAT = 'bg-repeat.svg',
	USER_AVATAR_ALT = 'user-avatar-alt.svg',
	CHANNEL_AVATAR_ALT = 'channel-avatar-alt.svg',
}

export enum ApiUrl {
	SOCKET = '/api/socket',
	USER_SEARCH = '/api/user/search',
	USER_PROFILE = '/api/user/profile',
	SEND_FRIEND_REQUEST = '/api/user/request',
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
