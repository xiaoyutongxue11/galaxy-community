import styles from './index.module.less';

interface BgContainerProps {
  children?: React.ReactNode;
}
const BgContainer: React.FC<BgContainerProps> = ({ children }) => {
  return <div className={styles.bgContainer}>{children}</div>;
};

export default BgContainer;
