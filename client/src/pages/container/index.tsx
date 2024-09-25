import styles from './index.module.less';
import Header from './components/header';
const Container = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <div className={styles.menu}>11</div>
        <div className={styles.left}>22</div>
        <div className={styles.center}>33</div>
        <div className={styles.right}>44</div>
      </div>
    </div>
  );
};

export default Container;
