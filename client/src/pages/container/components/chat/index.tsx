import styles from './index.module.less';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import Logo from '@/assets/img/star.png';
const Chat = () => {
  return (
    <>
      <div className={styles.left}>
        <div className={styles.search}>
          <Input
            placeholder="请输入"
            allowClear
            prefix={<SearchOutlined />}
            style={{ backgroundColor: 'transparent', width: '80%' }}
          />
          <PlusCircleOutlined style={{ fontSize: '1rem' }} />
        </div>
        <div className={styles.list}>
          {Array.from({ length: 15 }, (_, index) => (
            <div className={styles.listItem} key={index}>
              <img src={Logo} />
              <div className={styles.info}>
                <div className={styles.infoTop}>
                  <p>xiaoyutongxuehahahhahahahahhaaaa</p>
                  <span>2024/9/8</span>
                </div>
                <p className={styles.infoBottom}>
                  今天复合地基刷个卡世界观和手机阿嘎户籍卡三打哈估计gfsgg
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.center}>chat</div>
      <div className={styles.right}>chat</div>
    </>
  );
};

export default Chat;
