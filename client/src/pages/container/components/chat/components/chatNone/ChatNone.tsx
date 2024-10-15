import { WechatWorkOutlined } from '@ant-design/icons';
import styles from './index.module.less';

const ChatNone = () => {
  return (
    <div className={styles.chatNone}>
      <WechatWorkOutlined className={styles.icon} />
    </div>
  );
};

export default ChatNone;
