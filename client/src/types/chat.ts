import { IFriendInfo } from './friend';
import { IGroupChatInfo } from './group';
// 聊天列表组件传递的props
export interface IChatListProps {
  initSelectChat: IFriendInfo | IGroupChatInfo | null;
}
// 聊天页面组件实例类型
export interface IChatRef {
  refreshChatList: () => void;
}
