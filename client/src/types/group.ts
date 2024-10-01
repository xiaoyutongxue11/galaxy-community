// 群聊成员信息类型
interface IGroupChatMemberItem {
  avatar: string;
  created_at: string;
  lastMessageTime: string | null;
  username: string;
  name: string;
  nickname: string;
  user_id: number;
}
// 群聊信息类型
export interface IGroupChatInfo {
  announcement: string;
  avatar: string;
  created_at: string;
  creator_id: number;
  creator_username: string;
  id: number;
  name: string;
  room: string;
  members: IGroupChatMemberItem[];
}
