export const APP_TITLE = 'ရဲတပ်ဖွဲ့ အချက်အလက်စနစ်';

export const NAV = {
  dashboard: 'ပင်မစာမျက်နှာ',
  people: 'လူပုဂ္ဂိုလ်များ',
  incidents: 'အမှုအခင်းများ',
  records: 'ပြစ်မှုမှတ်တမ်း',
  vehicles: 'ယာဉ်များ',
  logout: 'ထွက်ရန်',
};

export const COMMON = {
  save: 'သိမ်းဆည်းရန်',
  cancel: 'ပယ်ဖျက်ရန်',
  delete: 'ဖျက်ရန်',
  edit: 'ပြင်ဆင်ရန်',
  add: 'အသစ်ထည့်ရန်',
  search: 'ရှာဖွေရန်',
  loading: 'ခေတ္တစောင့်ပါ...',
  actions: 'လုပ်ဆောင်ချက်',
  confirmDelete: 'ဖျက်ရန် သေချာပါသလား?',
  noData: 'အချက်အလက် မရှိပါ',
  error: 'အမှားအယွင်း ဖြစ်ပေါ်ခဲ့သည်',
  success: 'အောင်မြင်ပါသည်',
  back: 'နောက်သို့',
};

export const AUTH = {
  loginTitle: 'စနစ်သို့ ဝင်ရောက်ရန်',
  username: 'အသုံးပြုသူအမည်',
  password: 'စကားဝှက်',
  login: 'ဝင်ရောက်ရန်',
  welcome: 'ကြိုဆိုပါသည်',
};

export const GENDER_LABELS: Record<string, string> = {
  M: 'ကျား',
  F: 'မ',
  Other: 'အခြား',
};

export const INCIDENT_STATUS_LABELS: Record<string, string> = {
  Open: 'ဖွင့်ထား',
  'Under Investigation': 'စုံစမ်းဆဲ',
  Closed: 'ပိတ်သိမ်း',
};

export const CRIMINAL_ROLE_LABELS: Record<string, string> = {
  Suspect: 'သံသယရှိသူ',
  Convict: 'တရားခံ',
  Victim: 'နစ်နာသူ',
  Witness: 'သက်သေ',
};

export const USER_ROLE_LABELS: Record<string, string> = {
  Admin: 'စီမံခန့်ခွဲသူ',
  Officer: 'ရဲအရာရှိ',
};

export const PEOPLE = {
  title: 'လူပုဂ္ဂိုလ်များ',
  add: 'လူပုဂ္ဂိုလ် အသစ်ထည့်ရန်',
  searchPlaceholder: 'နာမည်၊ မှတ်ပုံတင် သို့မဟုတ် အဘအမည်ဖြင့် ရှာရန်',
  fullName: 'နမည်အပြည့်အစုံ',
  nrc: 'မှတ်ပုံတင်အမှတ်',
  alias: 'နာမည်ပြောင်',
  dob: 'မွေးသက္ကရာဇ်',
  gender: 'လိင်',
  fatherName: 'အဘအမည်',
  phone: 'ဖုန်းနံပါတ်',
  address: 'လက်ရှိနေရပ်လိပ်စာ',
};

export const INCIDENTS = {
  title: 'အမှုအခင်းများ',
  add: 'အမှုအခင်း အသစ်ထည့်ရန်',
  caseNumber: 'ပုဒ်မ/အမှုတွဲအမှတ်',
  incidentTitle: 'အမှုခေါင်းစဉ်',
  description: 'အကြောင်းအရာ',
  date: 'ဖြစ်ပွားသည့်ရက်စွဲ',
  location: 'ဖြစ်ပွားသည့်နေရာ',
  status: 'အခြေအနေ',
};

export const RECORDS = {
  title: 'ပြစ်မှုမှတ်တမ်း',
  add: 'မှတ်တမ်း အသစ်ထည့်ရန်',
  personId: 'လူပုဂ္ဂိုလ် ID',
  incidentId: 'အမှုအခင်း ID',
  role: 'အဆင့်',
  arrestDate: 'ဖမ်းဆီးရက်စွဲ',
  punishment: 'ပြစ်ဒဏ်',
  filterByIncident: 'အမှုအခင်းအလိုက်',
  filterByPerson: 'လူပုဂ္ဂိုလ်အလိုက်',
};

export const VEHICLES = {
  title: 'ယာဉ်များ',
  add: 'ယာဉ် အသစ်ထည့်ရန်',
  searchPlate: 'နံပါတ်ပြားဖြင့် ရှာရန်',
  ownerId: 'ပိုင်ရှင် ID',
  plate: 'နံပါတ်ပြား',
  brand: 'တံဆိပ်',
  model: 'မော်ဒယ်',
  color: 'အရောင်',
};

export const DASHBOARD = {
  title: 'ပင်မစာမျက်နှာ',
  subtitle: 'ရဲတပ်ဖွဲ့ အချက်အလက် စီမံခန့်ခွဲမှုစနစ်',
  people: 'လူပုဂ္ဂိုလ်များ',
  incidents: 'အမှုအခင်းများ',
  records: 'ပြစ်မှုမှတ်တမ်း',
  vehicles: 'ယာဉ်များ',
};
