"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/src/components/ui/alert-dialog';
import { Volume2, VolumeX } from 'lucide-react';

type TimerType = 'work' | 'break';

const WorkingSession = () => {
  const [time, setTime] = useState<number>(25 * 60);
  const [initialTime, setInitialTime] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timerType, setTimerType] = useState<TimerType>('work');
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [soundVolume, setSoundVolume] = useState<number>(0.5);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const completeAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioQueue = useRef<string[]>([]);
  const currentTrackIndex = useRef<number>(-1);
  
  const ambientSounds: string[] = [
    '/assets/sounds/relax-1.mp3',
    '/assets/sounds/relax-2.mp3',
    '/assets/sounds/relax-3.mp3',
    '/assets/sounds/relax-4.mp3',
    '/assets/sounds/relax-5.mp3',
    '/assets/sounds/relax-6.mp3',
    '/assets/sounds/relax-7.mp3',
    '/assets/sounds/relax-8.mp3',
    '/assets/sounds/relax-9.mp3',
  ];
  
  const shuffleSounds = (): void => {
    const shuffled = [...ambientSounds].sort(() => Math.random() - 0.5);
    audioQueue.current = shuffled;
    currentTrackIndex.current = -1;
  };
  
  const playNextSound = (): void => {
    if (!audioRef.current || !soundEnabled || !isActive) return;
    
    currentTrackIndex.current = (currentTrackIndex.current + 1) % audioQueue.current.length;
    const nextSound = audioQueue.current[currentTrackIndex.current];
    
    audioRef.current.src = nextSound;
    audioRef.current.load();
    audioRef.current.play().catch(e => console.error("Erreur de lecture audio:", e));
  };
  
  useEffect(() => {
    audioRef.current = new Audio();
    completeAudioRef.current = new Audio('/assets/sounds/complete.mp3');
    
    if (audioRef.current) {
      audioRef.current.volume = soundVolume;
      audioRef.current.addEventListener('ended', playNextSound);
    }
    
    if (completeAudioRef.current) {
      completeAudioRef.current.volume = soundVolume;
    }
    
    shuffleSounds();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', playNextSound);
        audioRef.current.pause();
      }
    };
  }, [soundVolume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = soundVolume;
    }
    if (completeAudioRef.current) {
      completeAudioRef.current.volume = soundVolume;
    }
  }, [soundVolume]);

  useEffect(() => {
    if (audioRef.current) {
      if (soundEnabled && isActive) {
        if (audioRef.current.paused) {
          playNextSound();
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [soundEnabled, isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      if (soundEnabled && completeAudioRef.current) {
        completeAudioRef.current.play().catch(e => console.error("Erreur de notification:", e));
      }
      
      setOpenAlert(true);
      const newType: TimerType = timerType === 'work' ? 'break' : 'work';
      const newTime = newType === 'work' ? 25 * 60 : 5 * 60;
      
      setTimerType(newType);
      setTime(newTime);
      setInitialTime(newTime);
      setIsActive(false);
      shuffleSounds();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, timerType, soundEnabled]);

  const toggleTimer = (): void => {
    setIsActive(!isActive);
    if (audioRef.current && soundEnabled) {
      if (!isActive) {
        playNextSound();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const resetTimer = (): void => {
    setIsActive(false);
    setTime(initialTime);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const changeTimerDuration = (minutes: number): void => {
    const seconds = minutes * 60;
    setTime(seconds);
    setInitialTime(seconds);
    setIsActive(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {timerType === 'work' ? 'Séance de travail' : 'Pause'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center">
        <div className="w-64 h-64 mb-4">
          <CircularProgressbar
            value={(initialTime - time) / initialTime * 100}
            text={formatTime(time)}
            styles={buildStyles({
              textSize: '16px',
              pathColor: timerType === 'work' ? '#ef4444' : '#10b981',
              textColor: '#1f2937',
              trailColor: '#e5e7eb',
            })}
          />
        </div>
        
        <Select 
          onValueChange={(value) => changeTimerDuration(parseInt(value))}
          defaultValue="25"
        >
          <SelectTrigger>
            <SelectValue placeholder="Durée" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 minutes</SelectItem>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="25">25 minutes</SelectItem>
            <SelectItem value="45">45 minutes</SelectItem>
            <SelectItem value="60">60 minutes</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="w-full mb-4">
          <div className="flex items-center justify-between mb-2">
            <span>Sons d&apos;ambiance aléatoires</span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-8 w-8"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={soundVolume}
              onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
              disabled={!soundEnabled}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm w-12">{(soundVolume * 100).toFixed(0)}%</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center gap-4">
        <Button 
          onClick={toggleTimer}
          variant={isActive ? "destructive" : "default"}
        >
          {isActive ? 'Pause' : 'Démarrer'}
        </Button>
        <Button variant="outline" onClick={resetTimer}>
          Réinitialiser
        </Button>
      </CardFooter>
      
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Timer terminé</AlertDialogTitle>
            <AlertDialogDescription>
              {timerType === 'work' 
                ? 'Votre session de travail est terminée! Prenez une pause bien méritée.'
                : 'Votre pause est terminée. Prêt à retourner au travail?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default WorkingSession;