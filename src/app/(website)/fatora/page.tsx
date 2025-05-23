'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileDownload, FaCheckCircle, FaClock, FaTimesCircle, FaPrint } from 'react-icons/fa';
import Image from 'next/image';
import logo from '../../../../assets/logo.png';
import Link from 'next/link';
import styles from './Fatora.module.css';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { get_orders } from '@/calls/constant';
import { takeItemsFormLocalStorage } from '@/redux/slices/orders';

const Fatora = () => {
  const { items } = useSelector((state: RootState) => state.ordersStorage)
  const dispatch = useDispatch()
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const pending = searchParams.get("pending");
  const id = searchParams.get("id");
  const source_data_type = searchParams.get("source_data.type");
  const sub_type = searchParams.get("source_data.sub_type");
  const amount_cents = searchParams.get("amount_cents");
  const created_at = searchParams.get("created_at");
      console.log(sub_type);

  const [isMounted, setIsMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);


  const [invoiceData, setInvoiceData] = useState({
    status: 'قيد الانتظار',
    id: id,
    date: created_at,
    paymentMethod: source_data_type,
    cardType: sub_type,
    amount: Number(amount_cents)/100,
  });


  useEffect(() => {
      const data = localStorage.getItem(get_orders)
      if (data) {
          dispatch(takeItemsFormLocalStorage(JSON.parse(data)))
      }
  }, [dispatch])

   
     useEffect(()=>{
         if(pending === 'true'){
          setInvoiceData((prev)=>({
            ...prev,
            status: 'قيد الانتظار',
          }))
        }
      else{
          if(success){
            setInvoiceData((prev)=>({
              ...prev,
              status: 'ناجحة',
            }))
          
          }else{
            setInvoiceData((prev)=>({
              ...prev,
              status: 'فاشلة',
            }))
          
          }
      }
  
     },[pending,invoiceData.status])

  useEffect(() => {
    setIsMounted(true);

    setInvoiceData(prev => ({
      ...prev,
      date: new Date().toLocaleString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
  }, []);


 
  const downloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      
      const invoiceElement = document.getElementById('invoice');
      
      if (!invoiceElement) {
        throw new Error('Invoice element not found');
      }
      
      invoiceElement.classList.add(styles.printing);
      
      const canvas = await html2canvas(invoiceElement, {
        scale: 1.8,
        logging: false,
        useCORS: true,
        backgroundColor: '#FFFFFF',
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgWidth = 190; // عرض أقل بقليل من A4 للهوامش
      const pageHeight = 277; // ارتفاع أقل بقليل من A4 للهوامش
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 10; // هامش علوي
      
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      
      let remainingHeight = imgHeight + position - pageHeight;
      while (remainingHeight > 0) {
        position = -remainingHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        remainingHeight -= pageHeight;
      }
      
      pdf.save(`invoice_${invoiceData.id}.pdf`);
      
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.');
    } finally {
      const invoiceElement = document.getElementById('invoice');
      if (invoiceElement) {
        invoiceElement.classList.remove(styles.printing);
      }
      setIsDownloading(false);
    }
  };
  

  const printInvoice = () => {
    const invoiceElement = document.getElementById('invoice');
    const printContents = invoiceElement ? invoiceElement.outerHTML : '';
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const getStatusIcon = () => {
    switch(invoiceData.status) {
      case 'ناجحة':
        return <FaCheckCircle className="text-green-500 text-2xl" />;
      case 'فاشلة':
        return <FaTimesCircle className="text-red-500 text-2xl" />;
      case 'قيد الانتظار':
        return <FaClock className="text-yellow-500 text-2xl" />;
      default:
        return <FaCheckCircle className="text-blue-500 text-2xl" />;
    }
  };

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse bg-gray-200 rounded-lg w-96 h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.thankYouSection} ${styles.noPrint}`}>
        <Image 
          src={logo} 
          alt="شعار الشركة"
          width={200}
          height={200}
        />
        <div className="pr-[70px]  text-end">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">شكرًا لتعاملك معنا</h2>
          <p className="text-gray-600 mb-6">نقدّر ثقتك بنا ونسعى دائمًا لتقديم الأفضل لك.</p>
          <Link
            href={'/contact'}
            className="bg-blue-600  hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200">
            تواصل معنا
          </Link>
        </div>
      </div>
      
      <div  className={styles.invoiceSection}>
        <motion.div 
        id='invoice'
        key={'4'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div  className={styles.invoiceContainer}>
            {/* Invoice Header */}
            <div className={styles.invoiceHeader}>
              <h1 className={styles.invoiceTitle}>فاتورة الدفع</h1>
              <p className={styles.invoiceSubtitle}>شكراً لاستخدامك خدمتنا</p>
            </div>
            
            {/* Invoice Status */}
            <div className={styles.statusContainer}>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {getStatusIcon()}
                <span className={styles.statusText}>حالة الدفع:</span>
              </div>
              <motion.p 
                className={`${styles.statusText} ${
                  invoiceData.status === 'قيد الانتظار' ? 'text-yellow-600' : 
                  invoiceData.status === 'ناجحة' ? 'text-green-600' : 'text-red-600'
                }`}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                {invoiceData.status}
              </motion.p>
            </div>
            
            {/* Invoice Details */}
            <div className={styles.detailsContainer}>
              <AnimatePresence
              key={'1'}
              >
                <motion.div
                key={'5'}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className={styles.detailRow}
                >
                  <span className={styles.detailLabel}>رقم الفاتورة:</span>
                  <span className={styles.detailValue}>{invoiceData.id}</span>
                </motion.div>

                <motion.div
                key={'6'}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className={styles.detailRow}
                >
                  <span className={styles.detailLabel}>تاريخ الدفع:</span>
                  <span className={styles.detailValue}>{invoiceData.date}</span>
                </motion.div>

                <motion.div
                key={'7'}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className={styles.detailRow}
                >
                  <span className={styles.detailLabel}>طريقة الدفع:</span>
                  <span className={styles.detailValue}>{invoiceData.paymentMethod}</span>
                </motion.div>

                <motion.div
                key={'8'}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className={styles.detailRow}
                >
                  <span className={styles.detailLabel}>نوع البطاقة:</span>
                  <span className={styles.detailValue}>{invoiceData.cardType}</span>
                </motion.div>
              </AnimatePresence>

              {/* Items Table */}
              <motion.div
              key={'2'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <h3 className={styles.itemsTitle}>تفاصيل المشتريات</h3>
                <div className={styles.itemsTable}>
                  <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                      <tr>
                        <th className={styles.tableHeaderCell}>البند</th>
                        <th className={styles.tableHeaderCell}>المبلغ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item , index) => (
                        <tr key={index} className={styles.tableRow}>
                          <td className={styles.tableCell}>{item.name}</td>
                          <td className={styles.tableCell}>{item.price.toFixed(2)} جنيه</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Total Amount */}
              <motion.div
              key={'3'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                className={styles.totalContainer}
              >
                <span className={styles.totalLabel}>المبلغ الإجمالي:</span>
                <span className={styles.totalValue}>{invoiceData.amount.toFixed(2)} جنيه</span>
              </motion.div>
            </div>
            
            {/* Invoice Footer */}
            <div className={styles.footer}>
              <div className={styles.buttonGroup}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  className={`${styles.button} ${styles.primaryButton}`}
                >
                  <FaFileDownload/>
                  <span>{isDownloading ? 'جاري التحميل...' : 'PDF'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={printInvoice}
                  className={`${styles.button} ${styles.secondaryButton}`}
                >
                  <FaPrint />
                  <span>طباعة</span>
                </motion.button>
              </div>
              
              <p className={styles.footerText}>
                هذه الفاتورة صالحة كإثبات دفع رسمي
              </p>
              
              <div className={styles.contactInfo}>
                <p>للاستفسارات: support@example.com</p>
                <p>هاتف: 0123456789</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Fatora;