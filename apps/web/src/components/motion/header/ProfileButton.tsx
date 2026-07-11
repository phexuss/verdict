'use client';

import { Button } from '@repo/ui/components/button';
import { UserLinear } from '@solar-icons/react-perf';
import { motion } from 'motion/react';
import { Link } from '@/i18n/navigation';

const MotionButton = motion.create(Button);

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const iconVariants = {
  initial: { y: 0, scale: 1 },
  hover: { y: -2, scale: 1.05 },
};

export function ProfileButton() {
  return (
    <MotionButton
      asChild
      variant="ghost"
      size="icon"
      className="hidden transition-colors hover:bg-accent md:flex"
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Link href="/profile" aria-label="Profile">
        <motion.div
          variants={iconVariants}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <UserLinear className="size-4 text-foreground md:size-5" />
        </motion.div>
      </Link>
    </MotionButton>
  );
}
