export const Routes = [
    {name:'الرئيسيه', path:'/'},
    {name:'خصومات ', path:'/sales'},
    {name:'الاوردرات السابقه ', path:'/orders'},
    {name:'من نحن ', path:'/about'},
    {name:'التواصل', path:'/contact'},
]

export const Routesfotter = [
    {name:'  36 المحور المركزى - الحصرى - 6 اكتوبر'},
    {name:'📞 01000355808' },
    {name:'📞 01026456902' },
    {name:'📞 01227727874' },
    
   
]

export const imageToBase64 = async (path) => {
    try {
      if (!path) return null; // إرجاع null إذا كان المسار فارغًا
      
      const response = await fetch(path);
      if (!response.ok) return null; // إذا فشل طلب الصورة
      
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Failed to convert image to base64:", error);
      return null;
    }
  };