export enum PageUrl {
	HOME = '/',
	LOGIN = '/login',
	CHAT = '/chat',
	FRIENDS = '/chat/friends',
	AGENTS = '/chat/agents',
	CHANNELS = '/chat/channels',
}

export enum ImgUrl {
	BG_REPEAT = '/bg-repeat.svg',
	USER_AVATAR_ALT = '/user-avatar-alt.svg',
	CHANNEL_AVATAR_ALT = '/channel-avatar-alt.svg',
	AGENT_AVATAR_ALT = '/agent-avatar-alt.svg',
}

export enum ApiUrl {
	SOCKET = '/api/socket',
	FILE_PRESIGN = '/api/file/presign',
	// user
	USER_SEARCH = '/api/user/search',
	UPDATE_USER_PROFILE = '/api/user/profile/update',
	UPDATE_APIKEYS_CONFIG = '/api/user/config/apikeys',
	// friendship
	SEND_FRIEND_REQUEST = '/api/friend/request',
	RESPOND_FRIEND_REQUEST = '/api/friend/respond',
	DELETE_FRIENDSHIP = '/api/friend/delete',
	// conversation
	GET_CONVERSATION_MESSAGES = '/api/conversation/messages',
	// agent
	CREATE_AGENT = '/api/agent/create',
	DELETE_AGENT = '/api/agent/delete',
	GET_ALL_AGENT = '/api/agent/all',
	AGENT_PROMPT = '/api/agent/prompt',
	// channel
	CREATE_CHANNEL = '/api/channel/create',
	CLOSE_CHANNEL = '/api/channel/close',
	GET_CHANNEL_MESSAGES = '/api/channel/messages',
	CHANNEL_SEARCH = '/api/channel/search',
	SEND_CHANNEL_REQUEST = '/api/channel/membership/request',
	SEND_CHANNEL_INVITE = '/api/channel/membership/invite',
	CHANNEL_RESPOND_REQUEST = '/api/channel/membership/respond',
	REMOVE_CHANNEL_MEMBERSHIP = '/api/channel/membership/remove',
	LEAVE_CHANNEL = '/api/channel/membership/leave',
	ASSIGN_OWNERSHIP = '/api/channel/membership/ownership',
}

export enum Theme {
	LIGHT = 'light',
	DARK = 'dark',
}

export enum ModalType {
	NAV_MODAL = 'NavModal',
	PROFILE_MODAL = 'ProfileModal',
	NOTIFICATION_MODAL = 'NotificationModal',
	MEMBERSHIP_MODAL = 'MembershipsModal',
	CHANNEL_INVITE_MODAL = 'ChannelInviteModal',
}

export enum SidebarTab {
	FRIENDS = 'friends',
	CHANNELS = 'channels',
	AGENTS = 'agents',
}

export enum NavModalTab {
	FIND_FRIEND = 'Find Friend',
	ADD_AGENT = 'Add Agent',
	JOIN_CHANNEL = 'Join Channel',
	CREATE_CHANNEL = 'Create Channel',
}

export enum ProfileModalTab {
	USER_PROFILE = 'User Profile',
	API_KEYS = 'Api Keys',
	MODEL_SETTING = 'Model Setting',
}

export enum NotificationType {
	FRIEND_REQUEST = 'Friend Request',
	JOIN_CHANNEL_REQUEST = 'Join Channel Request',
	INVITE_CHANNEL_REQUEST = 'Invite to Join Channel',
}

export enum AvatarSize {
	XL = 'xl',
	LG = 'lg',
	MD = 'md',
	SM = 'sm',
	XS = 'xs',
}

export enum LlmProviderName {
	OPENAI = 'openai',
	ANTHROPIC = 'anthropic',
}

export enum LlmRole {
	SYSTEM = 'system',
	USER = 'user',
	ASSISTANT = 'assistant',
}

export const allowedImageTypes = [
	'image/jpeg',
	'image/png',
	'image/gif',
	'image/webp',
	'image/svg+xml',
];

export const DEFAULT_TRANSFORM_DELAY = 300;
export const GITHUB_LINK = 'https://github.com/FranciZhong/chatemo';
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;

export const DEFAULT_SELECT_LIMIT = 20;
export const TAKE_MESSAGES_DEFAULT = 20;
export const TAKE_MESSAGES_LIMIT = 50;

// text
export const TOAST_ERROR_DEFAULT = {
	title: 'Error',
	description: 'Something went wrong.',
};
export const CLOSE_CHANNEL_WARNING_DESC =
	'This channel will be closed forever and all members are lost. If you want to keep this channel, please asign this channel to someone else.';
