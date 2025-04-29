
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const EquipmentCategories = () => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Equipment Categories</h3>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Imaging Equipment (42 items)</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">MRI Scanners, CT Scanners, X-Ray Machines, Ultrasound Devices</p>
            <Button variant="outline" size="sm">View All</Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Patient Monitoring (38 items)</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">Patient Monitors, ECG Machines, Vital Signs Monitors</p>
            <Button variant="outline" size="sm">View All</Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Laboratory Equipment (25 items)</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">Analyzers, Centrifuges, Microscopes, Lab Automation Systems</p>
            <Button variant="outline" size="sm">View All</Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Surgical Equipment (40 items)</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">Surgical Tables, Surgical Lights, Anesthesia Machines</p>
            <Button variant="outline" size="sm">View All</Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default EquipmentCategories;
