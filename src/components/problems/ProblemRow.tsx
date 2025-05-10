
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  TableCell, 
  TableRow 
} from '@/components/ui/table';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ProblemDetailContent } from './ProblemDetailContent';

type ProblemItem = {
  id: number;
  description: string;
  status: string;
  date: string;
  secretary: string;
  timeElapsed: string;
  dueDate: string;
};

interface ProblemRowProps {
  activity: ProblemItem;
  isOpen: boolean;
  onToggle: () => void;
}

export const ProblemRow: React.FC<ProblemRowProps> = ({ 
  activity, 
  isOpen, 
  onToggle 
}) => {
  const [activeTab, setActiveTab] = useState<string>("detalhes");

  return (
    <React.Fragment>
      <TableRow>
        <TableCell className="font-medium">{activity.description}</TableCell>
        <TableCell>
          <Badge className={`px-2.5 py-1 rounded-full text-xs ${
            activity.status === 'Resolvido' 
              ? "bg-resolve-lightgreen text-resolve-green" 
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {activity.status}
          </Badge>
        </TableCell>
        <TableCell className="text-sm">{activity.timeElapsed}</TableCell>
        <TableCell>
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs flex items-center justify-center">
            {activity.dueDate}
          </div>
        </TableCell>
        <TableCell className="text-sm">{activity.date}</TableCell>
        <TableCell className="text-sm">{activity.secretary}</TableCell>
        <TableCell>
          <Collapsible open={isOpen} onOpenChange={onToggle}>
            <CollapsibleTrigger 
              className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 w-8 h-8 flex items-center justify-center"
            >
              <span className="sr-only">Ver detalhes</span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </CollapsibleTrigger>
          </Collapsible>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={7} className="p-0">
          <Collapsible open={isOpen}>
            <CollapsibleContent className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <ProblemDetailContent 
                activity={activity} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
            </CollapsibleContent>
          </Collapsible>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
