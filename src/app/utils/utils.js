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
  if (!formData) return '';

  let dataParaUsar = '';
  if (formData.adoptionDate && formData.includeAdoptionDate) {
    dataParaUsar = formData.adoptionDate;
  } else if (formData.birthDate && formData.includeBirthDate) {
    dataParaUsar = formData.birthDate;
  }

  if (!dataParaUsar) return '';

  const dataInicial = new Date(dataParaUsar);
  const agora = new Date();
  const diffTime = Math.abs(agora.getTime() - dataInicial.getTime());
  const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDias < 30) {
    return `${diffDias} dia(s)`;
  } else if (diffDias < 365) {
    const meses = Math.floor(diffDias / 30);
    return `${meses} mês${meses !== 1 ? 'es' : ''}`;
  } else {
    const anos = Math.floor(diffDias / 365);
    const mesesRestantes = Math.floor((diffDias % 365) / 30);
    if (mesesRestantes === 0) {
      return `${anos} ano${anos !== 1 ? 's' : ''}`;
    }
    return `${anos} ano${anos !== 1 ? 's' : ''} e ${mesesRestantes} mês${mesesRestantes !== 1 ? 'es' : ''}`;
  }
};