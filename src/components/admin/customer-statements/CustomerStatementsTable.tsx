import React, { useState } from 'react';
import { CustomerStatement } from './CustomerStatements';
import { formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Save, X, Calendar, User, DollarSign } from 'lucide-react';
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

  // Mobile Card Component
  const MobileCard: React.FC<{ statement: CustomerStatement; index: number }> = ({ statement, index }) => (
    <Card className={`mb-4 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'} transition-all hover:shadow-md`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {editingId === statement.id ? (
              <Input
                value={editValues.client_name}
                onChange={(e) => handleInputChange('client_name', e.target.value)}
                className="font-semibold text-lg mb-2"
              />
            ) : (
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                {statement.client_name}
              </CardTitle>
            )}
            
            {editingId === statement.id ? (
              <Input
                value={editValues.date_range}
                onChange={(e) => handleInputChange('date_range', e.target.value)}
                className="text-sm"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                {statement.date_range}
              </div>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            {editingId === statement.id ? (
              <>
                <Button size="sm" onClick={handleEditSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleEditCancel}>
                  <X className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => handleEditStart(statement)}>
                  <Edit3 className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onDelete(statement.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Opening Balance</div>
            {editingId === statement.id ? (
              <Input
                type="number"
                step="0.01"
                value={editValues.opening_balance}
                onChange={(e) => handleInputChange('opening_balance', e.target.value)}
                className="font-mono text-right"
              />
            ) : (
              <div className="font-semibold font-mono">{formatCurrency(statement.opening_balance)}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Invoiced Amount</div>
            {editingId === statement.id ? (
              <Input
                type="number"
                step="0.01"
                value={editValues.invoiced_amount}
                onChange={(e) => handleInputChange('invoiced_amount', e.target.value)}
                className="font-mono text-right"
              />
            ) : (
              <div className="font-semibold font-mono">{formatCurrency(statement.invoiced_amount)}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount Paid</div>
            {editingId === statement.id ? (
              <Input
                type="number"
                step="0.01"
                value={editValues.amount_paid}
                onChange={(e) => handleInputChange('amount_paid', e.target.value)}
                className="font-mono text-right"
              />
            ) : (
              <div className="font-semibold font-mono text-green-600">{formatCurrency(statement.amount_paid)}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Balance Due</div>
            {editingId === statement.id ? (
              <Input
                type="number"
                step="0.01"
                value={editValues.balance_due}
                onChange={(e) => handleInputChange('balance_due', e.target.value)}
                className="font-mono text-right"
              />
            ) : (
              <div className="flex items-center gap-2">
                <Badge 
                  variant={statement.balance_due > 0 ? "destructive" : "secondary"}
                  className="font-mono"
                >
                  {formatCurrency(statement.balance_due)}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
        <>
          {/* Mobile/Tablet Card View (below lg breakpoint) */}
          <div className="lg:hidden space-y-4">
            {statements.map((statement, index) => (
              <MobileCard key={statement.id} statement={statement} index={index} />
            ))}
          </div>

          {/* Desktop Table View (lg and above) */}
          <div className="hidden lg:block">
            <div className="w-full overflow-hidden border rounded-lg">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm">
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="font-semibold text-foreground w-1/6 min-w-0">
                      <div className="truncate">Client Name</div>
                    </TableHead>
                    <TableHead className="font-semibold text-foreground w-1/6 min-w-0">
                      <div className="truncate">Date Range</div>
                    </TableHead>
                    <TableHead className="text-right font-semibold text-foreground w-1/6 min-w-0">
                      <div className="truncate">Opening Balance</div>
                    </TableHead>
                    <TableHead className="text-right font-semibold text-foreground w-1/6 min-w-0">
                      <div className="truncate">Invoiced Amount</div>
                    </TableHead>
                    <TableHead className="text-right font-semibold text-foreground w-1/6 min-w-0">
                      <div className="truncate">Amount Paid</div>
                    </TableHead>
                    <TableHead className="text-right font-semibold text-foreground w-1/6 min-w-0">
                      <div className="truncate">Balance Due</div>
                    </TableHead>
                    <TableHead className="text-center font-semibold text-foreground w-32">
                      Actions
                    </TableHead>
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
                      <TableCell className="py-4 w-1/6 min-w-0">
                        {editingId === statement.id ? (
                          <Input
                            value={editValues.client_name}
                            onChange={(e) => handleInputChange('client_name', e.target.value)}
                            className="w-full text-sm"
                          />
                        ) : (
                          <div className="font-medium text-foreground break-words">{statement.client_name}</div>
                        )}
                      </TableCell>
                      
                      <TableCell className="py-4 w-1/6 min-w-0">
                        {editingId === statement.id ? (
                          <Input
                            value={editValues.date_range}
                            onChange={(e) => handleInputChange('date_range', e.target.value)}
                            className="w-full text-sm"
                          />
                        ) : (
                          <div className="text-muted-foreground text-sm break-words">{statement.date_range}</div>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-right py-4 font-mono w-1/6 min-w-0">
                        {editingId === statement.id ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editValues.opening_balance}
                            onChange={(e) => handleInputChange('opening_balance', e.target.value)}
                            className="w-full text-right font-mono text-sm"
                          />
                        ) : (
                          <div className="text-foreground font-semibold text-sm break-all">
                            {formatCurrency(statement.opening_balance)}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-right py-4 font-mono w-1/6 min-w-0">
                        {editingId === statement.id ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editValues.invoiced_amount}
                            onChange={(e) => handleInputChange('invoiced_amount', e.target.value)}
                            className="w-full text-right font-mono text-sm"
                          />
                        ) : (
                          <div className="text-foreground font-semibold text-sm break-all">
                            {formatCurrency(statement.invoiced_amount)}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-right py-4 font-mono w-1/6 min-w-0">
                        {editingId === statement.id ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editValues.amount_paid}
                            onChange={(e) => handleInputChange('amount_paid', e.target.value)}
                            className="w-full text-right font-mono text-sm"
                          />
                        ) : (
                          <div className="text-green-600 font-semibold text-sm break-all">
                            {formatCurrency(statement.amount_paid)}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-right py-4 font-mono w-1/6 min-w-0">
                        {editingId === statement.id ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editValues.balance_due}
                            onChange={(e) => handleInputChange('balance_due', e.target.value)}
                            className="w-full text-right font-mono text-sm"
                          />
                        ) : (
                          <div className={`font-semibold text-sm break-all ${
                            statement.balance_due > 0 ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            {formatCurrency(statement.balance_due)}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell className="py-4 w-32">
                        <div className="flex items-center justify-center gap-1">
                          {editingId === statement.id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={handleEditSave}
                                className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleEditCancel}
                                className="h-8 px-2"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditStart(statement)}
                                className="h-8 px-2 hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onDelete(statement.id)}
                                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                              >
                                <Trash2 className="h-3 w-3" />
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
        </>
      )}
    </div>
  );
};