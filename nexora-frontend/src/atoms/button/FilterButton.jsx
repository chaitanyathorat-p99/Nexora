import React, { cloneElement, isValidElement, useEffect, useRef, useState } from 'react';
import { Button, Menu } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const FilterButton = ({ label, customContent, options = [], onSelect, icon, active, ...buttonProps }) => {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleDocumentClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [open]);

  const menu = (
    <Menu onClick={(info) => onSelect(info.key)}>
      {options.map((option) => (
        <Menu.Item key={option.value}>
          {option.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  const overlayContent = isValidElement(customContent)
    ? cloneElement(customContent, { onClose: () => setOpen(false) })
    : customContent || menu;

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <Button
        {...buttonProps}
        icon={icon || <FilterOutlined />}
        className={active ? 'filter-btn-active' : ''}
        onClick={() => setOpen((current) => !current)}
      >
        {label}
      </Button>
      {open && (
        <div
          style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 1000 }}
          onClick={(event) => event.stopPropagation()}
        >
          {overlayContent}
        </div>
      )}
    </div>
  );
};

export default FilterButton;
