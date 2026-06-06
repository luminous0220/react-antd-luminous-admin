import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router";
import { CFG } from "@/constants";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在。请检查网址或返回首页"
      extra={
        <Button type="primary" size="large" onClick={() => navigate(CFG.HOME_PATH)}>
          返回首页
        </Button>
      }
    />
  );
};

export default NotFound;
