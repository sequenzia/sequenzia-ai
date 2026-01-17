'use client';

import { motion } from 'motion/react';
import { useChat } from './ChatProvider';
import { InputComposer } from './InputComposer';
import { PORTFOLIO_GREETING } from '@/lib/portfolio/config';
import { SITE_NAME } from '@/config';
import { useReducedMotion } from '@/lib/motion/hooks';
import { staggerContainer, staggerItem } from '@/lib/motion/variants';
import { cn } from '@/lib/utils';
import {
  LightbulbIcon,
  UserIcon,
  BriefcaseIcon,
  RocketIcon,
  GraduationCapIcon,
  ZapIcon,
  MailIcon,
  CodeIcon,
  BarChartIcon,
  FileTextIcon,
  PenLineIcon,
  SearchIcon,
  SparklesIcon,
  GlobeIcon,
} from 'lucide-react';

// Get icon based on suggestion content
function getSuggestionIcon(text: string) {
  const lowerText = text.toLowerCase();

  // Portfolio-specific suggestions
  if (lowerText.includes('bio') || lowerText.includes('about me'))
    return UserIcon;
  if (lowerText.includes('experience') || lowerText.includes('work history'))
    return BriefcaseIcon;
  if (lowerText.includes('project'))
    return RocketIcon;
  if (lowerText.includes('education') || lowerText.includes('degree'))
    return GraduationCapIcon;
  if (lowerText.includes('skill'))
    return ZapIcon;
  if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('reach'))
    return MailIcon;

  // General suggestions
  if (lowerText.includes('web') || lowerText.includes('search') || lowerText.includes('internet') || lowerText.includes('news') || lowerText.includes('latest'))
    return GlobeIcon;
  if (lowerText.includes('code') || lowerText.includes('function') || lowerText.includes('build'))
    return CodeIcon;
  if (lowerText.includes('chart') || lowerText.includes('graph') || lowerText.includes('visualiz'))
    return BarChartIcon;
  if (lowerText.includes('form') || lowerText.includes('input') || lowerText.includes('survey'))
    return FileTextIcon;
  if (lowerText.includes('help') || lowerText.includes('explain') || lowerText.includes('how'))
    return LightbulbIcon;
  if (lowerText.includes('write') || lowerText.includes('create') || lowerText.includes('generate'))
    return PenLineIcon;
  if (lowerText.includes('analyze') || lowerText.includes('review') || lowerText.includes('check'))
    return SearchIcon;

  return SparklesIcon;
}

export function EmptyState() {
  const { suggestions, sendMessage } = useChat();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Scrollable content area */}
      <div className="flex-1 flex flex-col items-center justify-start pt-[20vh] md:pt-[22vh] p-6 overflow-y-auto">
        <div className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
          {/* Empty state content */}
          <div className="flex flex-col items-center gap-4 text-center welcome-landscape-hide">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
              className="space-y-2"
            >
              <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                Welcome to {SITE_NAME}
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
                {PORTFOLIO_GREETING}
              </p>
            </motion.div>

          </div>

          {/* Input composer - visible on md+ screens, centered with content */}
          <div className="hidden md:block mt-6">
            <InputComposer hideSuggestions compact />
          </div>

          {/* Suggestion grid - below input (desktop only) */}
          {suggestions && suggestions.length > 0 && (
            <motion.nav
              variants={prefersReducedMotion ? undefined : staggerContainer}
              initial="hidden"
              animate="visible"
              className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl mx-auto -mt-4"
              aria-label="Quick start suggestions"
            >
              {suggestions.map((s, index) => {
                const Icon = getSuggestionIcon(s.label);
                return (
                  <motion.button
                    key={s.label}
                    variants={prefersReducedMotion ? undefined : staggerItem}
                    onClick={() => sendMessage(s.prompt ?? s.label)}
                    className={cn(
                      'group p-3 min-h-[44px] bg-card border border-border rounded-xl',
                      'hover:border-accent/50 hover:bg-accent/5 hover:shadow-sm',
                      'transition-all duration-200 text-left',
                      'flex items-center gap-3 justify-center'
                    )}
                  >
                    <Icon className="size-4 text-accent flex-shrink-0" />
                    <span className="text-xs font-medium text-foreground truncate">
                      {s.label}
                    </span>
                  </motion.button>
                );
              })}
            </motion.nav>
          )}
        </div>
      </div>

      {/* Input composer and suggestions - fixed at bottom on mobile only */}
      <div className="md:hidden">
        <InputComposer hideSuggestions compact />
        {/* Mobile suggestion grid */}
        {suggestions && suggestions.length > 0 && (
          <motion.nav
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3 px-4 -mt-4 pb-4 pb-[calc(1rem+var(--safe-area-inset-bottom))]"
            aria-label="Quick start suggestions"
          >
            {suggestions.map((s, index) => {
              const Icon = getSuggestionIcon(s.label);
              return (
                <motion.button
                  key={s.label}
                  variants={prefersReducedMotion ? undefined : staggerItem}
                  onClick={() => sendMessage(s.prompt ?? s.label)}
                  className={cn(
                    'group p-3 min-h-[44px] bg-card border border-border rounded-xl',
                    'hover:border-accent/50 hover:bg-accent/5 hover:shadow-sm',
                    'transition-all duration-200 text-left',
                    'flex items-center gap-3 justify-center'
                  )}
                >
                  <Icon className="size-4 text-accent flex-shrink-0" />
                  <span className="text-xs font-medium text-foreground truncate">
                    {s.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.nav>
        )}
      </div>
    </div>
  );
}
