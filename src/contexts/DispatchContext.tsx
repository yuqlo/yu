import type { Dispatch } from 'react';
import { createContext } from 'react';

export const DispatchContext = createContext<Dispatch<
  | { type: 'DEFAULT'; payload: { itemsPerDisplay: number } }
  | { type: 'FILTER'; payload: { filter: { category: { id: string; name: string } }; itemsPerDisplay: number } }
  | { type: 'SEE_MORE'; payload: { addItemsToDisplay: number } }
  | { type: 'SORT'; payload: { order: 'asc' | 'desc'; target: 'createdAt' | 'updatedAt' } }
> | null>(null);
