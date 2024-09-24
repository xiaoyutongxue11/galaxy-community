import styles from './index.module.less';
import Header from './components/header';
const Container = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div>
        <div className="left"></div>
        <div className="center"></div>
        <div className="right"></div>
      </div>
    </div>
  );
};

export default Container;
