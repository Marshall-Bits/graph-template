const getIndexOfColumn = (title: string, data: string[][]) => {
  // Helper function to normalize strings
  const normalizeString = (str: string) => {
    if (typeof str !== "string") {
      return "";
    }

    return str
      .normalize("NFD") // Normalize to decomposed form (NFD)
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
      .toLowerCase();
  };

  const searchString = normalizeString(title);

  let fontIndex = -1;
  for (let row of data) {
    fontIndex = row.findIndex((cell) => normalizeString(cell) === searchString);
    if (fontIndex > -1) break;
  }

  return fontIndex;
};

export { getIndexOfColumn };
