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
          <div className={styles.item}>
            <img src={Logo} style={{ width: '2rem', height: '2rem' }} />
            <div className={styles.info}>
              <p style={{ fontWeight: 'bold' }}>xiaoyutongxue</p>
              <p style={{ fontSize: '10px', color: '#aaa' }}>今天很开心</p>
            </div>
          </div>
          <div className={styles.item}>
            <img src={Logo} style={{ width: '2rem', height: '2rem' }} />
            <div className={styles.info}>
              <p style={{ fontWeight: 'bold' }}>xiaoyutongxue</p>
              <p style={{ fontSize: '10px', color: '#aaa' }}>今天很开心</p>
            </div>
          </div>
          <div className={styles.item}>
            <img src={Logo} style={{ width: '2rem', height: '2rem' }} />
            <div className={styles.info}>
              <p style={{ fontWeight: 'bold' }}>xiaoyutongxue</p>
              <p style={{ fontSize: '10px', color: '#aaa' }}>今天很开心</p>
            </div>
          </div>
          <div className={styles.item}>
            <img src={Logo} style={{ width: '2rem', height: '2rem' }} />
            <div className={styles.info}>
              <p style={{ fontWeight: 'bold' }}>xiaoyutongxue</p>
              <p style={{ fontSize: '10px', color: '#aaa' }}>今天很开心</p>
            </div>
          </div>
          <div className={styles.item}>
            <img src={Logo} style={{ width: '2rem', height: '2rem' }} />
            <div className={styles.info}>
              <p style={{ fontWeight: 'bold' }}>xiaoyutongxue</p>
              <p style={{ fontSize: '10px', color: '#aaa' }}>今天很开心</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.center}>chat</div>
      <div className={styles.right}>chat</div>
    </>
  );
};

export default Chat;
