import React, { useState } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import InventoryControl from './InventoryControl';
import InventoryHotbar from './InventoryHotbar';
import { useAppDispatch } from '../../store';
import { refreshSlots, setAdditionalMetadata, setupInventory } from '../../store/inventory';
import { useExitListener } from '../../hooks/useExitListener';
import type { Inventory as InventoryProps } from '../../typings';
import RightInventory from './RightInventory';
import LeftInventory from './LeftInventory';
import Tooltip from '../utils/Tooltip';
import { closeTooltip } from '../../store/tooltip';
import InventoryContext from './InventoryContext';
import { closeContextMenu } from '../../store/contextMenu';
import Fade from '../utils/transitions/Fade';

const Inventory: React.FC = () => {
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const dispatch = useAppDispatch();

  useNuiEvent<boolean>('setInventoryVisible', setInventoryVisible);
  useNuiEvent<false>('closeInventory', () => {
    setInventoryVisible(false);
    dispatch(closeContextMenu());
    dispatch(closeTooltip());
  });
  useExitListener(setInventoryVisible);

  useNuiEvent<{
    leftInventory?: InventoryProps;
    rightInventory?: InventoryProps;
  }>('setupInventory', (data) => {
    dispatch(setupInventory(data));
    !inventoryVisible && setInventoryVisible(true);
  });

  useNuiEvent('refreshSlots', (data) => dispatch(refreshSlots(data)));

  useNuiEvent('displayMetadata', (data: Array<{ metadata: string; value: string }>) => {
    dispatch(setAdditionalMetadata(data));
  });

  

  return (
    <>
      <Fade in={inventoryVisible}>
        <div className="inventory-wrapper-logo-parent">
          <div className="inventory-wrapper">
            <div className="inventory-wrapper-parent-end">
              <div style={{ width: '100%' }}>
                <div
                  style={{
                    transform: 'perspective(1000px) rotateY(-10deg)', // Example transform
                    transformOrigin: 'center top' // or 'top left', '50% 50%', etc.
                  }}
                >
                  <InventoryControl />
                </div>
              </div>
                <div style={{ 
                  backgroundColor: `rgba(35, 35, 35, 1)`, 
                  padding: '14px', 
                  border: '2px solid rgba(255, 255, 255, 0.5)', 
                  borderRadius: '10px',
                  transform: 'perspective(1000px) rotateY(-10deg)', // Example transform
                  transformOrigin: 'center bottom' // or 'top left', '50% 50%', etc.
                }}>
                <LeftInventory />
              </div>

            </div>
            <div className="inventory-wrapper-parent-start">
              <div style={{ 
                  backgroundColor: `rgba(35, 35, 35, 1)`, 
                  padding: '14px', 
                  border: '2px solid rgba(255, 255, 255, 0.5)', 
                  borderRadius: '10px',
                  transform: 'perspective(1000px) rotateY(-10deg)', // Example transform
                  transformOrigin: 'center top' // or 'top left', '50% 50%', etc.
                }}>
                <RightInventory />
              </div>
            </div>
            <Tooltip />
            <InventoryContext />
          </div>
        </div>
      </Fade>
      <InventoryHotbar />
    </>
  );
};

export default Inventory;
