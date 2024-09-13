import { createRoot } from 'react-dom/client';
import { App, ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import zhCN from 'antd/es/locale/zh_CN';
import RouteRender from './router';
import '@/assets/styles/global.less';

createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#f759ab',
					colorText: '#FFF'
				}
			}}
			locale={zhCN}
		>
			<App>
				<RouteRender />
			</App>
		</ConfigProvider>
	</BrowserRouter>
);
