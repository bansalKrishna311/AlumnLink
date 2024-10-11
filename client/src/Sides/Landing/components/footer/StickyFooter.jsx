import React from 'react';
import Content from './Content';

export default function StickyFooter() {
  return (
    <div 
      className='relative bg-base-200 h-[60vh] '
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className='fixed bottom-0 h-[800px] w-full'>
        <Content />
      </div>
    </div>
  );
}
