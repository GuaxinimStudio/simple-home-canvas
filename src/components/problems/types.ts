
export type ProblemItem = {
  id: number;
  description: string;
  status: string;
  date: string;
  secretary: string;
  timeElapsed: string;
  dueDate: string;
};

export interface RecentProblemsTableProps {
  recentActivities: ProblemItem[];
}
