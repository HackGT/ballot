import React from 'react';

interface PageAdminProjectsEpicenterEmptyDotProps {
  solid: boolean;
}

const PageAdminProjectsEpicenterEmptyDot: React.FC<PageAdminProjectsEpicenterEmptyDotProps> = (props) => {
  return (
    <div
      className='dot'
      style={{
        display: 'inline-block',
        margin: 2,
        minWidth: 60,
        width: 60,
        height: 60,
        borderWidth: 2,
        lineHeight: '40px',
        userSelect: 'none',
        MozUserSelect: 'none',
        cursor: 'pointer',
        opacity: 0.5,
        borderStyle: props.solid ? 'solid' : 'dashed',
      }} />
  )
}

export default PageAdminProjectsEpicenterEmptyDot;
