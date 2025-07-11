"use client";
import { usePrefUserStore } from "@/src/store/prefUserSlice";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import SubscribeToNotificationsButton from "../../SubscribeToNotificationButton";
import { selectUser, useAuthStore } from "@/src/store/authSlice";

export default function SubscribeToNotificationDialog() {
    const user = useAuthStore(selectUser);
     const [open, setOpen] = useState(false);
     const { notification_Subscribed } = usePrefUserStore((state) => state);

    useEffect(() => {
        if (notification_Subscribed) setOpen(false);
        else{ 
            if(user?.hasSeenIntro === true){
                setOpen(true)
            }
        };
    }, [notification_Subscribed]);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md max-w-xs rounded-lg">
                <DialogHeader>
                <DialogTitle className="mb-1"> Activer les notifications</DialogTitle>
                <DialogDescription>
                    📢 Activez les notifications pour recevoir des rappels utiles sur vos tâches, vos échéances ou d’autres
                    événements importants. ✨
                </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-4">
                    <Button onClick={() => setOpen(false)} className="border-none outline-none bg-transparent">
                        ⏰ Plutard
                    </Button>
                    <SubscribeToNotificationsButton />
                </DialogFooter>
      </DialogContent>
    </Dialog>
    );

}