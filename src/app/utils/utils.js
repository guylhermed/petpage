export const isAmbienteDev = () => process.env.NEXT_PUBLIC_FIREBASE_ENV === 'dev';

export const baseUrl = typeof window !== 'undefined'
  ? window.location.origin
  : isAmbienteDev()
    ? 'http://localhost:3000'
    : 'https://www.minhapetpage.com';

export const abacatepayApiKey = isAmbienteDev()
  ? process.env.ABACATEPAY_DEV_API_KEY
  : process.env.ABACATEPAY_PROD_API_KEY;

export const abacatepayWebhookSecret = isAmbienteDev()
  ? process.env.ABACATEPAY_DEV_WEBHOOK_SECRET
  : process.env.ABACATEPAY_PROD_WEBHOOK_SECRET;

export const capitalizeFirstLetter = string => {
  return string
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const calculateTimeInFamily = formData => {
  if (formData.adoptionDate) {
    return formatTimeDifference(new Date(formData.adoptionDate));
  } else if (formData.birthDate) {
    return formatTimeDifference(new Date(formData.birthDate));
  }
  return '';
};

const formatTimeDifference = startDate => {
  const now = new Date();
  let diff = now - startDate;

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  diff %= 1000 * 60 * 60 * 24 * 365;

  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  diff %= 1000 * 60 * 60 * 24 * 30;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff %= 1000 * 60 * 60 * 24;

  const hours = Math.floor(diff / (1000 * 60 * 60));

  const parts = [];
  if (years > 0) parts.push(`${years} ano(s),`);
  if (months > 0) parts.push(`${months} mês(es),`);
  if (days > 0) parts.push(`${days} dia(s)`);
  if (hours > 0) parts.push(`e ${hours} hora(s)`);

  return parts.join(' ');
};
