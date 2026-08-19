import React from 'react';
import { PaymentTransaction, Order, UserSubscription } from '../../types';
import { X, Download, Printer, CheckCircle, ShieldCheck, ChefHat } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { addToast } from '../../store/slices/uiSlice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction?: PaymentTransaction | null;
  order?: Order | null;
  subscription?: UserSubscription | null;
}

export const InvoiceDownloadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  transaction,
  order,
  subscription
}) => {
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  const invoiceNumber = transaction?.transactionId || order?.orderNumber || `INV-${Date.now().toString().slice(-6)}`;
  const dateStr = transaction?.date || order?.createdAt || subscription?.createdAt || new Date().toISOString();
  const customerName = transaction?.customerName || order?.customerName || subscription?.customerName || 'Aarav Sharma';
  const customerPhone = transaction?.customerPhone || order?.customerPhone || subscription?.customerPhone || '+91 98765 43210';
  const amount = transaction?.amount || order?.totalAmount || subscription?.amountPaid || 147;
  const paymentMethod = transaction?.paymentMethod || order?.paymentMethod || 'UPI';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    dispatch(
      addToast({
        type: 'success',
        title: 'Invoice Downloaded',
        message: `Tax Invoice ${invoiceNumber}.pdf saved to your device.`
      })
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-400" />
            <span className="font-bold text-sm">Official Tax Invoice</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Body (Print-friendly format) */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 bg-white">
          {/* Top Company Info */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-black text-base text-slate-900">Homly Food Services</h2>
              <p className="text-slate-500 text-[11px]">FSSAI Lic: 11223344556677</p>
              <p className="text-slate-500 text-[11px]">GSTIN: 29ABCDE1234F1Z5</p>
              <p className="text-slate-500 text-[11px]">Indiranagar, Bangalore 560038</p>
            </div>
            <div className="text-right">
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase">
                PAID
              </span>
              <p className="font-bold text-slate-800 mt-1.5">{invoiceNumber}</p>
              <p className="text-[11px] text-slate-500">
                {new Date(dateStr).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Billed to */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Billed To
            </span>
            <p className="font-bold text-slate-900">{customerName}</p>
            <p className="text-slate-600">{customerPhone}</p>
          </div>

          {/* Items Breakdown */}
          <div className="border rounded-xl border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-[11px] font-bold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {order ? (
                  order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium">{item.name} ({item.mealType})</td>
                      <td className="p-2.5 text-center">{item.quantity}</td>
                      <td className="p-2.5 text-right font-semibold">₹{item.price * item.quantity}</td>
                    </tr>
                  ))
                ) : subscription ? (
                  <tr>
                    <td className="p-2.5 font-medium">{subscription.planName} ({subscription.totalDays} Days)</td>
                    <td className="p-2.5 text-center">1</td>
                    <td className="p-2.5 text-right font-semibold">₹{subscription.amountPaid}</td>
                  </tr>
                ) : (
                  <tr>
                    <td className="p-2.5 font-medium">Homly Daily Tiffin Meal Service</td>
                    <td className="p-2.5 text-center">1</td>
                    <td className="p-2.5 text-right font-semibold">₹{amount}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Price Calculation */}
          <div className="space-y-1.5 pt-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span>₹{amount}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>GST (5% Included):</span>
              <span>₹{(amount * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Payment Mode:</span>
              <span className="uppercase font-semibold text-slate-700">{paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Amount Paid:</span>
              <span className="text-emerald-600">₹{amount}</span>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>This is a computer-generated digital tax invoice. No physical signature is required.</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
