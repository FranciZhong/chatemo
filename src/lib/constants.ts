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
	USER_SEARCH = '/api/user/search',
	SEND_FRIEND_REQUEST = '/api/user/request',
	UPDATE_USER_PROFILE = '/api/user/profile/update',
	UPDATE_APIKEYS_CONFIG = '/api/user/config/apikeys',
	GET_CONVERSATION_MESSAGES = '/api/chat/conversation/messages',
	CREATE_AGENT = '/api/agent/create',
	GET_ALL_AGENT = '/api/agent/all',
	AGENT_PROMPT = '/api/agent/prompt',
}

export enum Theme {
	LIGHT = 'light',
	DARK = 'dark',
}

export enum ModalType {
	NAV_MODAL = 'NavModal',
	PROFILE_MODAL = 'ProfileModal',
	NOTIFICATION_MODAL = 'NotificationModal',
}

export enum SidebarTab {
	FRIENDS = 'friends',
	CHANNELS = 'channels',
	AGENTS = 'agents',
}

export enum NavModalTab {
	FIND_FRIEND = 'find friend',
	ADD_AGENT = 'add agent',
	JOIN_CHANNEL = 'join channel',
	CREATE_CHANNEL = 'create channel',
}

export enum ProfileModalTab {
	USER_PROFILE = 'user profile',
	API_KEYS = 'api keys',
	MODEL_SETTING = 'model setting',
}

export enum NotificationType {
	FRIEND_REQUEST = 'Friend Request',
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
export const TAKE_MESSAGES_DEFAULT = 50;
export const TAKE_MESSAGES_LIMIT = 1000;
