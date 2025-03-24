"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Info, RotateCw, Volume2, VolumeX } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { selectMethodById, useMethodStore } from "@/src/store/methodSlice";
import { useAudioStore } from "@/src/store/sessionAudioSlice";
import { useTimerStore } from "@/src/store/sessionTimerSlice";
import CycleCompletionDialog from "../dialogs/session/CycleCompletionDialog";
import ResetConfirmationDialog from "../dialogs/session/ResetConfirmationDialog";

interface WorkSessionProps {
  methodId: string;
}

const WorkSession = ({ methodId }: WorkSessionProps) => {
  const method = useMethodStore((state) => selectMethodById(state, methodId));
  const [openResetModal, setOpenResetModal] = useState(false);
  
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
    isWorkSession,
    showCompletionDialog,
    isLongBreakFinish,
    startTimer,
    pauseTimer,
    resetTimer,
    setDuration,
    completeCycle,
    closeDialog,
    resetCurrentCycle,
  } = useTimerStore();

  // Initialisation et synchronisation
  useEffect(() => {
    useAudioStore.getState().initializeAudio();
  }, []);
  
  useEffect(() => {
    // Vérifier si le timer n'est pas déjà démarré ou déjà initialisé
    if (method && !isRunning && timeLeft === totalDuration && !showCompletionDialog) {
      const duration = calculateDuration();
      setDuration(duration);
    }
  }, [method]);

  // Gestion des cycles
  useEffect(() => {
    if (method && timeLeft <= 0 && !showCompletionDialog) {
      const nextDuration = calculateDuration();
      setDuration(nextDuration);
      completeCycle(method?.cycles_before_long_break);
    }
  }, [timeLeft, method]);

  // Synchronisation audio-timer
  useEffect(() => {
    if (isRunning !== isPlaying) {
      togglePlayback();
    }
  }, [isRunning]);

  const handleConfirmCycle = () => {
    // Si c'était un long break (après 4 cycles), on réinitialise les cycles
    if (method && !isWorkSession && cyclesCompleted === method.cycles_before_long_break) {
      // Dans le store, completeCycle devrait gérer la réinitialisation (cyclesCompleted = 0) après une longue pause.
      setDuration(calculateDuration());
    } else {
      setDuration(calculateDuration());
    }
    closeDialog();
  };

  const calculateDuration = (): number => {
    if (!method) return 1500;
    const { work_duration, break_duration, long_break_duration, cycles_before_long_break } = method;
    return isWorkSession
      ? work_duration * 60
      : cyclesCompleted > 0 && (cyclesCompleted + 1) % cycles_before_long_break === 0 && isLongBreak
        ? long_break_duration * 60
        : break_duration * 60;
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
    if (isLongBreak) return "#10b981"; // Vert pour les longues pauses
    if (isWorkSession) return "#ef4444"; // Rouge pour les sessions de travail
    return "#3b82f6"; // Bleu pour les pauses courtes
  };
  

  // Messages du dialogue
  const getDialogContent = () =>
    timeLeft > 0
      ? null
      : !isWorkSession && !isLongBreak
      ? {
          title: "🍅 Session terminée",
          description:
            "Votre session de travail est terminée. Prenez une pause bien méritée !",
        }
      : isLongBreak
      ? {
          title: "☕ Pause terminée",
          description:
            "Votre pause est terminée. Vous allez passer à une grande pause.",
        }
      : isLongBreakFinish
      ? {
          title: "🏖️ Pause longue terminée",
          description:
            "Votre longue pause est terminée. Prêt à reprendre une nouvelle session de travail ?",
        }
      : {
          title: "☕ Pause terminée",
          description: "Votre pause est terminée. Prêt à reprendre le travail ?",
        };
  
  
  
  

  const dialogContent = getDialogContent();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
      <div className="flex flex-col gap-3 items-center">
          <CardTitle className="text-center">
            {isLongBreak 
              ? "Pause longue 🏖️" 
              : isWorkSession 
                ? "Travail 💼" 
                : "Pause ☕"}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Cycle: {isLongBreak ? cyclesCompleted + 1 : cyclesCompleted}/{method?.cycles_before_long_break}</span>
            {method && (
              <Popover>
                <PopoverTrigger asChild>
                    <Info className="w-4 h-4 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="">
                  <p className="text-sm">{method.description}</p>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        {/* Timer circulaire */}
        <div className="relative w-64 h-64">
          <CircularProgressbar
            value={(totalDuration - timeLeft) / totalDuration * 100}
            text=""
            styles={buildStyles({
              pathColor: getProgressColor(),
              trailColor: "#e5e7eb",
            })}
          />
          <div className="absolute inset-0 flex items-center justify-center space-x-2">
            <span className="text-[40px] text-[#3a4e6b]">
              {formatTime(timeLeft)}
            </span>
            <RotateCw className="w-6 h-6 cursor-pointer text-gray-300" onClick={resetCurrentCycle} />
          </div>
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
      <CardFooter className="flex justify-center gap-6">
        <Button 
          onClick={isRunning ? pauseTimer : startTimer} 
          variant={isRunning ? "destructive" : "default"}
        >
          {isRunning ? "Pause ⏸" : "Démarrer ▶"}
        </Button>
        <Button variant="outline" onClick={() => setOpenResetModal(true)}>
          Réinitialiser 🔄
        </Button>
      </CardFooter>

       {/* Dialogue de fin de cycle */}
       {dialogContent && (
        <CycleCompletionDialog
          open={showCompletionDialog}
          onConfirm={handleConfirmCycle}
          dialogContent={dialogContent}
        />
      )}

      {/* Dialogue de confirmation pour la réinitialisation */}
      <ResetConfirmationDialog
        open={openResetModal}
        onCancel={() => setOpenResetModal(false)}
        onConfirm={() => {
          resetTimer();
          setOpenResetModal(false);
        }}
      />
    </Card>
  );
};

export default WorkSession;