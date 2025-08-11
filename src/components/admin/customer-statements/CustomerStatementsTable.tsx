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

  if (statements.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No customer statements found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Name</TableHead>
            <TableHead>Date Range</TableHead>
            <TableHead className="text-right">Opening Balance</TableHead>
            <TableHead className="text-right">Invoiced Amount</TableHead>
            <TableHead className="text-right">Amount Paid</TableHead>
            <TableHead className="text-right">Balance Due</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statements.map((statement) => (
            <TableRow key={statement.id}>
              <TableCell className="font-medium">
                {editingId === statement.id ? (
                  <input
                    type="text"
                    value={editValues.client_name}
                    onChange={(e) => handleInputChange('client_name', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm bg-background"
                  />
                ) : (
                  statement.client_name
                )}
              </TableCell>
              <TableCell>
                {editingId === statement.id ? (
                  <input
                    type="text"
                    value={editValues.date_range}
                    onChange={(e) => handleInputChange('date_range', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm bg-background"
                  />
                ) : (
                  statement.date_range
                )}
              </TableCell>
              <TableCell className="text-right">
                {editingId === statement.id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editValues.opening_balance}
                    onChange={(e) => handleInputChange('opening_balance', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm text-right bg-background"
                  />
                ) : (
                  formatCurrency(statement.opening_balance)
                )}
              </TableCell>
              <TableCell className="text-right">
                {editingId === statement.id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editValues.invoiced_amount}
                    onChange={(e) => handleInputChange('invoiced_amount', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm text-right bg-background"
                  />
                ) : (
                  formatCurrency(statement.invoiced_amount)
                )}
              </TableCell>
              <TableCell className="text-right">
                {editingId === statement.id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editValues.amount_paid}
                    onChange={(e) => handleInputChange('amount_paid', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm text-right bg-background"
                  />
                ) : (
                  formatCurrency(statement.amount_paid)
                )}
              </TableCell>
              <TableCell className="text-right">
                {editingId === statement.id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editValues.balance_due}
                    onChange={(e) => handleInputChange('balance_due', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm text-right bg-background"
                  />
                ) : (
                  formatCurrency(statement.balance_due)
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  {editingId === statement.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={handleEditSave}
                        className="h-8 w-8 p-0"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleEditCancel}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditStart(statement)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(statement.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
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
  );
};