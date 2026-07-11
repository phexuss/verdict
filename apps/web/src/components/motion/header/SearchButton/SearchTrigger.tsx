import { Search } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchTriggerProps {
  onClick: () => void;
  t: (key: string) => string;
}

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const iconVariants = {
  initial: { rotate: 0, scale: 1, x: 0, y: 0 },
  hover: { rotate: -10, scale: 1.05, x: -1, y: -1 },
};

export function SearchTrigger({ onClick, t }: SearchTriggerProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-4xl text-foreground transition-colors hover:bg-accent"
      aria-label={t('search.open')}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <motion.div
        variants={iconVariants}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <Search className="size-5" />
      </motion.div>
    </motion.button>
  );
}
