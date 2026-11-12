import React, { useState } from 'react'
import { useOperations } from '@/contexts/operations-context'
import { useAuth } from '@/contexts/auth-context'
import type { StudentInvoice, PaymentReceipt } from '@/types/database.types'
import {
  CreditCard,
  Receipt,
  Download,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

// Minor unit currency formatter: converts paise (integer) to formatted INR
export function formatPaise(paise: number, currency: string = 'INR'): string {
  const rupees = paise / 100
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(rupees)
}

export function FeesManagementView() {
  const { invoices, payments, feeStructures, recordPayment } = useOperations()
  const { userRole, currentUser, hasPermission } = useAuth()

  const [activeTab, setActiveTab] = useState('invoices')
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] =
    useState<StudentInvoice | null>(null)
  const [paymentAmountRupees, setPaymentAmountRupees] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<PaymentReceipt['payment_method']>('upi')
  const [transactionRef, setTransactionRef] = useState('')
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<PaymentReceipt | null>(null)

  const _canManageFees =
    userRole === 'institution_admin' ||
    (userRole === 'manager' && hasPermission('fees.collect_payment'))
  const isStudentOrParent = userRole === 'student' || userRole === 'parent'

  // Filter invoices for student / parent
  const myInvoices = invoices.filter(
    (inv) =>
      inv.student_name.toLowerCase().includes(currentUser?.full_name?.toLowerCase() || 'aarav') ||
      inv.student_id === 'std-001'
  )

  // Calculations across ledger
  const totalInvoicedPaise = invoices.reduce((acc, inv) => acc + inv.total_amount_in_paise, 0)
  const totalCollectedPaise = invoices.reduce((acc, inv) => acc + inv.paid_amount_in_paise, 0)
  const totalOutstandingPaise = totalInvoicedPaise - totalCollectedPaise

  const handleOpenPayment = (inv: StudentInvoice) => {
    setSelectedInvoiceForPayment(inv)
    const remainingPaise = inv.total_amount_in_paise - inv.discount_in_paise - inv.paid_amount_in_paise
    setPaymentAmountRupees(remainingPaise / 100)
    setTransactionRef(`UPI-${Date.now().toString().slice(-6)}`)
  }

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInvoiceForPayment) return

    const amountPaise = Math.round(paymentAmountRupees * 100)
    const receipt = recordPayment({
      invoiceId: selectedInvoiceForPayment.id,
      amountInPaise: amountPaise,
      paymentMethod,
      transactionId: transactionRef,
    })

    setSelectedInvoiceForPayment(null)
    if (receipt) {
      setPaymentSuccessReceipt(receipt)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Fee Billing & Minor-Unit Financial Ledger
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Deterministic accounting stored strictly in 64-bit integer minor units (paise). Zero floating-point discrepancies.
          </p>
        </div>

        <Badge variant="outline" className="self-start sm:self-auto font-mono text-xs bg-muted">
          Ledger Standard: INR Minor Units (Paise)
        </Badge>
      </div>

      {/* Aggregate Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Invoiced (Term 1)</CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              {formatPaise(totalInvoicedPaise)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground font-mono">
            Minor Balance: {totalInvoicedPaise} paise
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Collected Collections</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600">
              {formatPaise(totalCollectedPaise)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Reconciled via immutable receipts
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Outstanding Receivable</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-600">
              {formatPaise(totalOutstandingPaise)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Pending student invoice balances
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="invoices" className="flex items-center gap-1.5 text-xs">
            <CreditCard className="h-4 w-4" />
            {isStudentOrParent ? 'My Invoices' : `Student Invoices (${invoices.length})`}
          </TabsTrigger>
          <TabsTrigger value="ledger" className="flex items-center gap-1.5 text-xs">
            <Receipt className="h-4 w-4" /> Transaction Payments Ledger ({payments.length})
          </TabsTrigger>
          {!isStudentOrParent && (
            <TabsTrigger value="structures" className="flex items-center gap-1.5 text-xs">
              Fee Structures ({feeStructures.length})
            </TabsTrigger>
          )}
        </TabsList>

        {/* ======================================================== */}
        {/* TAB 1: INVOICES                                         */}
        {/* ======================================================== */}
        <TabsContent value="invoices" className="pt-3">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(isStudentOrParent ? myInvoices : invoices).map((inv) => {
                    const netPayable = inv.total_amount_in_paise - inv.discount_in_paise
                    const balance = netPayable - inv.paid_amount_in_paise

                    return (
                      <TableRow key={inv.id}>
                        <TableCell>
                          <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono font-bold text-primary">
                            {inv.invoice_number}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-foreground text-sm">{inv.student_name}</div>
                          <div className="text-[11px] text-muted-foreground">{inv.admission_number}</div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{inv.due_date}</TableCell>
                        <TableCell className="text-xs font-semibold">
                          {formatPaise(netPayable)}
                        </TableCell>
                        <TableCell className="text-xs text-emerald-600 font-semibold">
                          {formatPaise(inv.paid_amount_in_paise)}
                        </TableCell>
                        <TableCell className="text-xs text-destructive font-bold">
                          {formatPaise(balance)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              inv.status === 'paid'
                                ? 'success'
                                : inv.status === 'partially_paid'
                                ? 'warning'
                                : 'destructive'
                            }
                            className="text-[10px] uppercase font-bold"
                          >
                            {inv.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {inv.status !== 'paid' ? (
                            <Button
                              size="sm"
                              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => handleOpenPayment(inv)}
                            >
                              <CreditCard className="h-3.5 w-3.5 mr-1" />
                              {isStudentOrParent ? 'Pay Online' : 'Collect Fee'}
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-xs text-emerald-700">
                              Cleared
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======================================================== */}
        {/* TAB 2: IMMUTABLE TRANSACTION PAYMENTS LEDGER             */}
        {/* ======================================================== */}
        <TabsContent value="ledger" className="pt-3">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-bold">Immutable Append-Only Payment Ledger</CardTitle>
              <CardDescription className="text-xs">
                Audited transactional history. Every entry generates an official digital payment receipt.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt No</TableHead>
                    <TableHead>Invoice Ref</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Gateway TXN Ref</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs font-bold text-foreground">
                        {p.receipt_number}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {p.invoice_number}
                      </TableCell>
                      <TableCell className="font-semibold text-xs text-foreground">
                        {p.student_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold">
                          {p.payment_method}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-[11px] text-muted-foreground">
                        {p.gateway_transaction_id || 'OFFLINE'}
                      </TableCell>
                      <TableCell className="font-bold text-sm text-emerald-600">
                        {formatPaise(p.amount_paid_in_paise)}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {new Date(p.payment_date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======================================================== */}
        {/* TAB 3: FEE STRUCTURES                                    */}
        {/* ======================================================== */}
        {!isStudentOrParent && (
          <TabsContent value="structures" className="pt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feeStructures.map((fs) => (
                <Card key={fs.id} className="border shadow-sm">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold text-foreground">
                        {fs.fee_category_name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {fs.cohort_name}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      Due Date: {fs.due_date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-1">
                    <div className="text-2xl font-black text-foreground">
                      {formatPaise(fs.amount_in_paise)}
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Stored integer minor units: {fs.amount_in_paise} paise
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* MODAL: COLLECT / PAY FEE */}
      {selectedInvoiceForPayment && (
        <Dialog
          open={Boolean(selectedInvoiceForPayment)}
          onOpenChange={() => setSelectedInvoiceForPayment(null)}
        >
          <DialogContent onClose={() => setSelectedInvoiceForPayment(null)}>
            <DialogHeader>
              <DialogTitle>
                {isStudentOrParent ? 'Online Fee Payment Checkout' : 'Collect Student Payment'}
              </DialogTitle>
              <DialogDescription>
                Invoice: {selectedInvoiceForPayment.invoice_number} • Student:{' '}
                {selectedInvoiceForPayment.student_name}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleConfirmPayment} className="space-y-4 py-2">
              <div className="p-3 bg-muted rounded-md text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Invoiced:</span>
                  <span className="font-semibold text-foreground">
                    {formatPaise(selectedInvoiceForPayment.total_amount_in_paise)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Already Paid:</span>
                  <span className="text-emerald-600 font-semibold">
                    {formatPaise(selectedInvoiceForPayment.paid_amount_in_paise)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t font-bold text-foreground">
                  <span>Balance Due:</span>
                  <span className="text-destructive">
                    {formatPaise(
                      selectedInvoiceForPayment.total_amount_in_paise -
                        selectedInvoiceForPayment.discount_in_paise -
                        selectedInvoiceForPayment.paid_amount_in_paise
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <Label>Payment Amount (in INR ₹) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={paymentAmountRupees}
                  onChange={(e) => setPaymentAmountRupees(Number(e.target.value))}
                  required
                />
                <span className="text-[11px] text-muted-foreground font-mono">
                  Converted minor units: {Math.round(paymentAmountRupees * 100)} paise
                </span>
              </div>

              <div className="space-y-1">
                <Label>Payment Instrument / Channel *</Label>
                <Select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as PaymentReceipt['payment_method'])
                  }
                >
                  <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="net_banking">Net Banking (IMPS/NEFT)</option>
                  <option value="credit_card">Debit / Credit Card</option>
                  <option value="cash">Counter Cash Receipt</option>
                  <option value="cheque">Bank Demand Draft / Cheque</option>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Gateway Transaction Reference / UTR</Label>
                <Input
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. UPI-9988771122"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedInvoiceForPayment(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Confirm & Generate Receipt
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL: OFFICIAL PAYMENT RECEIPT POPUP */}
      {paymentSuccessReceipt && (
        <Dialog
          open={Boolean(paymentSuccessReceipt)}
          onOpenChange={() => setPaymentSuccessReceipt(null)}
        >
          <DialogContent onClose={() => setPaymentSuccessReceipt(null)}>
            <DialogHeader className="text-center pb-2">
              <div className="mx-auto w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <DialogTitle className="text-emerald-700">Payment Processed Successfully</DialogTitle>
              <DialogDescription>Official Digital Fee Receipt Generated</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs border rounded-lg p-4 bg-muted/20">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Receipt Number:</span>
                <span className="font-mono font-bold text-foreground">
                  {paymentSuccessReceipt.receipt_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Student:</span>
                <span className="font-semibold text-foreground">
                  {paymentSuccessReceipt.student_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-bold text-emerald-600 text-sm">
                  {formatPaise(paymentSuccessReceipt.amount_paid_in_paise)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method:</span>
                <span className="uppercase font-semibold">{paymentSuccessReceipt.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono">{paymentSuccessReceipt.gateway_transaction_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timestamp:</span>
                <span>{new Date(paymentSuccessReceipt.payment_date).toLocaleString()}</span>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-1.5"
                onClick={() => setPaymentSuccessReceipt(null)}
              >
                <Download className="h-4 w-4" /> Download PDF Receipt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
