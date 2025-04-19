
import React from "react";
import { cn } from "@/lib/utils";
import { Check, X, Landmark, Calendar } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

export function HistoryView() {
  const { history } = useAppContext();
  
  // Sort history by date, most recent first
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="solo-card">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5" />
        <h2 className="text-xl font-semibold">History</h2>
      </div>
      
      {sortedHistory.length === 0 ? (
        <p className="text-center text-gray-400 py-4">
          No history yet. Complete your first quest!
        </p>
      ) : (
        <div className="space-y-3">
          {sortedHistory.map((day) => (
            <div 
              key={day.date} 
              className={cn(
                "p-3 rounded-lg border bg-sololevel-darker",
                day.maintainedStreak ? "border-green-600/30" : "border-gray-700"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{formatDate(day.date)}</span>
                <div className="flex items-center gap-1 text-xs">
                  <Landmark className="w-3 h-3 text-sololevel-purple" />
                  <span>+{day.earnedCurrency}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-gray-400">Quests:</span>
                  <span>{day.completedQuests}/{day.totalQuests}</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-gray-400">Streak:</span>
                  {day.maintainedStreak ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
