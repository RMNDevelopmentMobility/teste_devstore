/**
 * Limpa e valida uma URL de imagem
 * Remove caracteres extras (brackets, aspas) que algumas APIs retornam
 * Retorna null se a URL não for válida
 */
export const cleanImageUrl = (url: string): string | null => {
  if (!url) return null;

  // Remove brackets and quotes that some APIs return
  let cleaned = url.replace(/^\[?"?|"?\]?$/g, '');
  cleaned = cleaned.trim();

  // Check if it's a valid URL
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    return null;
  }

  return cleaned;
};

/**
 * Retorna a primeira URL de imagem válida de um array
 */
export const getValidImageUrl = (images: readonly string[]): string | null => {
  for (const img of images) {
    const cleaned = cleanImageUrl(img);
    if (cleaned) return cleaned;
  }
  return null;
};
