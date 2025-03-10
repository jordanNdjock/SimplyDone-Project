"use client";
import React, { useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";
import { Volume2, VolumeX } from "lucide-react";
import { selectMethodById, useMethodStore } from "@/src/store/methodSlice";
import { useAudioStore } from "@/src/store/sessionAudioSlice";
import { useTimerStore } from "@/src/store/sessionTimerSlice";

interface WorkSessionProps {
  methodId: string;
}

const WorkSession = ({ methodId }: WorkSessionProps) => {
  const method = useMethodStore((state) => selectMethodById(state, methodId));
  
  // Audio Store
  const {
    soundEnabled,
    soundVolume,
    toggleSound,
    updateVolume,
    togglePlayback,
    isPlaying
  } = useAudioStore();

  // Timer Store
  const {
    timeLeft,
    totalDuration,
    isRunning,
    cyclesCompleted,
    isLongBreak,
    showCompletionDialog,
    startTimer,
    pauseTimer,
    resetTimer,
    setDuration,
    completeCycle,
    checkTimerState
  } = useTimerStore();

  // Initialisation et synchronisation
  useEffect(() => {
    useAudioStore.getState().initializeAudio();
  }, []);
  
  useEffect(() => {
    // Vérifier si le timer n'est pas déjà démarré ou déjà initialisé
    if (method && !isRunning && timeLeft === totalDuration) {
      const duration = calculateDuration();
      setDuration(duration);
    }
  }, [method]);

  // Gestion des cycles
  useEffect(() => {
    if (method && timeLeft <= 0) {
      const nextDuration = calculateDuration();
      setDuration(nextDuration);
      completeCycle();
    }
  }, [timeLeft, method]);

  // Synchronisation audio-timer
  useEffect(() => {
    if (isRunning !== isPlaying) {
      togglePlayback();
    }
  }, [isRunning]);

  // Calcul de la durée en fonction du cycle
  const calculateDuration = () => {
    if (!method) return 1500;
    
    const isBreakTime = cyclesCompleted % method.cycles_before_long_break === 0 && cyclesCompleted > 0;
    return isLongBreak 
      ? method.long_break_duration * 60 
      : isBreakTime 
      ? method.break_duration * 60 
      : method.work_duration * 60;
  };

  // Formatage du temps
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Gestion du volume
  const handleVolumeChange = (volume: number) => {
    updateVolume(volume);
    if (volume === 0 && soundEnabled) {
      toggleSound();
    } else if (volume > 0 && !soundEnabled) {
      toggleSound();
    }
  };

  // Couleur du timer en fonction du type de session
  const getProgressColor = () => {
    if (!method) return "#ef4444";
    return isLongBreak 
      ? "#10b981" // Vert pour les longues pauses
      : timeLeft <= method.work_duration * 60 
      ? "#ef4444" // Rouge pour le travail
      : "#3b82f6"; // Bleu pour les pauses
  };

  // Messages du dialogue
  const getDialogContent = () => {
    if (timeLeft > 0) return null;
    
    return isLongBreak
      ? {
          title: "Pause longue terminée",
          description: "Votre pause longue est terminée. Prêt à reprendre le travail ?"
        }
      : method && cyclesCompleted % method.cycles_before_long_break === 0
      ? {
          title: "Pause terminée",
          description: "Votre pause est terminée. Prêt à reprendre le travail ?"
        }
      : {
          title: "Session terminée",
          description: "Votre session de travail est terminée. Prenez une pause bien méritée !"
        };
  };

  const dialogContent = getDialogContent();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {isLongBreak 
            ? "Pause longue" 
            : method && timeLeft <= method.work_duration * 60 
            ? "Travail" 
            : "Pause"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        {/* Timer circulaire */}
        <div className="w-64 h-64">
          <CircularProgressbar
            value={(totalDuration - timeLeft) / totalDuration * 100}
            text={formatTime(timeLeft)}
            styles={buildStyles({
              pathColor: getProgressColor(),
              textColor: "#1f2937",
              trailColor: "#e5e7eb",
              textSize: '16px',
            })}
          />
        </div>

        {/* Contrôle du volume */}
        <div className="mt-4 flex items-center gap-2">
          <Button variant="ghost" onClick={toggleSound} className="h-8 w-8">
            {soundEnabled && soundVolume > 0 ? <Volume2 /> : <VolumeX />}
          </Button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={soundVolume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>
      </CardContent>

      {/* Contrôles principaux */}
      <CardFooter className="flex justify-center gap-4">
        <Button 
          onClick={isRunning ? pauseTimer : startTimer} 
          variant={isRunning ? "destructive" : "default"}
        >
          {isRunning ? "Pause" : "Démarrer"}
        </Button>
        <Button variant="outline" onClick={resetTimer}>
          Réinitialiser
        </Button>
      </CardFooter>

      {/* Dialogue de notification */}
      {dialogContent && (
        <AlertDialog open={showCompletionDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dialogContent.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={resetTimer}>
                {isLongBreak ? "Reprendre" : "OK"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
};

export default WorkSession;