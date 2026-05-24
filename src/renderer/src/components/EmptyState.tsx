import { AppSettings } from "../../../shared/types";
import { mascotAssets } from "../assets/mascot/mascotAssets";

interface Props {
  settings: AppSettings;
}

export function EmptyState({ settings }: Props) {
  return (
    <div className="empty-state">
      {settings.showMascot && (
        <img className="mascot-img mascot-empty" src={mascotAssets.clipboard} alt="clipboard mascot" />
      )}
      <div className="empty-text">Nothing copied yet</div>
      <div className="empty-sub">Copy text anywhere and it will appear here.</div>
    </div>
  );
}
