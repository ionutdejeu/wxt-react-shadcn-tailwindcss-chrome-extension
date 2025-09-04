// Types for our handler functions
export interface AlarmAPI {
	clear: (name: string) => Promise<boolean>;
	create: (
		name: string,
		alarmInfo: chrome.alarms.AlarmCreateInfo,
	) => Promise<void>;
	get: (name: string) => Promise<chrome.alarms.Alarm | undefined>;
}
