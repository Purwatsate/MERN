# ရဲတပ်ဖွဲ့ အချက်အလက်စနစ် — Frontend

React + TypeScript + Vite။ UI အားလုံး **မြန်မာဘာသာ** သာသုံးထားသည်။

## စတင်အသုံးပြုရန်

```bash
cd frontend
npm install
npm run dev
```

Backend ကို အရင် ဖွင့်ထားရန် (`backend` folder တွင် `npm run dev` — port 3000)။

## ဝင်ရောက်ခြင်း

- URL: http://localhost:5173
- ပုံမှန်: `admin` / `Admin@123`

## စာမျက်နှာများ

| လမ်းကြောင်း | အကြောင်းအရာ |
|-------------|-------------|
| `/login` | ဝင်ရောက်ရန် |
| `/` | ပင်မစာမျက်နှာ |
| `/people` | လူပုဂ္ဂိုလ်များ |
| `/incidents` | အမှုအခင်းများ |
| `/records` | ပြစ်မှုမှတ်တမ်း |
| `/vehicles` | ယာဉ်များ |

## ပတ်ဝန်းကျင်

`.env` တွင် API လိပ်စာ:

```
VITE_API_URL=http://localhost:3000
```

Vite proxy: `/api` → `http://localhost:3000` (dev mode)
