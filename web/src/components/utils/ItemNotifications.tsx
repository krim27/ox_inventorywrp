import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { TransitionGroup } from 'react-transition-group';
import useNuiEvent from '../../hooks/useNuiEvent';
import useQueue from '../../hooks/useQueue';
import { Locale } from '../../store/locale';
import { getItemUrl } from '../../helpers';
import { SlotWithItem } from '../../typings';
import { Items } from '../../store/items';
import Fade from './transitions/Fade';

interface ItemNotificationProps {
  item: SlotWithItem;
  text: string;
}

export const ItemNotificationsContext = React.createContext<{
  add: (item: ItemNotificationProps) => void;
} | null>(null);

export const useItemNotifications = () => {
  const itemNotificationsContext = useContext(ItemNotificationsContext);
  if (!itemNotificationsContext) throw new Error(`ItemNotificationsContext undefined`);
  return itemNotificationsContext;
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return '#00800060'; // Verde con 25% di opacità
    case 'rare':
      return '#00FFFF60'; // Ciano con 25% di opacità
    case 'epic':
      return '#80008060'; // Viola con 25% di opacità
    case 'legendary':
      return '#FFD70060'; // Oro con 25% di opacità
    case 'special':
      return '#FFFFFF60'; // Bianco con 25% di opacità
    default:
      return '#00000040'; // Nero con 25% di opacità
  }
};

const ItemNotification = React.forwardRef(
  (props: { item: ItemNotificationProps; style?: React.CSSProperties }, ref: React.ForwardedRef<HTMLDivElement>) => {
    const slotItem = props.item.item;
    const rarityColor = getRarityColor(slotItem.rarity || '');

    return (
      <div
        className="item-notification-item-box"
        ref={ref}
        style={{
          filter: slotItem.rarity === 'special' ? 'brightness(90%)' : undefined,
          boxShadow:  `inset 0 0 20px 10px ${rarityColor}`,
          border: `1px solid ${rarityColor}`, // ✅ Rarity border
          ...props.style,
        }}
      >
        {/* ✅ Image on top */}
        <img
          className="item-notification-image"
          style={{ width: '50px', height: 'auto' }} // Adjust width as needed
          src={getItemUrl(slotItem) || ''}
          alt={slotItem.metadata?.label || Items[slotItem.name]?.label}
        />

        <div className="item-slot-wrapper">
          <div className="item-notification-action-box">
            <p>{props.item.text}</p>
          </div>
          <div className="inventory-slot-label-box">
            <div className="inventory-slot-label-text">{slotItem.metadata?.label || Items[slotItem.name]?.label}</div>
          </div>
        </div>
      </div>
    );
  }
);

export const ItemNotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const queue = useQueue<{
    id: number;
    item: ItemNotificationProps;
    ref: React.RefObject<HTMLDivElement>;
  }>();

  const add = (item: ItemNotificationProps) => {
    const ref = React.createRef<HTMLDivElement>();
    const notification = { id: Date.now(), item, ref: ref };

    queue.add(notification);

    const timeout = setTimeout(() => {
      queue.remove();
      clearTimeout(timeout);
    }, 2500);
  };

  useNuiEvent<[item: SlotWithItem, text: string, count?: number]>('itemNotify', ([item, text, count]) => {
    add({ item: item, text: count ? `${Locale[text]} ${count}x` : `${Locale[text]}` });
  });

  return (
    <ItemNotificationsContext.Provider value={{ add }}>
      {children}
      {createPortal(
        <TransitionGroup className="item-notification-container">
          {queue.values.map((notification, index) => (
            <Fade key={`item-notification-${index}`}>
              <ItemNotification item={notification.item} ref={notification.ref} />
            </Fade>
          ))}
        </TransitionGroup>,
        document.body
      )}
    </ItemNotificationsContext.Provider>
  );
};
