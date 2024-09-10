import { Route, Navigate, Routes } from "react-router-dom";
import { IRouter, router } from "./config";
import { Suspense, useMemo } from "react";

const RouteRender = () => {
  const routeRender = (router: Array<IRouter>) => {
    return router.map((item) => {
      return (
        <Route
          key={item.name || item.path}
          path={item.path}
          element={
            item.redirect ? (
              <Navigate to={item.redirect} />
            ) : (
              <Suspense>
                <item.component />
              </Suspense>
            )
          }
        >
          {item.children && routeRender(item.children)}
        </Route>
      );
    });
  };

  // 使用 useMemo 来记忆 router 的映射结果，避免每次都重新渲染计算
  const routes = useMemo(() => {
    return routeRender(router);
  }, [router]);

  return <Routes>{routes}</Routes>;
};

export default RouteRender;
