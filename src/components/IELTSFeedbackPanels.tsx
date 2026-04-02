import { CalendarDays, MessageSquareQuote, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { buildWeeklyTimetable, type SkillBandInsight } from "@/lib/ieltsDashboard";
import { type TestAttempt } from "@/lib/ieltsPracticeData";

interface Props {
  attempts: TestAttempt[];
  insights: SkillBandInsight[];
}

export default function IELTSFeedbackPanels({ attempts, insights }: Props) {
  const timetable = buildWeeklyTimetable(attempts);

  if (insights.length === 0 && timetable.length === 0) return null;

  return (
    <Tabs defaultValue="descriptors" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="descriptors" className="gap-2">
          <MessageSquareQuote className="h-4 w-4" /> Band breakdown
        </TabsTrigger>
        <TabsTrigger value="timetable" className="gap-2">
          <CalendarDays className="h-4 w-4" /> Weekly timetable
        </TabsTrigger>
      </TabsList>

      <TabsContent value="descriptors" className="mt-0 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((item) => (
            <Card key={item.skill} className="border-border bg-card card-elevated">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg capitalize">{item.skill}</CardTitle>
                    <p className="text-sm text-muted-foreground">Band {item.band.toFixed(1)} estimate</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {item.raw}/{item.max}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={item.ratio * 100} className="h-2" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{item.descriptor.title}</p>
                  <p className="text-sm text-muted-foreground">{item.descriptor.why}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Why this band</p>
                    <p className="text-sm">{item.descriptor.benchmark}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Focus next</p>
                    <p className="text-sm">{item.descriptor.focus}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="timetable" className="mt-0">
        <Card className="border-border bg-card card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-4 w-4 text-primary" /> Auto-generated weekly study timetable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Focus</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetable.map((item) => (
                  <TableRow key={item.day}>
                    <TableCell className="font-medium">{item.day}</TableCell>
                    <TableCell className="capitalize">{item.skill}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.session}</p>
                        <p className="text-xs text-muted-foreground">{item.reason}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.duration}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}