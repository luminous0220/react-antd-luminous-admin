/* eslint-disable */
import { App } from "antd";

import React from "react";

// 定义全局实例变量

// 创建一个组件来获取App实例
const MessageHolder: React.FC = () => {
  const { message, modal, notification } = App.useApp();

  // 将实例挂载到window对象上
  window.$message = message;
  window.$notification = notification;
  window.$modal = modal;
  return null;
};

export { MessageHolder };
