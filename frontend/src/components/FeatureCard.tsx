import { Card, CardTitle } from "./ui/card";

interface FeatureCardProps {
  cardText: string;
  imageUrl: string;
  onClick?: () => void;
}

export default function FeatureCard({
  cardText,
  imageUrl,
  onClick,
}: FeatureCardProps) {
  return (
    <Card
      onClick={onClick}
      className="flex-1 h-96 relative brightness-90 flex flex-col items-center overflow-hidden justify-center
    hover:scale-105 cursor-pointer transition-all hover:brightness-100 grayscale hover:grayscale-0"
    >
      <img
        src={imageUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="h-full w-full absolute inset-0 bg-black/40 z-10"></div>
      <CardTitle className="relative z-20 text-3xl font-bold text-white drop-shadow-lg">
        {cardText}
      </CardTitle>
    </Card>
  );
}
