'use client';

import PortalButton from './components/portal-button';
import PortalContent from './components/portal-content';
import usePortalState from './hooks/usePortalState';

import './index.css';

interface PortalProps {
  href: '/practice' | '/';
}

export default function Portal({ href }: PortalProps) {
  const { isOpen, setIsOpen, portalRef, buttonRef } = usePortalState();

  return (
    <>
      <PortalButton
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        buttonRef={buttonRef}
      />
      {isOpen && (
        <PortalContent
          setIsOpen={setIsOpen}
          href={href}
          portalRef={portalRef}
          buttonRef={buttonRef}
        />
      )}
    </>
  );
}
