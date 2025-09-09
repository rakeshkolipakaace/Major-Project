interface AchievementBadgeProps {
  icon: string;
  name: string;
  description: string;
  earned: boolean;
  color?: string;
}

export function AchievementBadge({ 
  icon, 
  name, 
  description, 
  earned, 
  color = "bg-primary" 
}: AchievementBadgeProps) {
  return (
    <div 
      className={`achievement-badge bg-card/30 backdrop-blur-md rounded-xl p-4 text-center border border-border cursor-pointer ${!earned ? 'opacity-60' : ''}`}
      data-testid={`badge-${name.toLowerCase().replace(' ', '-')}`}
    >
      <div className={`w-16 h-16 ${earned ? color : 'bg-muted'} rounded-full flex items-center justify-center mx-auto mb-3`}>
        <i className={`fas fa-${earned ? icon : 'lock'} text-2xl ${earned ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
      </div>
      <h4 className={`font-gaming text-sm mb-1 ${earned ? 'text-primary' : 'text-muted-foreground'}`}>
        {name}
      </h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
