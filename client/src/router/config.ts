// import { lazy } from "react";
import Login from '@/pages/login';
import Register from '@/pages/register';

export interface IRouter {
	name?: string;
	redirect?: string;
	path: string;
	children?: Array<IRouter>;
	component: React.ComponentType;
}

export const router: Array<IRouter> = [
	{
		path: '/login',
		component: Login
	},
	{
		path: '/register',
		component: Register
	}
];
