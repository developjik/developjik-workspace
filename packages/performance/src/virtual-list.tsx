"use client";

import React, { memo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  itemKey?: (item: T, index: number) => string | number;
}

interface ListItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    items: any[];
    renderItem: (item: any, index: number) => React.ReactNode;
  };
}

const ListItem = memo<ListItemProps>(({ index, style, data }) => {
  const { items, renderItem } = data;
  const item = items[index];
  
  return (
    <div style={style}>
      {renderItem(item, index)}
    </div>
  );
});

ListItem.displayName = 'ListItem';

/**
 * High-performance virtual list component for rendering large datasets
 */
export function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  className,
  itemKey
}: VirtualListProps<T>) {
  const itemData = {
    items,
    renderItem,
  };

  const getItemKey = useCallback(
    (index: number) => {
      if (itemKey) {
        return itemKey(items[index], index);
      }
      return index;
    },
    [items, itemKey]
  );

  return (
    <div className={className} style={{ height: '400px', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            itemCount={items.length}
            itemSize={itemHeight}
            itemData={itemData}
            itemKey={getItemKey}
          >
            {ListItem}
          </List>
        )}
      </AutoSizer>
    </div>
  );
}

/**
 * Hook for creating optimized list item renderers
 */
export function useOptimizedRenderer<T>(
  renderFunction: (item: T, index: number) => React.ReactNode
) {
  return useCallback(renderFunction, []);
}