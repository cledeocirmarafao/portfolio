import { motion } from "motion/react";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "./ui/Button";
import { useMapbox } from "@/hooks/useMapbox";

const FLORIPA: [number, number] = [-48.5492, -27.5967];

export const LocationMap = () => {
  const { containerRef } = useMapbox({ center: FLORIPA, zoom: 10.5 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-6 mx-3"
    >
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">Localização</h3>
      </div>

      <div className="rounded-xl overflow-hidden border border-primary/20 shadow-[0_0_20px_rgba(0,245,255,0.08)]">
        <div
          data-testid="location-map-container"
          ref={containerRef}
          className=" w-full h-80 sm:h-100"
        />

        <div className="flex items-center justify-between p-4 gb-card/80 backdrop-blur-sm border-t border-border/50">
          <div>
            <p
              data-testid="location-city"
              className="font-semibold text-foreground max-sm:text-sm"
            >
              Florianópolis, SC
            </p>
            <p
              data-testid="location-country"
              className="text-sm text-muted-foreground max-sm:text-xs"
            >
              Brasil 🇧🇷
            </p>
          </div>
          <Button
            variant={"outline"}
            size="sm"
            className="gap-2 border-primary/30 hover:bg-cyan max-sm:text-xs"
            asChild
          >
            <a
              data-testid="location-maps-link"
              href="https://www.google.com/maps/place/Florian%C3%B3polis,+SC"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver no Google Maps</span>
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
