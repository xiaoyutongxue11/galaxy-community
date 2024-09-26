import styles from './index.module.less';
import Header from './components/header';
import { MenuIconList } from '@/assets/icons';
import { useState } from 'react';

const Container = () => {
  // 后续使用路径，只要记忆了路径，这个也不会变
  const [activeIndex, setActiveIndex] = useState(0);
  const handleNavigate = (index: number) => {
    setActiveIndex(index);
  };
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <div className={styles.menu}>
          <ul>
            {MenuIconList.map((item, index) => {
              return (
                <li
                  onClick={() => handleNavigate(index)}
                  className={`${activeIndex === index ? styles.active : ''}`}
                >
                  {item.icon}
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles.left}>22</div>
        <div className={styles.center}>33</div>
        <div className={styles.right}>44</div>
      </div>
    </div>
  );
};

export default Container;
