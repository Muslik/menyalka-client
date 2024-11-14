import { Tabbar as TelegramBar } from '@telegram-apps/telegram-ui';

export const Tabbar = () => {
  return (
    <TelegramBar>
      <TelegramBar.Item>Ads</TelegramBar.Item>
      <TelegramBar.Item>Create ad</TelegramBar.Item>
      <TelegramBar.Item>Profile</TelegramBar.Item>
    </TelegramBar>
  );
};
