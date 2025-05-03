export const formatRelativeTime  = (date: string) => {
	const diff = (Date.now() - new Date(date).getTime()) / 1000

	if (diff < 60) return 'только что'
	if (diff < 3600) return `${Math.floor(diff / 60)} минут назад`
	if (diff < 86400) return `${Math.floor(diff / 3600)} минут назад`
	if (diff < 172800) return 'вчера'
}