import { Button, Empty } from 'antd';
import styles from './error.module.less';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className={styles.bgContainer}>
      <Empty description={false} />
      <div className={styles.status}>404</div>
      <div className={styles.message}>糟糕，走丢了~</div>
      <Button onClick={handleBack}>返回上一页</Button>
    </div>
  );
};

export default Error;
