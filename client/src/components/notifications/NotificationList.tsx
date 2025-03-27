
import { useNotifications } from '@/hooks/use-notifications';
import { formatDistanceToNow } from 'date-fns';
import { Bell } from 'lucide-react';

export function NotificationList() {
  const { notifications } = useNotifications();

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bell className="w-8 h-8 mx-auto mb-2" />
          <p>No notifications yet</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${
              notification.read ? 'bg-white' : 'bg-blue-50'
            }`}
          >
            <h3 className="font-medium">{notification.title}</h3>
            <p className="text-gray-600 mt-1">{notification.message}</p>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
