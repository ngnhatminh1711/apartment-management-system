export const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone: string): boolean =>
    /^(0[3-9]\d{8})$/.test(phone.replace(/\s/g, ""));

export const isValidIdCard = (id: string): boolean => /^\d{9}$|^\d{12}$/.test(id);

export const isValidLicensePlate = (plate: string): boolean =>
    /^\d{2}[A-Z]{1,2}-\d{3,5}(\.\d{2})?$/.test(plate.toUpperCase());

export const isStrongPassword = (pwd: string): boolean => pwd.length >= 8;

export const isValidBillingMonth = (month: string): boolean => /^\d{4}-\d{2}$/.test(month);
