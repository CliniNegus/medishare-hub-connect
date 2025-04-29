import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Map, BrainCircuit, PieChart, Lightbulb, BarChart2, Settings, RefreshCw, ListFilter, FileText } from 'lucide-react';

interface PredictedEquipmentNeed {
  id: string;
  cluster: string;
  equipment: string;
  confidence: number;
  reasoning: string;
  date: string;
}

interface Cluster {
  id: string;
  name: string;
}

const PredictiveAnalytics = () => {
  const [selectedCluster, setSelectedCluster] = useState('all');

  const clusters = [
    { id: 'all', name: 'All Clusters' },
    { id: 'cluster1', name: 'Northeast Medical Cluster' },
    { id: 'cluster2', name: 'West Coast Health Network' },
    { id: 'cluster3', name: 'Southern Medical Group' },
    { id: 'cluster4', name: 'Midwest Hospital Alliance' },
  ];

  const predictedEquipmentNeeds = [
    { 
      id: 'pred1', 
      cluster: 'Northeast Medical Cluster', 
      equipment: 'MRI Scanner', 
      confidence: 89, 
      reasoning: 'Historical usage patterns and regional demographic trends indicate high demand.',
      date: '2025-06-15'
    },
    { 
      id: 'pred2', 
      cluster: 'West Coast Health Network', 
      equipment: 'CT Scanner', 
      confidence: 92, 
      reasoning: 'Recent increase in emergency admissions and aging equipment in 3 hospitals.',
      date: '2025-05-28'
    },
    { 
      id: 'pred3', 
      cluster: 'Southern Medical Group', 
      equipment: 'Ultrasound Machines', 
      confidence: 78, 
      reasoning: 'Growing maternal care services and predicted population growth in service area.',
      date: '2025-07-10'
    },
    { 
      id: 'pred4', 
      cluster: 'Midwest Hospital Alliance', 
      equipment: 'Digital X-Ray System', 
      confidence: 85, 
      reasoning: 'Equipment age analysis shows 60% of current systems nearing end-of-life.',
      date: '2025-06-05'
    },
    { 
      id: 'pred5', 
      cluster: 'Northeast Medical Cluster', 
      equipment: 'Patient Monitoring System', 
      confidence: 81, 
      reasoning: 'ICU expansion plans and increased cardiac care specialization.',
      date: '2025-08-20'
    }
  ];

  const filteredPredictions = selectedCluster === 'all' 
    ? predictedEquipmentNeeds 
    : predictedEquipmentNeeds.filter(pred => pred.cluster === clusters.find(c => c.id === selectedCluster)?.name);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Predictive Equipment Analytics</h2>
          <p className="text-gray-600">AI-powered predictions for hospital equipment needs by cluster</p>
        </div>
        <Button>
          <RefreshCw className="h-4 w-4 mr-2" />
          Update Predictions
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cluster Analysis</CardTitle>
            <Map className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clusters.length - 1}</div>
            <p className="text-xs text-gray-500">Active hospital clusters</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Equipment Predictions</CardTitle>
            <BrainCircuit className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predictedEquipmentNeeds.length}</div>
            <p className="text-xs text-gray-500">AI-generated equipment needs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Confidence</CardTitle>
            <PieChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-gray-500">AI prediction confidence level</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Equipment Needs Predictions</CardTitle>
              <CardDescription>AI-based predictions for upcoming equipment needs by hospital cluster</CardDescription>
            </div>
            
            <div className="flex space-x-2 items-center">
              <ListFilter className="h-4 w-4 text-gray-500" />
              <select 
                className="py-1 px-2 rounded border text-sm"
                value={selectedCluster}
                onChange={(e) => setSelectedCluster(e.target.value)}
              >
                {clusters.map(cluster => (
                  <option key={cluster.id} value={cluster.id}>{cluster.name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cluster</TableHead>
                <TableHead>Predicted Equipment</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Reasoning</TableHead>
                <TableHead>Target Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPredictions.map((prediction) => (
                <TableRow key={prediction.id}>
                  <TableCell className="font-medium">{prediction.cluster}</TableCell>
                  <TableCell>{prediction.equipment}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            prediction.confidence > 85 ? 'bg-green-500' : 
                            prediction.confidence > 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{prediction.confidence}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{prediction.reasoning}</TableCell>
                  <TableCell>{prediction.date}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-red-600" />
            <CardTitle>AI Prediction System</CardTitle>
          </div>
          <CardDescription>
            Configure and manage the AI prediction system for hospital equipment needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Data Sources</h4>
              <ul className="text-sm list-disc list-inside">
                <li>Hospital equipment usage metrics</li>
                <li>Maintenance records and equipment age</li>
                <li>Regional healthcare trends</li>
                <li>Patient demographics and procedure volumes</li>
                <li>Historical equipment orders</li>
              </ul>
              <Button variant="outline" size="sm" className="mt-2">
                <Settings className="h-3 w-3 mr-1" />
                Configure Data Sources
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Model Performance</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded border">
                  <div className="text-xs text-gray-500">Accuracy</div>
                  <div className="text-lg font-medium">92.4%</div>
                </div>
                <div className="bg-white p-2 rounded border">
                  <div className="text-xs text-gray-500">Precision</div>
                  <div className="text-lg font-medium">89.1%</div>
                </div>
                <div className="bg-white p-2 rounded border">
                  <div className="text-xs text-gray-500">Recall</div>
                  <div className="text-lg font-medium">86.7%</div>
                </div>
                <div className="bg-white p-2 rounded border">
                  <div className="text-xs text-gray-500">F1 Score</div>
                  <div className="text-lg font-medium">87.9%</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                <BarChart2 className="h-3 w-3 mr-1" />
                View Detailed Metrics
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button>
              <BrainCircuit className="h-4 w-4 mr-2" />
              Retrain Model
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;
