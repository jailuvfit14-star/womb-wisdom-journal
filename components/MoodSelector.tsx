/**
 * MoodSelector Component
 * Beautiful mood selector with icons and soft womb-healing colors
 */

'use client';

import { MoodType } from '@/types/journal';
import { Moon, Sun, Heart, Waves, Sparkles, Flower2 } from 'lucide-react';

interface MoodOption {
  type: MoodType;
  label: string;
  icon: React.ReactNode;
  bgColor: string;
  hoverColor: string;
  selectedColor: string;
  iconColor: string;
}

const moodOptions: MoodOption[] = [
  {
    type: 'peaceful',
    label: 'Peaceful',
    icon: <Moon size={18} />,
    bgColor: 'bg-blush-100',
    hoverColor: 'hover:bg-blush-200',
    selectedColor: 'bg-blush-300 ring-2 ring-blush-400',
    iconColor: 'text-blush-600',
  },
  {
    type: 'joyful',
    label: 'Joyful',
    icon: <Sun size={18} />,
    bgColor: 'bg-clay-100',
    hoverColor: 'hover:bg-clay-200',
    selectedColor: 'bg-clay-300 ring-2 ring-clay-400',
    iconColor: 'text-clay-600',
  },
  {
    type: 'tender',
    label: 'Tender',
    icon: <Heart size={18} />,
    bgColor: 'bg-blush-50',
    hoverColor: 'hover:bg-blush-100',
    selectedColor: 'bg-blush-200 ring-2 ring-blush-400',
    iconColor: 'text-blush-500',
  },
  {
    type: 'reflective',
    label: 'Reflective',
    icon: <Waves size={18} />,
    bgColor: 'bg-cocoa-100',
    hoverColor: 'hover:bg-cocoa-200',
    selectedColor: 'bg-cocoa-300 ring-2 ring-cocoa-400',
    iconColor: 'text-cocoa-600',
  },
  {
    type: 'creative',
    label: 'Creative',
    icon: <Sparkles size={18} />,
    bgColor: 'bg-clay-100',
    hoverColor: 'hover:bg-clay-200',
    selectedColor: 'bg-clay-200 ring-2 ring-clay-500',
    iconColor: 'text-clay-500',
  },
  {
    type: 'nurturing',
    label: 'Nurturing',
    icon: <Flower2 size={18} />,
    bgColor: 'bg-blush-100',
    hoverColor: 'hover:bg-blush-200',
    selectedColor: 'bg-blush-200 ring-2 ring-blush-500',
    iconColor: 'text-blush-500',
  },
];

interface MoodSelectorProps {
  selectedMood?: MoodType;
  onMoodChange: (mood: MoodType | undefined) => void;
  compact?: boolean;
}

export default function MoodSelector({
  selectedMood,
  onMoodChange,
  compact = false,
}: MoodSelectorProps) {
  return (
    <div className="space-y-2">
      {!compact && (
        <label className="block text-sm font-sans font-medium text-cocoa-600">
          How are you feeling?
        </label>
      )}
      <div className={`grid ${compact ? 'grid-cols-6 gap-1' : 'grid-cols-3 gap-2'}`}>
        {moodOptions.map((mood) => {
          const isSelected = selectedMood === mood.type;
          return (
            <button
              key={mood.type}
              type="button"
              onClick={() => onMoodChange(isSelected ? undefined : mood.type)}
              className={`
                flex flex-col items-center justify-center gap-1.5 p-3 rounded-soft
                transition-all duration-200 font-sans text-xs
                ${mood.bgColor} ${mood.hoverColor} ${mood.iconColor}
                ${isSelected ? mood.selectedColor : ''}
                ${compact ? 'p-2' : 'p-3'}
              `}
              title={mood.label}
            >
              <span className={isSelected ? 'scale-110' : ''}>
                {mood.icon}
              </span>
              {!compact && (
                <span className={`font-medium ${isSelected ? 'font-semibold' : ''}`}>
                  {mood.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * MoodIcon - Small component for displaying mood icon in other components
 */
export function MoodIcon({ mood, size = 16 }: { mood: MoodType; size?: number }) {
  const moodOption = moodOptions.find((m) => m.type === mood);
  if (!moodOption) return null;

  return (
    <div
      className={`inline-flex items-center justify-center p-1.5 rounded-full ${moodOption.bgColor} ${moodOption.iconColor}`}
      title={moodOption.label}
    >
      {size === 16 && <span className="inline-block">{moodOption.icon}</span>}
      {size !== 16 && (
        <span className="inline-block" style={{ transform: `scale(${size / 18})` }}>
          {moodOption.icon}
        </span>
      )}
    </div>
  );
}
