import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { useProgress } from "@/hooks/useProgress";
import { WeightLogModal } from "@/components/WeightLogModal";
import { WorkoutTracker } from "@/components/WorkoutTracker";

const Progress = () => {
  const [activeTab, setActiveTab] = useState("weight");
  const [showWeightModal, setShowWeightModal] = useState(false);
  const { 
    progressData, 
    isLoading, 
    logWeight, 
    logWorkout, 
    getTodaysProgress, 
    getWeightData 
  } = useProgress();
  
  const todaysProgress = getTodaysProgress();
  const weightData = getWeightData();

  // Mock data for calories tracking (this could be made dynamic later)
  const caloriesData = [
    { date: 'Mon', consumed: 2100, burned: 2400, target: 2000 },
    { date: 'Tue', consumed: 2300, burned: 2500, target: 2000 },
    { date: 'Wed', consumed: 1900, burned: 2200, target: 2000 },
    { date: 'Thu', consumed: 2250, burned: 2300, target: 2000 },
    { date: 'Fri', consumed: 2400, burned: 2400, target: 2000 },
    { date: 'Sat', consumed: 2500, burned: 2100, target: 2000 },
    { date: 'Sun', consumed: 1800, burned: 1900, target: 2000 },
  ];
  
  // Calculate workout data from real progress data
  const workoutData = (() => {
    const last8Weeks = [];
    const today = new Date();
    
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7 + today.getDay()));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekProgress = progressData.filter(p => {
        const progressDate = new Date(p.date);
        return progressDate >= weekStart && progressDate <= weekEnd;
      });
      
      const completed = weekProgress.reduce((total, day) => 
        total + (day.workouts_completed?.length || 0), 0
      );
      
      last8Weeks.push({
        date: `Week ${8 - i}`,
        completed: completed,
        target: 5, // This could be made dynamic based on workout plan
      });
    }
    
    return last8Weeks;
  })();
  
  // Mock data for body composition
  const bodyCompositionData = [
    { name: 'Fat', value: 18.5, color: '#ff8c00' },
    { name: 'Muscle', value: 42.8, color: '#0ea5e9' },
    { name: 'Bone', value: 15.3, color: '#d1d5db' },
    { name: 'Water', value: 23.4, color: '#3b82f6' },
  ];
  
  // Mock data for measurements (this could be made dynamic later)
  const measurementsData = {
    chest: [
      { date: 'Initial', value: 102 },
      { date: 'Week 4', value: 100 },
      { date: 'Week 8', value: 98 },
    ],
    waist: [
      { date: 'Initial', value: 92 },
      { date: 'Week 4', value: 89 },
      { date: 'Week 8', value: 86 },
    ],
    hips: [
      { date: 'Initial', value: 104 },
      { date: 'Week 4', value: 102 },
      { date: 'Week 8', value: 101 },
    ],
    arms: [
      { date: 'Initial', value: 35 },
      { date: 'Week 4', value: 36 },
      { date: 'Week 8', value: 37 },
    ],
    thighs: [
      { date: 'Initial', value: 62 },
      { date: 'Week 4', value: 61 },
      { date: 'Week 8', value: 60 },
    ],
  };
  
  // Calculate weekly averages for caloric data
  const calculateWeeklyAverage = () => {
    const consumed = Math.round(caloriesData.reduce((acc, cur) => acc + cur.consumed, 0) / caloriesData.length);
    const burned = Math.round(caloriesData.reduce((acc, cur) => acc + cur.burned, 0) / caloriesData.length);
    const deficit = burned - consumed;
    
    return { consumed, burned, deficit };
  };
  
  const weeklyAverage = calculateWeeklyAverage();
  
  // Calculate workout completion rate
  const calculateWorkoutCompletion = () => {
    const completed = workoutData.reduce((acc, cur) => acc + cur.completed, 0);
    const target = workoutData.reduce((acc, cur) => acc + cur.target, 0);
    const rate = target > 0 ? Math.round((completed / target) * 100) : 0;
    
    return { completed, target, rate };
  };
  
  const workoutCompletion = calculateWorkoutCompletion();
  
  // Calculate weight loss progress
  const calculateWeightProgress = () => {
    if (weightData.length === 0) {
      return { initial: 0, current: 0, target: 70, lost: 0, toGo: 0, percentage: 0 };
    }
    
    const initial = weightData[0].weight;
    const current = weightData[weightData.length - 1].weight;
    const target = 70; // This could be made dynamic based on user profile
    
    const totalToLose = Math.max(initial - target, 0.1);
    const lost = Math.max(initial - current, 0);
    const percentage = Math.min(Math.round((lost / totalToLose) * 100), 100);
    
    return { initial, current, target, lost, toGo: Math.max(current - target, 0), percentage };
  };
  
  const weightProgress = calculateWeightProgress();
  
  const handleLogMeasurements = () => {
    // This would open a measurements modal - placeholder for now
    console.log('Log measurements functionality to be implemented');
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-lg p-3">
          <p className="font-medium">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.name}: {item.value} {item.name === 'weight' || item.name === 'target' ? 'kg' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading your progress...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Progress Tracking</h1>
            <p className="text-muted-foreground">Track your fitness journey and body metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Current Weight</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold">
                {todaysProgress?.weight || weightProgress.current || '--'} kg
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                {weightProgress.lost > 0 && (
                  <>
                    <span className="text-green-500 font-medium">-{weightProgress.lost.toFixed(1)} kg</span>
                    <span className="mx-1">from starting weight</span>
                  </>
                )}
              </div>
              {weightProgress.percentage > 0 && (
                <>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${weightProgress.percentage}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>{weightProgress.initial} kg</span>
                    <span>{weightProgress.percentage}% complete</span>
                    <span>{weightProgress.target} kg</span>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                className="w-full" 
                onClick={() => setShowWeightModal(true)}
              >
                Log Today's Weight
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Calories This Week</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-muted-foreground text-xs">Consumed</div>
                  <div className="text-2xl font-bold">{weeklyAverage.consumed}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Burned</div>
                  <div className="text-2xl font-bold">{weeklyAverage.burned}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Deficit</div>
                  <div className="text-2xl font-bold text-green-500">{weeklyAverage.deficit}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-center mt-4">
                Average daily values
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Workout Completion</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <svg className="h-32 w-32" viewBox="0 0 100 100">
                    <circle
                      className="text-muted stroke-current"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-primary stroke-current"
                      strokeWidth="8"
                      strokeDasharray={250}
                      strokeDashoffset={250 - (workoutCompletion.rate / 100) * 250}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{workoutCompletion.rate}%</p>
                      <p className="text-xs text-muted-foreground">Complete</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-2">
                <div className="text-sm">
                  <span className="font-medium">{workoutCompletion.completed}</span> of {workoutCompletion.target} workouts completed
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Workout Tracker */}
        <WorkoutTracker 
          onWorkoutToggle={logWorkout}
          completedWorkouts={todaysProgress?.workouts_completed || []}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="calories">Calories</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="body">Body Composition</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weight">
            <Card>
              <CardHeader>
                <CardTitle>Weight Tracking</CardTitle>
                <CardDescription>Monitor your weight changes over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {weightData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={weightData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="weight" 
                        name="weight" 
                        stroke="#0ea5e9" 
                        fill="#0ea5e9" 
                        fillOpacity={0.2} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="target" 
                        name="target" 
                        stroke="#ef4444" 
                        strokeDasharray="3 3" 
                        fill="transparent" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-muted-foreground">No weight data recorded yet</p>
                      <Button 
                        className="mt-4" 
                        onClick={() => setShowWeightModal(true)}
                      >
                        Log Your First Weight
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calories">
            <Card>
              <CardHeader>
                <CardTitle>Calorie Tracking</CardTitle>
                <CardDescription>Monitor caloric intake and expenditure</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={caloriesData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="consumed" name="Calories Consumed" fill="#ef4444" />
                    <Bar dataKey="burned" name="Calories Burned" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="workouts">
            <Card>
              <CardHeader>
                <CardTitle>Workout Tracking</CardTitle>
                <CardDescription>Monitor your weekly workout completion</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={workoutData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="completed" name="Workouts Completed" fill="#0ea5e9" />
                    <Bar dataKey="target" name="Target" fill="#d1d5db" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="body">
            <Card>
              <CardHeader>
                <CardTitle>Body Composition</CardTitle>
                <CardDescription>Breakdown of body components</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bodyCompositionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {bodyCompositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="measurements">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Body Measurements</CardTitle>
                  <CardDescription>Track changes in your body measurements (cm)</CardDescription>
                </div>
                <Button onClick={handleLogMeasurements}>Log Measurements</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {Object.entries(measurementsData).map(([key, data]) => (
                    <div key={key} className="space-y-1">
                      <h3 className="font-medium capitalize">{key}</h3>
                      <div className="flex items-center">
                        <div className="flex-1 space-y-2">
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div 
                              className="h-full bg-primary" 
                              style={{ 
                                width: `${Math.round((data[data.length - 1].value / data[0].value) * 100)}%` 
                              }} 
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            {data.map((measurement, i) => (
                              <div key={i} className="text-center">
                                <div>{measurement.value} cm</div>
                                <div>{measurement.date}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-sm font-medium">
                            {data[0].value - data[data.length - 1].value > 0 ? (
                              <span className="text-green-500">-{data[0].value - data[data.length - 1].value} cm</span>
                            ) : (
                              <span className="text-blue-500">+{Math.abs(data[0].value - data[data.length - 1].value)} cm</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.abs(Math.round(((data[data.length - 1].value - data[0].value) / data[0].value) * 100))}% {data[0].value - data[data.length - 1].value > 0 ? 'decrease' : 'increase'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <WeightLogModal
        isOpen={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        onSubmit={logWeight}
        currentWeight={todaysProgress?.weight}
      />
    </DashboardLayout>
  );
};

export default Progress;
