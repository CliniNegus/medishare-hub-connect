
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface ClusterNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  equipmentCount: number;
  type: 'hospital' | 'clinic';
}

interface ClusterMapProps {
  nodes: ClusterNode[];
  selectedNodeId?: string;
  onSelectNode?: (id: string) => void;
}

const ClusterMap: React.FC<ClusterMapProps> = ({ 
  nodes, 
  selectedNodeId,
  onSelectNode
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Equipment Cluster Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gray-100 rounded-md relative overflow-hidden">
          {/* Placeholder for actual map implementation */}
          <div className="absolute inset-0 bg-medical-light flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto text-medical-primary opacity-70" />
              <p className="text-sm mt-2">Interactive cluster map will appear here</p>
            </div>
          </div>
          
          <div className="absolute bottom-3 left-3 bg-white p-3 rounded-md shadow-md max-h-48 overflow-y-auto w-64">
            <h3 className="font-medium text-sm mb-2">Cluster Locations</h3>
            <ul className="space-y-2">
              {nodes.map(node => (
                <li 
                  key={node.id}
                  className={`text-sm p-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                    selectedNodeId === node.id ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                  onClick={() => onSelectNode && onSelectNode(node.id)}
                >
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 ${
                      node.type === 'hospital' ? 'bg-medical-primary' : 'bg-medical-secondary'
                    }`} />
                    <span>{node.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{node.equipmentCount}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClusterMap;
