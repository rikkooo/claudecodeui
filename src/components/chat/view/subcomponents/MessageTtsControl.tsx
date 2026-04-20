import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authenticatedFetch } from '../../../../utils/api';
import type { Project } from '../../../../types/app';
import { convertMarkdownToPlainText } from '../../utils/markdownToPlainText';

type PlaybackState = 'idle' | 'loading' | 'playing';

// Module-level singleton: only one message plays at a time across the chat.
let currentAudio: HTMLAudioElement | null = null;
let currentStopper: (() => void) | null = null;

const stopCurrent = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }
  if (currentStopper) {
    currentStopper();
    currentStopper = null;
  }
};

type MessageTtsControlProps = {
  content: string;
  selectedProject?: Project | null;
};

const MessageTtsControl = ({ content, selectedProject }: MessageTtsControlProps) => {
  const { t } = useTranslation('chat');
  const [state, setState] = useState<PlaybackState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const reset = useCallback(() => {
    setState('idle');
    if (audioRef.current === currentAudio) {
      currentAudio = null;
      currentStopper = null;
    }
    audioRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current && audioRef.current === currentAudio) {
        stopCurrent();
      }
    };
  }, []);

  const handleClick = useCallback(async () => {
    setErrorMessage(null);

    if (state === 'playing' || state === 'loading') {
      stopCurrent();
      reset();
      return;
    }

    if (!selectedProject) {
      setErrorMessage(t('tts.noProject', { defaultValue: 'No project selected' }));
      return;
    }

    const spokenText = convertMarkdownToPlainText(content);
    if (!spokenText) {
      return;
    }

    stopCurrent();
    setState('loading');

    try {
      const response = await authenticatedFetch(
        `/api/projects/${selectedProject.name}/tts`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: spokenText }),
        },
      );
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || `TTS failed (HTTP ${response.status})`);
      }
      const { audioUrl } = await response.json();
      if (!audioUrl) {
        throw new Error('TTS response missing audio url');
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      currentAudio = audio;
      currentStopper = () => {
        setState('idle');
      };

      audio.addEventListener('ended', () => {
        if (audioRef.current === audio) reset();
      });
      audio.addEventListener('error', () => {
        if (audioRef.current === audio) {
          setErrorMessage(t('tts.playbackFailed', { defaultValue: 'Playback failed' }));
          reset();
        }
      });

      await audio.play();
      setState('playing');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown TTS error';
      console.error('TTS failed:', error);
      setErrorMessage(message);
      reset();
    }
  }, [content, reset, selectedProject, state, t]);

  const title = errorMessage
    ? errorMessage
    : state === 'playing'
      ? t('tts.stop', { defaultValue: 'Stop playback' })
      : state === 'loading'
        ? t('tts.loading', { defaultValue: 'Generating audio…' })
        : t('tts.play', { defaultValue: 'Play as audio' });

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title}
      aria-label={title}
      className="inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
    >
      {state === 'loading' ? (
        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
          <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
        </svg>
      ) : state === 'playing' ? (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="6" width="12" height="12" rx="1.5" />
        </svg>
      ) : (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
};

export default MessageTtsControl;
