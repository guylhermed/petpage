export const isAmbienteDev = () => process.env.NEXT_PUBLIC_FIREBASE_ENV === 'dev';

export const baseUrl =
  typeof window !== 'undefined'
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
  if (!formData) return '';

  let dataParaUsar = '';
  if (formData.mostrarDataAdocao && formData.adoptionDate) {
    dataParaUsar = formData.adoptionDate;
  } else if (formData.mostrarDataNascimento && formData.birthDate) {
    dataParaUsar = formData.birthDate;
  }

  if (!dataParaUsar) return '';

  const dataInicial = new Date(dataParaUsar);
  const agora = new Date();
  const diffTime = Math.abs(agora - dataInicial);
  const diffDias = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDias < 30) return `${diffDias} dia(s)`;
  if (diffDias < 365) return `${Math.floor(diffDias / 30)} mês(es)`;

  const anos = Math.floor(diffDias / 365);
  const mesesRestantes = Math.floor((diffDias % 365) / 30);

  return mesesRestantes > 0 ? `${anos} ano(s) e ${mesesRestantes} mês(es)` : `${anos} ano(s)`;
};
