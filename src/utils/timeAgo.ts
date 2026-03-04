export const timeAgo = (date: string, t: any) => {
  const now = new Date();
  const created = new Date(date);

  const diff = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (diff < 60) return t.notifications.time.just_now;

  if (diff < 3600) {
    const min = Math.floor(diff / 60);
    return t.notifications.time.min_ago.replace('{{count}}', String(min));
  }

  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);

    if (hours === 1) {
      return t.notifications.time.hour_ago.replace('{{count}}', String(hours));
    }

    return t.notifications.time.hours_ago.replace('{{count}}', String(hours));
  }

  if (diff < 172800) {
    return t.notifications.time.yesterday;
  }

  const days = Math.floor(diff / 86400);
  return t.notifications.time.days_ago.replace('{{count}}', String(days));
};