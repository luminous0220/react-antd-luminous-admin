import { IOpenOptions } from "@/components/AlertDialogProvider/AlertDialogProvider";
import { MessageInstance } from "antd/es/message/interface";
import { HookAPI } from "antd/es/modal/useModal";
import { NotificationInstance } from "antd/es/notification/interface";

declare global {
  interface Window {
    $message: MessageInstance;
    $notification: NotificationInstance;
    $modal: HookAPI;
    $showDialog: (options: IOpenOptions) => void;
  }
}
