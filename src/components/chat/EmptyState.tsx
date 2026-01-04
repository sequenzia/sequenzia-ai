'use client';

import { motion } from 'motion/react';
import { useChat } from './ChatProvider';
import { InputComposer } from './InputComposer';
import { Sparkles } from '@/components/ai-elements/sparkles';
import { getAgentMetadataById } from '@/lib/ai/agents.client';
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
  const { agentId, suggestions, sendMessage } = useChat();
  const agentMetadata = getAgentMetadataById(agentId);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Scrollable content area */}
      <div className="flex-1 flex flex-col items-center justify-start pt-[20vh] md:pt-[22vh] p-6 overflow-y-auto">
        <div className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl space-y-6">
          {/* Empty state content */}
          <div className="flex flex-col items-center gap-4 text-center welcome-landscape-hide">
            {/* Hero icon with container */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="size-16 bg-primary rounded-[24px] flex items-center justify-center shadow-xl"
            >
              <Sparkles size={32} className="text-primary-foreground" />
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
              className="space-y-2"
            >
              <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                Welcome to Sequenzia AI
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
                {agentMetadata?.greeting ?? 'Ask me anything!'}
              </p>
            </motion.div>

            {/* Suggestion grid */}
            {suggestions && suggestions.length > 0 && (
              <motion.nav
                variants={prefersReducedMotion ? undefined : staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl mt-4"
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

          {/* Input composer - visible on md+ screens, centered with content */}
          <div className="hidden md:block mt-4">
            <InputComposer hideSuggestions compact />
          </div>
        </div>
      </div>

      {/* Input composer - fixed at bottom on mobile only */}
      <div className="md:hidden">
        <InputComposer hideSuggestions compact />
      </div>
    </div>
  );
}
