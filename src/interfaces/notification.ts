import { NotificationType } from 'src/enums/notification';

export interface INotificationNotifyOptions {
  type: NotificationType;
  destination: string;
  message: any;
  headers?: any;
}
