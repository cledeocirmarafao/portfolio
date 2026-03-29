import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import type { ContributionWeek } from "../hooks/useGithubData";

interface Props {
  weeks: ContributionWeek[];
  totalContributions: number;
}

const LEVEL_COLORS = [
  "bg-muted/30",
  "bg-emerald-900/60",
  "bg-emerald-700/70",
  "bg-emerald-500/80",
  "bg-emerald-400",
];

export const GitHubContributionGraph = ({
  weeks,
  totalContributions,
}: Props) => {
  const { t } = useTranslation();

  const monthLabels = t("github.months", { returnObjects: true }) as string[];
  const dayLabels = t("github.days", { returnObjects: true }) as string[];

  const monthMarkers: { label: string; index: number }[] = [];
  let lastMonth = -1;
  let lastYear = -1;

  weeks.forEach((week, i) => {
    const firstDay = week.days[0];
    if (!firstDay) return;
    const date = new Date(firstDay.date);
    const month = date.getMonth();
    const year = date.getFullYear();

    if (month !== lastMonth || year !== lastYear) {
      const label = monthLabels[month];
      monthMarkers.push({ label, index: i });
      lastMonth = month;
      lastYear = year;
    }
  });

  const CELL = 10;
  const GAP = 3.5;
  const cellStep = CELL + GAP;

  return (
    <motion.div
      data-testid="contribution-graph"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="glass rounded-xl p-3 sm:p-5 border border-border/50 w-fit"
    >
      <div className="mb-4">
        <span
          data-testid="contribution-total"
          className="text-gradient font-bold text-lg"
        >
          {totalContributions} {t("about.contributions")}
        </span>
        <span className="text-muted-foreground text-sm ml-2">
          {t("about.contributions_period")}
        </span>
      </div>

      <div>
        <div
          data-testid="month-labels"
          style={{ minWidth: `${weeks.length * cellStep + 32}px` }}
        >
          <div className="relative h-4 mb-1 ml-5">
            {monthMarkers.map((m, i) => {
              const next = monthMarkers[i + 1];
              const tooClose = next && (next.index - m.index) * cellStep < 35;
              if (tooClose) return null;

              return (
                <span
                  data-testid={`month-label-${m.label}`}
                  key={i}
                  className="absolute text-xs text-muted-foreground whitespace-nowrap"
                  style={{
                    left: `${m.index * cellStep}px`,
                    letterSpacing: "1px",
                  }}
                >
                  {m.label}
                </span>
              );
            })}
          </div>

          <div className="flex gap-0.75">
            <div className="flex flex-col gap-0.75 mr-1 w-6">
              {(dayLabels as string[]).map((label, i) => (
                <div
                  key={i}
                  className="text-[10px] text-muted-foreground flex items-center"
                  style={{ height: `${CELL}px` }}
                >
                  {label}
                </div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.75">
                {Array.from({ length: 7 }).map((_, di) => {
                  const day = week.days.find(
                    (d) => new Date(d.date).getDay() === di,
                  );

                  return (
                    <motion.div
                      key={di}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: wi * 0.005 + di * 0.002 }}
                      className={`rounded-[2px] ${
                        day ? LEVEL_COLORS[day.level] : "bg-muted/20"
                      } transition-colors hover:ring-1 hover:ring-primary/50`}
                      style={{ width: `${CELL}px`, height: `${CELL}px` }}
                      title={
                        day
                          ? `${day.date}: ${day.count} ${t("github.contributions_on")}`
                          : ""
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div
            data-testid="contribution-legend"
            className="flex items-center gap-1 mt-3 justify-end mr-8"
          >
            <span className="text-[10px] text-muted-foreground mr-1 ">
              {t("github.less")}
            </span>
            {LEVEL_COLORS.map((color, i) => (
              <div
                key={i}
                className={`rounded-[2px] ${color}`}
                style={{ width: `${CELL}px`, height: `${CELL}px` }}
              />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">
              {t("github.more")}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
