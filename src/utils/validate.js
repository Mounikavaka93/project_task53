export function validateName(value, label = "name") {
  const name = value.trim();
  if (!name) return `Enter the ${label}`;
  if (!/^[A-Za-z][A-Za-z .'-]{1,48}$/.test(name)) return "Use letters, spaces, or hyphens";
  return "";
}

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return "Enter your email";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
  return "";
}

export function validatePhone(value) {
  const phone = value.replace(/\s+/g, "");
  if (!phone) return "Enter a mobile number";
  if (!/^[6-9]\d{9}$/.test(phone)) return "Enter a 10-digit mobile number";
  return "";
}

export function validatePassword(value) {
  if (!value) return "Enter a password";
  if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(value)) {
    return "Use 6+ characters with a letter and a number";
  }
  return "";
}

export function validateAge(value) {
  if (!String(value).trim()) return "Enter age";
  if (!/^\d+$/.test(String(value)) || Number(value) < 1 || Number(value) > 100) {
    return "Enter an age from 1 to 100";
  }
  return "";
}

export function luhnOk(value) {
  const digits = value.replace(/\s+/g, "");
  if (!/^\d{16}$/.test(digits)) return false;
  let sum = 0;
  for (let index = 0; index < digits.length; index += 1) {
    let digit = Number(digits[digits.length - 1 - index]);
    if (index % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

export function validateExpiry(value) {
  const match = value.trim().match(/^(\d{2})\/(\d{2})$/);
  if (!match) return "Use MM/YY";
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return "Enter a real month";
  const lastMoment = new Date(year, month, 0, 23, 59, 59);
  if (lastMoment < new Date()) return "This card has expired";
  return "";
}

export function validateUpi(value) {
  const upi = value.trim();
  if (!upi) return "Enter a UPI ID";
  if (!/^[\w.-]{2,}@[A-Za-z]{2,}$/.test(upi)) return "Enter a UPI ID like name@bank";
  return "";
}
