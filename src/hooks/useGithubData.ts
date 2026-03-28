import { useState, useEffect } from "react";
import axios from "axios";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

const GITHUB_USERNAME = "cledeocirmarafao";

export const useGitHubData = () => {
  const [totalContributions, setTotalContributions] = useState(0);
  const [contributions, setContributions] = useState<ContributionWeek[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contribRes = await axios.get(
          `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=all`,
        );
        const contribData = contribRes.data;

        const totalObj: Record<string, number> = contribData.total ?? {};
        const totalCount = Object.values(totalObj).reduce(
          (sum, val) => sum + val,
          0,
        );
        setTotalContributions(totalCount);

        const now = new Date();
        const oneYearAgo = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate(),
        );

        const filtered: Record<string, { count: number; level: number }> = {};
        if (contribData.contributions) {
          contribData.contributions.forEach((day: any) => {
            const date = new Date(day.date);
            if (date >= oneYearAgo) {
              filtered[day.date] = { count: day.count, level: day.level };
            }
          });
        }

        const sortedDates = Object.keys(filtered).sort();

        const firstDate = new Date(sortedDates[0]);
        const startOffset = firstDate.getDay();
        const startDate = new Date(firstDate);
        startDate.setDate(startDate.getDate() - startOffset);

        const weeks: ContributionWeek[] = [];
        let currentWeek: ContributionDay[] = [];

        const cursor = new Date(startDate);
        while (cursor <= now) {
          const dateStr = cursor.toISOString().split("T")[0];
          const dayOfWeek = cursor.getDay();

          if (dayOfWeek === 0 && currentWeek.length > 0) {
            weeks.push({ days: currentWeek });
            currentWeek = [];
          }

          if (filtered[dateStr]) {
            currentWeek.push({
              date: dateStr,
              count: filtered[dateStr].count,
              level: filtered[dateStr].level,
            });
          } else {
            currentWeek.push({ date: dateStr, count: 0, level: 0 });
          }

          cursor.setDate(cursor.getDate() + 1);
        }

        if (currentWeek.length > 0) {
          weeks.push({ days: currentWeek });
        }

        setContributions(weeks);
      } catch (err) {
        console.error("GitHub API error:", err);
        setContributions([]);
        setTotalContributions(0);
      }
    };

    fetchData();
  }, []);

  return { totalContributions, contributions };
}
