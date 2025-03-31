export const baseUrl = process.env.NODE_ENV === 'production' ? 'https://www.minhapetpage.com' : 'http://localhost:3000';

export const capitalizeFirstLetter = string => {
  return string
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const calculateTimeInFamily = formData => {
  console.log('Este é o formData:', formData);
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

  // Monta a string apenas com os valores maiores que 0
  const parts = [];
  if (years > 0) parts.push(`${years} ano(s),`);
  if (months > 0) parts.push(`${months} mês(es),`);
  if (days > 0) parts.push(`${days} dia(s)`);
  if (hours > 0) parts.push(`e ${hours} hora(s)`);

  return parts.join(' ');
};
