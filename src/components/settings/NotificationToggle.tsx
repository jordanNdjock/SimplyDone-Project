"use client";

import React from "react";
import { Bell } from "lucide-react";
import { Switch } from "../ui/switch";
import { usePrefUserStore } from "@/src/store/prefUserSlice";

export function NotificationToggle() {
  const { notification_Subscribed, setNotificationSubscribed } = usePrefUserStore((state) => state);
  console.log(notification_Subscribed)
  const handleSwitchChange = (checked: boolean) => {
    console.log(checked)
    setNotificationSubscribed(checked);
  };

  return (
    <div className="border shadow-sm rounded-lg">
      <div className="flex items-center rounded-md p-3">
        <Bell className="text-gray-300 mr-3" />
        <span className="flex-1">Notifications</span>
        <Switch
          className="mr-2"
          checked={notification_Subscribed}
          onCheckedChange={handleSwitchChange}
        />
      </div>
    </div>
  );
}
