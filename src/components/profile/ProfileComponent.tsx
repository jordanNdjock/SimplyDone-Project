"use client";

import React, { useState, useRef } from "react";
import { useAuthStore, selectUser } from "@/src/store/authSlice";
import { AvatarsBucketId, ID, storage } from "@/src/lib/appwrite";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Camera, Trash2, Edit, LoaderCircle } from "lucide-react";
import { getInitials, getOriginalImageUrl } from "@/src/utils/utils";
import { toast } from "@/src/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/src/components/ui/alert-dialog";
import BackToPage from '../layout/BackToPage';

const ProfileComponent: React.FC = () => {
  const user = useAuthStore(selectUser);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [username, setUsername] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(getOriginalImageUrl(user?.avatarUrl ?? "") || "");
  const [avatarId, setAvatarId] = useState(getOriginalImageUrl(user?.avatarId ?? "") || "");
  const [loading, setLoading] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUsernameChange = async () => {
    if (!username.trim()) return;
    setLoading(true);
    try {
      await updateProfile(username, avatar, avatarId);
      toast({
        title: "Nom d'utilisateur mis à jour avec succès !",
        variant: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom :", error);
      toast({
        title: "Erreur lors de la mise à jour du nom",
        variant: "error",
      });
    }
    setLoading(false);
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLoadingAvatar(true);
      try {
        const file = event.target.files[0];
        if(avatarId){
          await storage.deleteFile(AvatarsBucketId, avatarId);
        }
        const response = await storage.createFile(AvatarsBucketId, ID.unique(), file);
        let fileUrl = storage.getFilePreview(AvatarsBucketId, response.$id);
        fileUrl = getOriginalImageUrl(fileUrl) ?? "";
        setAvatar(fileUrl);
        setAvatarId(response.$id);
        await updateProfile(username, fileUrl, response.$id);
        toast({
          title: "Avatar mis à jour avec succès!",
          variant: "success",
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'avatar :", error);
        toast({
          title: "Erreur lors de la mise à jour de l'avatar",
          variant: "error",
        });
      }
      setLoadingAvatar(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      console.log("Compte supprimé !");
    } catch (error) {
      console.error("Erreur lors de la suppression du compte :", error);
      toast({
        title: "Erreur lors de la suppression du compte",
        variant: "error",
      });
    }
    setLoading(false);
  };

  return (
  <>
     
    <BackToPage title="Mon compte" />
    <div className="flex flex-col items-center justify-start space-y-6 p-6">
      <div className="relative">
        <Avatar className="h-32 w-32 rounded-full border-2 border-gray-200 hover:border-gray-500 transition duration-300">
          <AvatarImage src={avatar} alt={user?.name} />
          <AvatarFallback className="text-xl font-bold bg-gray-200 text-gray-600">
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>
        <Button
          className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          {loadingAvatar ?
                <LoaderCircle className="animate-spin text-blue-500" size={20} />
             : <Camera className="w-5 h-5 text-gray-700" />
          }
        </Button>
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          disabled={loading}
        />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Modifier le nom d&apos;utilisateur</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-3">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nouveau nom"
            disabled={loading}
          />
          <Button onClick={handleUsernameChange} disabled={loading} variant="default" className="bg-accent hover:bg-purple-700 dark:bg-primary dark:hover:bg-blue-700 ">
            {loading ?  
                <LoaderCircle className="animate-spin" size={20} />
             : <Edit className="w-5 h-5" />
            }
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md border-red-500">
        <CardHeader>
          <CardTitle className="text-red-500">Supprimer le compte</CardTitle>
        </CardHeader>
        <CardContent>
        <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full flex items-center justify-center"
              >
                <Trash2 className="mr-2 w-5 h-5" />
                Supprimer mon compte
              </Button>
            </AlertDialogTrigger>
            
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer votre compte ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Toutes vos données seront supprimées définitivement.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700" disabled>
                  Confirmer la suppression
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>

          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  </>
  );
};

export default ProfileComponent;
