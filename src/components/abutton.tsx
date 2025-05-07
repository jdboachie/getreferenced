'use client';

import * as React from 'react';
import { motion } from 'framer-motion'
import { AnimatedState } from './motion/animated-state';
import { buttonVariants } from './ui/button';

const APButton = () => {

  const [buttonState, setButtonState] = React.useState<'ready' | 'pending' | 'sent'>('ready')

  const handleClick = () => {
    setButtonState('pending')
    setTimeout(() => {
      setButtonState('sent')
      setTimeout(() => {
        setButtonState('ready')
      }, 2000);
    }, 5000);
  }

  return (
    <motion.button
      type='submit'
      disabled={buttonState === 'pending'}
      className={`${buttonVariants({size: 'lg'})} w-full`}
      whileTap={{ scale: 0.99, y: 2 }}
      onClick={handleClick}
    >
      <AnimatedState>
        {buttonState === 'ready' && <>Submit form</>}
        {buttonState === 'pending' && <span className='flex items-center justify-center gap-1.5'>
          <svg stroke="currentColor" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g>
              <rect x="11" y="1" width="1" height="5" opacity=".14" />
              <rect x="11" y="1" width="1" height="5" transform="rotate(30 12 12)" opacity=".29" />
              <rect x="11" y="1" width="1" height="5" transform="rotate(60 12 12)" opacity=".43" />
              <rect x="11" y="1" width="1" height="5" transform="rotate(90 12 12)" opacity=".57" />
              <rect x="11" y="1" width="1" height="5" transform="rotate(120 12 12)" opacity=".71" />
              <rect x="11" y="1" width="1" height="5" transform="rotate(150 12 12)" opacity=".86" />
              <rect x="11" y="1" width="1" height="5" transform="rotate(180 12 12)" />
              <animateTransform attributeName="transform" type="rotate" calcMode="discrete" dur="0.6s" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" repeatCount="indefinite" />
            </g>
          </svg>
          Creating 3 requests
        </span>}
        {buttonState === 'sent' && <motion.span key={'sent'}>Created successfully!</motion.span>}
      </AnimatedState>
    </motion.button>
  )
}

export default APButton