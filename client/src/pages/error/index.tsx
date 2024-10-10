import { Button, Empty } from 'antd';
import styles from './error.module.less';
import { useNavigate } from 'react-router-dom';
import BgContainer from '@/components/bgContainer';

const Error = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <BgContainer>
      <Empty description={false} />
      <div className={styles.status}>404</div>
      <div className={styles.message}>糟糕，走丢了~</div>
      <Button onClick={handleBack} type="primary">
        返回上一页
      </Button>
    </BgContainer>
  );
};

export default Error;
