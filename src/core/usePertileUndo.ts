import { useState, useCallback } from 'react';
import { Tile } from '@/core/chr';

type UndoHistory = {
  undoStack: Tile[];
  redoStack: Tile[];
};

export function usePerTileUndo(
  tileIndex: number,
  currentTile: Tile,
  onUpdateTile: (index: number, newTile: Tile) => void
) {
  const [historyMap, setHistoryMap] = useState<Map<number, UndoHistory>>(new Map());

  const getHistory = () => {
    return historyMap.get(tileIndex) ?? { undoStack: [], redoStack: [] };
  };

  const pushState = useCallback(() => {
    const history = getHistory();
    const undoStack = [...history.undoStack, currentTile];
    const redoStack: Tile[] = [];
    const updated = new Map(historyMap);
    updated.set(tileIndex, { undoStack, redoStack });
    setHistoryMap(updated);
  }, [tileIndex, currentTile, historyMap]);

  const undo = useCallback(() => {
    const history = getHistory();
    if (history.undoStack.length === 0) return;

    const prevTile = history.undoStack[history.undoStack.length - 1];
    const undoStack = history.undoStack.slice(0, -1);
    const redoStack = [...history.redoStack, currentTile];
    const updated = new Map(historyMap);
    updated.set(tileIndex, { undoStack, redoStack });
    setHistoryMap(updated);
    onUpdateTile(tileIndex, prevTile);
  }, [tileIndex, currentTile, historyMap, onUpdateTile]);

  const redo = useCallback(() => {
    const history = getHistory();
    if (history.redoStack.length === 0) return;

    const nextTile = history.redoStack[history.redoStack.length - 1];
    const undoStack = [...history.undoStack, currentTile];
    const redoStack = history.redoStack.slice(0, -1);
    const updated = new Map(historyMap);
    updated.set(tileIndex, { undoStack, redoStack });
    setHistoryMap(updated);
    onUpdateTile(tileIndex, nextTile);
  }, [tileIndex, currentTile, historyMap, onUpdateTile]);

  const history = getHistory();
  return {
    pushState,
    undo,
    redo,
    canUndo: history.undoStack.length > 0,
    canRedo: history.redoStack.length > 0,
  };
}
