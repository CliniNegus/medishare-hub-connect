import React, { useState } from 'react';
import { CustomerStatement } from './CustomerStatements';
import { formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, Save, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CustomerStatementsTableProps {
  statements: CustomerStatement[];
  onUpdate: (id: string, updates: Partial<CustomerStatement>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

interface EditableFields {
  client_name: string;
  date_range: string;
  opening_balance: string;
  invoiced_amount: string;
  amount_paid: string;
  balance_due: string;
}

export const CustomerStatementsTable: React.FC<CustomerStatementsTableProps> = ({
  statements,
  onUpdate,
  onDelete,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditableFields>({
    client_name: '',
    date_range: '',
    opening_balance: '',
    invoiced_amount: '',
    amount_paid: '',
    balance_due: '',
  });

  const handleEditStart = (statement: CustomerStatement) => {
    setEditingId(statement.id);
    setEditValues({
      client_name: statement.client_name,
      date_range: statement.date_range,
      opening_balance: statement.opening_balance.toString(),
      invoiced_amount: statement.invoiced_amount.toString(),
      amount_paid: statement.amount_paid.toString(),
      balance_due: statement.balance_due.toString(),
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValues({
      client_name: '',
      date_range: '',
      opening_balance: '',
      invoiced_amount: '',
      amount_paid: '',
      balance_due: '',
    });
  };

  const handleEditSave = async () => {
    if (!editingId) return;

    const updates = {
      client_name: editValues.client_name,
      date_range: editValues.date_range,
      opening_balance: parseFloat(editValues.opening_balance) || 0,
      invoiced_amount: parseFloat(editValues.invoiced_amount) || 0,
      amount_paid: parseFloat(editValues.amount_paid) || 0,
      balance_due: parseFloat(editValues.balance_due) || 0,
    };

    await onUpdate(editingId, updates);
    setEditingId(null);
  };

  const handleInputChange = (field: keyof EditableFields, value: string) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full">
      {statements.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground">
          <div className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50">
            📄
          </div>
          <h3 className="text-lg font-medium mb-2">No customer statements found</h3>
          <p className="text-sm">Upload a CSV file or add statements manually to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border-t">
          <div className="min-w-full">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="font-semibold text-foreground min-w-[200px]">Client Name</TableHead>
                  <TableHead className="font-semibold text-foreground min-w-[180px]">Date Range</TableHead>
                  <TableHead className="text-right font-semibold text-foreground min-w-[140px]">Opening Balance</TableHead>
                  <TableHead className="text-right font-semibold text-foreground min-w-[140px]">Invoiced Amount</TableHead>
                  <TableHead className="text-right font-semibold text-foreground min-w-[140px]">Amount Paid</TableHead>
                  <TableHead className="text-right font-semibold text-foreground min-w-[140px]">Balance Due</TableHead>
                  <TableHead className="text-center font-semibold text-foreground min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statements.map((statement, index) => (
                  <TableRow 
                    key={statement.id} 
                    className={`border-b border-border transition-colors hover:bg-muted/30 ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                    }`}
                  >
                    <TableCell className="font-medium py-4">
                      {editingId === statement.id ? (
                        <input
                          type="text"
                          value={editValues.client_name}
                          onChange={(e) => handleInputChange('client_name', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <div className="font-medium text-foreground">{statement.client_name}</div>
                      )}
              </TableCell>
                    <TableCell className="py-4">
                      {editingId === statement.id ? (
                        <input
                          type="text"
                          value={editValues.date_range}
                          onChange={(e) => handleInputChange('date_range', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <div className="text-muted-foreground text-sm">{statement.date_range}</div>
                      )}
              </TableCell>
                    <TableCell className="text-right py-4 font-mono">
                      {editingId === statement.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editValues.opening_balance}
                          onChange={(e) => handleInputChange('opening_balance', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md text-sm text-right bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <div className="text-foreground font-semibold">
                          {formatCurrency(statement.opening_balance)}
                        </div>
                      )}
              </TableCell>
                    <TableCell className="text-right py-4 font-mono">
                      {editingId === statement.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editValues.invoiced_amount}
                          onChange={(e) => handleInputChange('invoiced_amount', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md text-sm text-right bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <div className="text-foreground font-semibold">
                          {formatCurrency(statement.invoiced_amount)}
                        </div>
                      )}
              </TableCell>
                    <TableCell className="text-right py-4 font-mono">
                      {editingId === statement.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editValues.amount_paid}
                          onChange={(e) => handleInputChange('amount_paid', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md text-sm text-right bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <div className="text-green-600 font-semibold">
                          {formatCurrency(statement.amount_paid)}
                        </div>
                      )}
              </TableCell>
                    <TableCell className="text-right py-4 font-mono">
                      {editingId === statement.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editValues.balance_due}
                          onChange={(e) => handleInputChange('balance_due', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md text-sm text-right bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      ) : (
                        <div className={`font-semibold ${
                          statement.balance_due > 0 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {formatCurrency(statement.balance_due)}
                        </div>
                      )}
              </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        {editingId === statement.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={handleEditSave}
                              className="h-9 px-3 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleEditCancel}
                              className="h-9 px-3"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditStart(statement)}
                              className="h-9 px-3 hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Edit3 className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onDelete(statement.id)}
                              className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};