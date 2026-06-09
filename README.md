# Varecvsce Auth System

نظام تسجيل دخول وإنشاء حسابات حقيقي — React + Vite + TypeScript + Tailwind + Supabase

## إعداد Supabase (مطلوب قبل النشر)

### 1. إنشاء مشروع Supabase
1. اذهب إلى [supabase.com](https://supabase.com) وسجّل مجاناً
2. أنشئ **New Project**
3. اذهب إلى **Settings → API**
4. انسخ **Project URL** و **anon public key**

### 2. تعطيل تأكيد البريد الإلكتروني (مهم)
في Supabase:
- اذهب إلى **Authentication → Providers → Email**
- **أوقف** "Confirm email" حتى يتمكن المستخدمون من الدخول فوراً

### 3. ضبط المتغيرات البيئية على Render
في إعدادات الموقع على Render → **Environment**، أضف:
```
VITE_SUPABASE_URL = https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-public-key
```

## النشر على Render

1. ارفع المشروع على GitHub (package.json في الجذر مباشرة)
2. أنشئ **Static Site** جديد على Render
3. اضبط الإعدادات:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Root Directory:** *(اتركه فارغاً)*
4. أضف المتغيرات البيئية (VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY)
5. انقر Deploy

## التطوير المحلي

```bash
# أنشئ ملف .env في جذر المشروع
cp .env.example .env
# عدّل .env بقيم Supabase الخاصة بك

npm install
npm run dev
```

## الميزات

- تسجيل دخول حقيقي — الحسابات مشتركة بين جميع الأجهزة
- إنشاء حسابات جديدة مخزّنة في Supabase
- جلسة تدوم حتى بعد إغلاق المتصفح
- مؤشر قوة كلمة المرور
- دعم تأكيد البريد الإلكتروني (اختياري)
- لوحة تحكم مع تعديل الملف الشخصي
- تصميم RTL عربي كامل
