import InventoryComponent from './components/inventory';
import useNuiEvent from './hooks/useNuiEvent';
import { Items } from './store/items';
import { Locale } from './store/locale';
import { setImagePath } from './store/imagepath';
import { setupInventory } from './store/inventory';
import { Inventory } from './typings';
import { useAppDispatch } from './store';
import { debugData } from './utils/debugData';
import DragPreview from './components/utils/DragPreview';
import { fetchNui } from './utils/fetchNui';
import { useDragDropManager } from 'react-dnd';
import KeyPress from './components/utils/KeyPress';
import { setDamage } from './store/damage';

debugData([
  {
    action: 'setupInventory',
    data: {
      leftInventory: {
        id: 'test',
        type: 'player',
        slots: 20,
        label: 'LucaFlash',
        weight: 3000,
        maxWeight: 5000,
        items: [
          {
            slot: 1,
            name: 'Iron',
            weight: 3000,
            rarity: 'common',
            count: 15,
          },
          {
            slot: 2,
            name: 'water',
            rarity: 'rare',
            weight: 100,
            count: 1,
            metadata: { description: 'Generic item description' },
          },
          {
            slot: 3,
            name: 'water',
            rarity: 'epic',
            weight: 100,
            count: 1,
            metadata: { description: 'Generic item description' },
          },
          {
            slot: 4,
            name: 'water',
            rarity: 'legendary',
            weight: 100,
            count: 1,
            metadata: { description: 'Generic item description' },
          },
          {
            slot: 5,
            name: 'water',
            rarity: 'special',
            weight: 100,
            count: 1,
            metadata: { description: 'Generic item description' },
          },
          {
            slot: 6,
            name: 'water',
            weight: 100,
            count: 1,
            metadata: { description: 'Generic item description' },
          },
          
        ],
      },
      rightInventory: {
        id: 'shop',
        type: 'shop',
        slots: 20,
        label: 'Shop',
        weight: 3000,
        maxWeight: 5000,
        items: [
          {
            slot: 1,
            name: 'lockpick',
            rarity: 'special',
            weight: 500,
            price: 300,
            ingredients: {
              iron: 5,
              copper: 12,
              powersaw: 0.1,
            },
            metadata: {
              description: 'Simple lockpick that breaks easily and can pick basic door locks',
            },
          },
        ],
      },
    },
  },
]);

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const manager = useDragDropManager();

  useNuiEvent<{
    locale: { [key: string]: string };
    items: typeof Items;
    leftInventory: Inventory;
    imagepath: string;
  }>('init', ({ locale, items, leftInventory, imagepath }) => {
    for (const name in locale) Locale[name] = locale[name];
    for (const name in items) Items[name] = items[name];

    setImagePath(imagepath);
    dispatch(setupInventory({ leftInventory }));
  });

  fetchNui('uiLoaded', {});

  useNuiEvent('closeInventory', () => {
    manager.dispatch({ type: 'dnd-core/END_DRAG' });
  });

  useNuiEvent('DamageCall', (data: any) => {
    dispatch(setDamage(data));
  });

  return (
    <div className="app-wrapper">
      <InventoryComponent />
      <DragPreview />
      <KeyPress />
    </div>
  );
};

addEventListener('dragstart', function (event) {
  event.preventDefault();
});

export default App;
