export function getNameInitials(fullname = "First Last") {
  return fullname
    .split(" ")
    .map((word, index) => {
      if (index < 2) return word.charAt(0).toUpperCase();
      return "";
    })
    .join("");
}
